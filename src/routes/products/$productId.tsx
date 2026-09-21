import { useState } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, Check, MapPin, ShoppingBasket } from 'lucide-react'
import products, { productsById } from '@/data/products'
import { ProductCard } from '@/components/ProductCard'
import { QuantityStepper } from '@/components/QuantityStepper'
import { useCart } from '@/lib/cart'
import { formatPence, img } from '@/lib/format'

export const Route = createFileRoute('/products/$productId')({
  loader: ({ params }) => {
    const product = productsById.get(params.productId)
    if (!product) throw notFound()
    return { product }
  },
  component: ProductDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-5 py-24 text-center">
      <h1 className="font-display text-3xl font-bold text-farm-900">
        We do not grow that one
      </h1>
      <p className="mt-3 text-muted">
        It may be out of season or we may never have had it. Have a look at
        what is in the shop today.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-xl bg-farm-700 px-6 py-3 text-sm font-bold text-white hover:bg-farm-800"
      >
        Back to the shop
      </Link>
    </div>
  ),
})

function ProductDetail() {
  const { product } = Route.useLoaderData()
  const { add, setOpen } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  function handleAdd() {
    add(product.id, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link
        to="/"
        hash="shop"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-farm-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to the shop
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
        <img
          src={img(product.image, 1000, 800)}
          alt={product.name}
          className="aspect-[5/4] w-full rounded-3xl border border-line object-cover"
        />

        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-gold-dark">
            {product.category} · {product.tag}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-farm-900 sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-muted">
            {product.shortDescription}
          </p>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-farm-800">
              {formatPence(product.pricePence)}
            </span>
            <span className="text-sm font-semibold text-muted">
              / {product.unit}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <QuantityStepper
              qty={qty}
              label={product.name}
              onChange={(next) => setQty(Math.max(1, next))}
            />
            <button
              type="button"
              onClick={handleAdd}
              className={`flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition ${
                added ? 'bg-farm-600' : 'bg-farm-700 hover:bg-farm-800'
              }`}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" strokeWidth={3} />
                  Added to basket
                </>
              ) : (
                <>
                  <ShoppingBasket className="h-4 w-4" strokeWidth={2.4} />
                  Add {formatPence(product.pricePence * qty)}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-xl border border-line bg-white px-5 py-3.5 text-sm font-bold text-farm-800 hover:border-farm-500"
            >
              View basket
            </button>
          </div>

          <div className="mt-8 space-y-4 rounded-2xl border border-line bg-white p-6">
            <p className="leading-relaxed text-ink">{product.description}</p>
            <p className="flex items-center gap-2 border-t border-line pt-4 text-sm font-semibold text-farm-700">
              <MapPin className="h-4 w-4" />
              Grown at {product.origin}
              {product.inSeason ? ' · in season now' : ' · last of the season'}
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-farm-900">
            More {product.category.toLowerCase()}
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
