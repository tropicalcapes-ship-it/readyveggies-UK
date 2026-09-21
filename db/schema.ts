import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core'

/**
 * A placed delivery order. Line items are stored as a JSON snapshot so an
 * order always reflects the catalogue and prices at the moment it was placed.
 */
export const orders = pgTable('orders', {
  id: serial().primaryKey(),
  reference: text().notNull().unique(),
  customerName: text('customer_name').notNull(),
  email: text().notNull(),
  phone: text(),
  address: text().notNull(),
  postcode: text().notNull(),
  deliveryDay: text('delivery_day').notNull(),
  notes: text(),
  items: jsonb().notNull(),
  subtotalPence: integer('subtotal_pence').notNull(),
  deliveryPence: integer('delivery_pence').notNull(),
  totalPence: integer('total_pence').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export type OrderRow = typeof orders.$inferSelect
