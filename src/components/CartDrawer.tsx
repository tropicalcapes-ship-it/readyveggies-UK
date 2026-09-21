import { Link } from '@tanstack/react-router'
import { ShoppingBasket, Truck, X } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { QuantityStepper } from '@/components/QuantityStepper'
import {
  FREE_DELIVERY_THRESHOLD_PENCE,
  MIN_ORDER_PENCE,
  formatPence,
  img,
} from '@/lib/format'

export function CartDrawer() {
  const {
    lines,
    isOpen,
    setOpen,
    setQty,
    remove,
    subtotalPence,
    deliveryPence,
    totalPence,
  } = useCart()

  if (!isOpen) return null

  const toFreeDelivery = FREE_DELIVERY_THRESHOLD_PENCE - subtotalPence
  const belowMinimum = subtotalPence > 0 && subtotalPence < MIN_ORDER_PENCE

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-farm-900/45"
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-label="Your basket"
        className="animate-slide-in-right relative flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <ShoppingBasket className="h-5 w-5 text-farm-700" strokeWidth={2.4} />
          <h2 className="text-lg font-bold text-farm-900">Your basket</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close basket"
            className="ml-auto grid h-9 w-9 place-items-center rounded-xl text-muted transition hover:bg-cream-dark hover:text-farm-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-cream-dark">
              <ShoppingBasket className="h-7 w-7 text-farm-600" />
            </span>
            <p className="font-display text-xl font-bold text-farm-900">
              Nothing picked yet
            </p>
            <p className="text-sm text-muted">
              Add a few things from this week's harvest and they will show up here.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-farm-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-farm-800"
            >
              Browse the shop
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {lines.map((line) => (
                <div
                  key={line.id}
                  className="flex gap-3 rounded-2xl border border-line bg-white p-3"
                >
                  <img
                    src={img(line.product.image, 160, 160)}
                    alt={line.product.name}
                    width={72}
                    height={72}
                    className="h-18 w-18 shrink-0 rounded-xl object-cover"
                    style={{ height: 72, width: 72 }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-farm-900">
                      {line.product.name}
                    </p>
                    <p className="text-xs text-muted">
                      {line.product.unit} · {formatPence(line.product.pricePence)}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <QuantityStepper
                        qty={line.qty}
                        label={line.product.name}
                        onChange={(qty) => setQty(line.id, qty)}
                      />
                      <span className="font-bold tabular-nums text-farm-800">
                        {formatPence(line.linePence)}
                      </span>
                      <button
                        type="button"
                        onClick={() => remove(line.id)}
                        className="ml-auto text-xs font-semibold text-muted underline hover:text-farm-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-line bg-white px-5 py-4">
              {toFreeDelivery > 0 ? (
                <p className="mb-3 flex items-center gap-2 rounded-xl bg-cream px-3 py-2 text-xs font-semibold text-farm-800">
                  <Truck className="h-4 w-4 shrink-0" />
                  Add {formatPence(toFreeDelivery)} more for free delivery
                </p>
              ) : (
                <p className="mb-3 flex items-center gap-2 rounded-xl bg-cream px-3 py-2 text-xs font-semibold text-farm-700">
                  <Truck className="h-4 w-4 shrink-0" />
                  Free delivery unlocked
                </p>
              )}
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="font-semibold tabular-nums">
                    {formatPence(subtotalPence)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Delivery</dt>
                  <dd className="font-semibold tabular-nums">
                    {deliveryPence === 0 ? 'Free' : formatPence(deliveryPence)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-line pt-2 text-base">
                  <dt className="font-bold">Total</dt>
                  <dd className="font-bold tabular-nums">
                    {formatPence(totalPence)}
                  </dd>
                </div>
              </dl>
              {belowMinimum && (
                <p className="mt-3 rounded-xl bg-gold/15 px-3 py-2 text-xs font-semibold text-gold-dark">
                  Minimum order is {formatPence(MIN_ORDER_PENCE)} — add{' '}
                  {formatPence(MIN_ORDER_PENCE - subtotalPence)} to check out.
                </p>
              )}
              <Link
                to="/checkout"
                onClick={() => setOpen(false)}
                aria-disabled={belowMinimum}
                className={`mt-4 block rounded-xl px-5 py-3.5 text-center text-sm font-bold text-white transition ${
                  belowMinimum
                    ? 'pointer-events-none bg-farm-700/40'
                    : 'bg-farm-700 hover:bg-farm-800'
                }`}
              >
                Book a delivery slot
              </Link>
              <p className="mt-2 text-center text-[11px] text-muted">
                Pay the driver on delivery — card or cash.
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
