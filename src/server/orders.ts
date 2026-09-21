import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { orders } from '../../db/schema.js'
import { productsById } from '@/data/products'
import { DELIVERY_DAYS, MIN_ORDER_PENCE, deliveryPenceFor } from '@/lib/format'

const OrderInput = z.object({
  customerName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  address: z.string().trim().min(6).max(400),
  postcode: z.string().trim().min(3).max(12),
  deliveryDay: z.enum(DELIVERY_DAYS),
  notes: z.string().trim().max(500).optional().or(z.literal('')),
  items: z
    .array(z.object({ id: z.string(), qty: z.number().int().min(1).max(30) }))
    .min(1)
    .max(40),
})

export interface OrderLineSnapshot {
  id: string
  name: string
  unit: string
  qty: number
  pricePence: number
  linePence: number
}

/** Human-friendly reference the customer can quote on the phone. */
function makeReference() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return `FF-${code}`
}

export const placeOrder = createServerFn({ method: 'POST' })
  .inputValidator(OrderInput)
  .handler(async ({ data }) => {
    // Prices always come from the catalogue on the server, never from the client.
    const lines: Array<OrderLineSnapshot> = []
    for (const item of data.items) {
      const product = productsById.get(item.id)
      if (!product) continue
      lines.push({
        id: product.id,
        name: product.name,
        unit: product.unit,
        qty: item.qty,
        pricePence: product.pricePence,
        linePence: product.pricePence * item.qty,
      })
    }

    if (lines.length === 0) {
      throw new Error('Your basket is empty.')
    }

    const subtotalPence = lines.reduce((sum, l) => sum + l.linePence, 0)
    if (subtotalPence < MIN_ORDER_PENCE) {
      throw new Error('Orders start at £15.00 — please add a little more.')
    }
    const deliveryPence = deliveryPenceFor(subtotalPence)

    const [row] = await db
      .insert(orders)
      .values({
        reference: makeReference(),
        customerName: data.customerName,
        email: data.email,
        phone: data.phone || null,
        address: data.address,
        postcode: data.postcode.toUpperCase(),
        deliveryDay: data.deliveryDay,
        notes: data.notes || null,
        items: lines,
        subtotalPence,
        deliveryPence,
        totalPence: subtotalPence + deliveryPence,
      })
      .returning()

    return { reference: row.reference }
  })

export const getOrder = createServerFn({ method: 'GET' })
  .inputValidator((data: { reference: string }) => data)
  .handler(async ({ data }) => {
    const [row] = await db
      .select()
      .from(orders)
      .where(eq(orders.reference, data.reference))
      .limit(1)

    if (!row) return null

    return {
      reference: row.reference,
      customerName: row.customerName,
      email: row.email,
      address: row.address,
      postcode: row.postcode,
      deliveryDay: row.deliveryDay,
      notes: row.notes,
      items: row.items as Array<OrderLineSnapshot>,
      subtotalPence: row.subtotalPence,
      deliveryPence: row.deliveryPence,
      totalPence: row.totalPence,
      createdAt: row.createdAt?.toISOString() ?? null,
    }
  })
