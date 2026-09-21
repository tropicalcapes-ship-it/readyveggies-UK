import { Leaf } from 'lucide-react'
import { DELIVERY_DAYS } from '@/lib/format'

export function Footer() {
  return (
    <footer id="the-farm" className="mt-20 bg-farm-900 text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-farm-600">
              <Leaf className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <span className="font-display text-lg font-bold">
              Farm Fresh Produce
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/75">
            Twenty-two acres of market garden, orchard and meadow on the edge of
            the village. We have been growing here since 1998, and everything in
            the shop was picked, churned or baked within a few hundred metres of
            the packing shed.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-gold">
            Delivery days
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-cream/75">
            {DELIVERY_DAYS.map((day) => (
              <li key={day}>{day} · 8am – 6pm</li>
            ))}
            <li className="text-cream/50">Order by 6pm the day before</li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-gold">
            Farm shop
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-cream/75">
            <li>Hollow Lane, Ashcombe</li>
            <li>Open Wed – Sun, 9am – 4pm</li>
            <li>hello@farmfreshproduce.example</li>
            <li>01234 567 890</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Farm Fresh Produce · Grown and delivered by
        the people who packed it
      </div>
    </footer>
  )
}
