import { useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Loader2, Lock } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { placeOrder } from '@/server/orders'
import {
  DELIVERY_DAYS,
  MIN_ORDER_PENCE,
  formatPence,
  img,
} from '@/lib/format'

export const Route = createFileRoute('/checkout/')({
  component: Checkout,
})

function Checkout() {
  const navigate = useNavigate()
  const { lines, entries, subtotalPence, deliveryPence, totalPence, clear } =
    useCart()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const belowMinimum = subtotalPence < MIN_ORDER_PENCE

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    const form = new FormData(event.currentTarget)
    try {
      const { reference } = await placeOrder({
        data: {
          customerName: String(form.get('customerName') ?? ''),
          email: String(form.get('email') ?? ''),
          phone: String(form.get('phone') ?? ''),
          address: String(form.get('address') ?? ''),
          postcode: String(form.get('postcode') ?? ''),
          deliveryDay: String(
            form.get('deliveryDay') ?? DELIVERY_DAYS[0],
          ) as (typeof DELIVERY_DAYS)[number],
          notes: String(form.get('notes') ?? ''),
          items: entries,
        },
      })
      clear()
      navigate({ to: '/checkout/success', search: { ref: reference } })
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : 'We could not place that order. Please try again.',
      )
      setSubmitting(false)
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-farm-900">
          Your basket is empty
        </h1>
        <p className="mt-3 text-muted">
          Pick a few things from this week's harvest and come back to book a
          delivery slot.
        </p>
        <Link
          to="/"
          hash="shop"
          className="mt-6 inline-block rounded-xl bg-farm-700 px-6 py-3 text-sm font-bold text-white hover:bg-farm-800"
        >
          Browse the shop
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link
        to="/"
        hash="shop"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-farm-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Keep shopping
      </Link>

      <h1 className="mt-5 font-display text-3xl font-bold text-farm-900 sm:text-4xl">
        Book your delivery
      </h1>
      <p className="mt-2 max-w-xl text-muted">
        Order by 6pm the day before and we will pick it fresh that morning. Pay
        the driver at the door — no card details needed now.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-3xl border border-line bg-white p-6 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your name" name="customerName" required />
            <Field label="Email" name="email" type="email" required />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Phone (for the driver)"
              name="phone"
              type="tel"
              required={false}
            />
            <Field label="Postcode" name="postcode" required />
          </div>
          <Field
            label="Delivery address"
            name="address"
            textarea
            required
            placeholder="House or farm name, street, village"
          />

          <fieldset>
            <legend className="text-sm font-bold text-farm-900">
              Delivery day
            </legend>
            <div className="mt-2.5 grid gap-2.5 sm:grid-cols-3">
              {DELIVERY_DAYS.map((day, index) => (
                <label
                  key={day}
                  className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-line px-4 py-3 text-sm font-semibold transition has-checked:border-farm-700 has-checked:bg-farm-700/8"
                >
                  <input
                    type="radio"
                    name="deliveryDay"
                    value={day}
                    defaultChecked={index === 0}
                    className="h-4 w-4 accent-farm-700"
                  />
                  {day}
                </label>
              ))}
            </div>
          </fieldset>

          <Field
            label="Notes for the driver"
            name="notes"
            textarea
            required={false}
            placeholder="Gate code, safe place to leave the box, dogs in the yard…"
          />

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || belowMinimum}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-farm-700 px-6 py-4 text-sm font-bold text-white transition hover:bg-farm-800 disabled:cursor-not-allowed disabled:bg-farm-700/40"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Placing your order…
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Confirm order · {formatPence(totalPence)}
              </>
            )}
          </button>
          {belowMinimum && (
            <p className="text-center text-xs font-semibold text-gold-dark">
              Minimum order is {formatPence(MIN_ORDER_PENCE)}.
            </p>
          )}
        </form>

        <aside className="h-fit rounded-3xl border border-line bg-cream-dark p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-bold text-farm-900">
            Your box
          </h2>
          <ul className="mt-4 space-y-3">
            {lines.map((line) => (
              <li key={line.id} className="flex items-center gap-3">
                <img
                  src={img(line.product.image, 120, 120)}
                  alt=""
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-farm-900">
                    {line.qty} × {line.product.name}
                  </p>
                  <p className="text-xs text-muted">{line.product.unit}</p>
                </div>
                <span className="text-sm font-bold tabular-nums">
                  {formatPence(line.linePence)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-1.5 border-t border-line pt-4 text-sm">
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
              <dt className="font-bold">Total to pay</dt>
              <dd className="font-bold tabular-nums">
                {formatPence(totalPence)}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Anything that is not up to scratch comes off the bill at the door.
            That is easier than a returns policy.
          </p>
        </aside>
      </div>
    </div>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required = true,
  textarea = false,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  textarea?: boolean
  placeholder?: string
}) {
  const shared =
    'mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none transition focus:border-farm-600 focus:bg-white focus:ring-2 focus:ring-farm-600/20'
  return (
    <label className="block">
      <span className="text-sm font-bold text-farm-900">
        {label}
        {!required && (
          <span className="ml-1 font-medium text-muted">(optional)</span>
        )}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          placeholder={placeholder}
          rows={3}
          className={shared}
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          className={shared}
        />
      )}
    </label>
  )
}
