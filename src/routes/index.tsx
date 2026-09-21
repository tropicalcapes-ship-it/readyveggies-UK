import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Search, Sprout, Sun, Truck } from 'lucide-react'
import products, { categories } from '@/data/products'
import { ProductCard } from '@/components/ProductCard'
import {
  DELIVERY_DAYS,
  FREE_DELIVERY_THRESHOLD_PENCE,
  formatPence,
  img,
} from '@/lib/format'

export const Route = createFileRoute('/')({
  component: Home,
})

const steps = [
  {
    icon: Sprout,
    title: 'We pick to order',
    body: 'Nothing is harvested until the orders are in. Your salad was in the ground the morning it reaches you.',
  },
  {
    icon: Truck,
    title: 'We drive it over',
    body: `Our own van, three days a week — ${DELIVERY_DAYS.join(', ')}. No depots, no couriers, no week in a warehouse.`,
  },
  {
    icon: Sun,
    title: 'You pay at the door',
    body: 'Card or cash with the driver. If anything looks less than perfect, we take it back off the bill there and then.',
  },
]

function Home() {
  return (
    <>
      <Hero />
      <Shop />
      <HowItWorks />
      <FarmNote />
    </>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <img
        src={img('hero-farm', 1800)}
        alt="Rows of vegetables at golden hour with the farm barn behind"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-farm-900/92 via-farm-900/75 to-farm-800/45" />
      <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
        <span className="inline-block rounded-full bg-cream/95 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-farm-700">
          This week's harvest is in
        </span>
        <h1 className="mt-5 max-w-2xl font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl md:text-6xl">
          Picked this morning. On your table tonight.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/85">
          A working family farm, not a warehouse. We grow it, pull it, pack it
          and drive it to your door — usually within a day of it leaving the
          soil.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#shop"
            className="rounded-xl bg-gold px-6 py-3.5 text-sm font-extrabold text-farm-900 transition hover:bg-gold-dark hover:text-white"
          >
            Shop the harvest
          </a>
          <a
            href="#how-it-works"
            className="rounded-xl border border-cream/35 px-6 py-3.5 text-sm font-bold text-cream transition hover:bg-white/10"
          >
            How delivery works
          </a>
        </div>

        <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-5 border-t border-white/15 pt-7 sm:grid-cols-4">
          {[
            ['3 days a week', 'Tue, Thu & Sat'],
            ['22 acres', 'Market garden & orchard'],
            ['Under 24h', 'Soil to doorstep'],
            [formatPence(FREE_DELIVERY_THRESHOLD_PENCE), 'For free delivery'],
          ].map(([value, label]) => (
            <div key={label}>
              <dt className="font-display text-xl font-bold text-gold">
                {value}
              </dt>
              <dd className="mt-0.5 text-xs font-semibold uppercase tracking-[0.1em] text-cream/65">
                {label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function Shop() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((product) => {
      const matchesCategory =
        category === 'All' || product.category === category
      if (!matchesCategory) return false
      if (!q) return true
      return (
        product.name.toLowerCase().includes(q) ||
        product.shortDescription.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q)
      )
    })
  }, [query, category])

  return (
    <section id="shop" className="texture-paper scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold text-farm-900 sm:text-4xl">
              In the shop today
            </h2>
            <p className="mt-2 max-w-xl text-muted">
              Thirteen lines from the garden, the dairy and the farmhouse
              bakery. The list changes as the season turns.
            </p>
          </div>
          <label className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <span className="sr-only">Search the shop</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tomatoes, eggs, honey…"
              className="w-full rounded-xl border border-line bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-farm-600 focus:ring-2 focus:ring-farm-600/20"
            />
          </label>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {['All', ...categories].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setCategory(name)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition ${
                category === name
                  ? 'border-farm-700 bg-farm-700 text-white'
                  : 'border-line bg-white text-farm-800 hover:border-farm-500'
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-line bg-white/60 px-6 py-14 text-center">
            <p className="font-display text-xl font-bold text-farm-900">
              Nothing matches that
            </p>
            <p className="mt-2 text-sm text-muted">
              Try a different search, or{' '}
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setCategory('All')
                }}
                className="font-semibold text-farm-700 underline"
              >
                show everything
              </button>
              .
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-cream-dark">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-3xl font-bold text-farm-900 sm:text-4xl">
          How it works
        </h2>
        <p className="mt-2 max-w-xl text-muted">
          Order by 6pm the day before your delivery day. There is no
          subscription and nothing to cancel — order when you want it.
        </p>
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-line bg-white p-6"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-farm-700/10 text-farm-700">
                <step.icon className="h-5 w-5" strokeWidth={2.4} />
              </span>
              <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.14em] text-gold-dark">
                Step {index + 1}
              </p>
              <h3 className="mt-1 font-display text-xl font-bold text-farm-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FarmNote() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="grid items-center gap-8 overflow-hidden rounded-3xl border border-line bg-white md:grid-cols-2">
        <img
          src={img('rainbow-carrots', 900, 700)}
          alt="A bunch of rainbow carrots with the soil still on them"
          className="h-full max-h-80 w-full object-cover"
        />
        <blockquote className="p-8 md:p-10">
          <p className="font-display text-2xl font-bold leading-snug text-farm-900">
            “We stopped washing the carrots years ago. They keep better with the
            soil on, and they taste like carrots are supposed to.”
          </p>
          <footer className="mt-5 text-sm font-semibold text-muted">
            Maggie Bram — second-generation grower, Hollow Lane
          </footer>
        </blockquote>
      </div>
    </section>
  )
}
