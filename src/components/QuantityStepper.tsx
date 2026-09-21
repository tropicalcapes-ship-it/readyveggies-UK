import { Minus, Plus } from 'lucide-react'

export function QuantityStepper({
  qty,
  onChange,
  label,
}: {
  qty: number
  onChange: (qty: number) => void
  label: string
}) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-line bg-white p-1">
      <button
        type="button"
        onClick={() => onChange(qty - 1)}
        aria-label={`Remove one ${label}`}
        className="grid h-7 w-7 place-items-center rounded-lg text-farm-800 transition hover:bg-cream-dark"
      >
        <Minus className="h-3.5 w-3.5" strokeWidth={3} />
      </button>
      <span className="min-w-6 text-center text-sm font-bold tabular-nums">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        aria-label={`Add one ${label}`}
        className="grid h-7 w-7 place-items-center rounded-lg text-farm-800 transition hover:bg-cream-dark"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={3} />
      </button>
    </div>
  )
}
