/** Shopping rules, kept in one place so the cart, checkout and copy agree. */
export const DELIVERY_FEE_PENCE = 395
export const FREE_DELIVERY_THRESHOLD_PENCE = 3500
export const MIN_ORDER_PENCE = 1500

export const DELIVERY_DAYS = [
  'Tuesday',
  'Thursday',
  'Saturday',
] as const

export function formatPence(pence: number) {
  return `£${(pence / 100).toFixed(2)}`
}

/** Serve every photo through the Netlify Image CDN rather than the original. */
export function img(
  slug: string,
  width: number,
  height?: number,
  quality = 78,
) {
  const params = new URLSearchParams({
    url: `/img/${slug}.jpg`,
    w: String(width),
    fm: 'webp',
    q: String(quality),
  })
  if (height) {
    params.set('h', String(height))
    params.set('fit', 'cover')
  }
  return `/.netlify/images?${params.toString()}`
}

export function deliveryPenceFor(subtotalPence: number) {
  return subtotalPence >= FREE_DELIVERY_THRESHOLD_PENCE ? 0 : DELIVERY_FEE_PENCE
}
