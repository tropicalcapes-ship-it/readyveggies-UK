import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import products, { productsById } from '@/data/products'
import type { Product } from '@/data/products'
import { deliveryPenceFor } from '@/lib/format'

const STORAGE_KEY = 'farm-fresh-cart-v1'

export interface CartEntry {
  id: string
  qty: number
}

export interface CartLine extends CartEntry {
  product: Product
  linePence: number
}

interface CartValue {
  entries: Array<CartEntry>
  lines: Array<CartLine>
  count: number
  subtotalPence: number
  deliveryPence: number
  totalPence: number
  add: (id: string, qty?: number) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
  /** Product id of the most recent add, so cards can flash a confirmation. */
  lastAdded: string | null
  isOpen: boolean
  setOpen: (open: boolean) => void
}

const CartContext = createContext<CartValue | null>(null)

function readStored(): Array<CartEntry> {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(
        (e: CartEntry) =>
          e && typeof e.id === 'string' && productsById.has(e.id),
      )
      .map((e: CartEntry) => ({ id: e.id, qty: Math.max(1, Number(e.qty) || 1) }))
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<Array<CartEntry>>([])
  const [lastAdded, setLastAdded] = useState<string | null>(null)
  const [isOpen, setOpen] = useState(false)

  // Hydrate after mount so the server-rendered markup always matches.
  useEffect(() => setEntries(readStored()), [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  const add = useCallback((id: string, qty = 1) => {
    if (!productsById.has(id)) return
    setEntries((current) => {
      const existing = current.find((e) => e.id === id)
      if (existing) {
        return current.map((e) => (e.id === id ? { ...e, qty: e.qty + qty } : e))
      }
      return [...current, { id, qty }]
    })
    setLastAdded(id)
  }, [])

  useEffect(() => {
    if (!lastAdded) return
    const timer = setTimeout(() => setLastAdded(null), 1600)
    return () => clearTimeout(timer)
  }, [lastAdded])

  const setQty = useCallback((id: string, qty: number) => {
    setEntries((current) =>
      qty <= 0
        ? current.filter((e) => e.id !== id)
        : current.map((e) => (e.id === id ? { ...e, qty } : e)),
    )
  }, [])

  const remove = useCallback(
    (id: string) => setEntries((current) => current.filter((e) => e.id !== id)),
    [],
  )

  const clear = useCallback(() => setEntries([]), [])

  const value = useMemo<CartValue>(() => {
    const lines: Array<CartLine> = entries.flatMap((entry) => {
      const product = productsById.get(entry.id)
      if (!product) return []
      return [
        { ...entry, product, linePence: product.pricePence * entry.qty },
      ]
    })
    const subtotalPence = lines.reduce((sum, l) => sum + l.linePence, 0)
    const deliveryPence = subtotalPence === 0 ? 0 : deliveryPenceFor(subtotalPence)
    return {
      entries,
      lines,
      count: lines.reduce((sum, l) => sum + l.qty, 0),
      subtotalPence,
      deliveryPence,
      totalPence: subtotalPence + deliveryPence,
      add,
      setQty,
      remove,
      clear,
      lastAdded,
      isOpen,
      setOpen,
    }
  }, [entries, add, setQty, remove, clear, lastAdded, isOpen])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside a CartProvider')
  return ctx
}

export { products }
