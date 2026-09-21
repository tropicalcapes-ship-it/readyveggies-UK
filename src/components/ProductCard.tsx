import { Link } from '@tanstack/react-router'
import { Check, Plus } from 'lucide-react'
import type { Product } from '@/data/products'
import { useCart } from '@/lib/cart'
import { formatPence, img } from '@/lib/format'

export function ProductCard({ product }: { product: Product }) {
  const { add, lastAdded } = useCart()
  const justAdded = lastAdded === product.id

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_6px_20px_rgba(20,50,30,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(20,50,30,0.12)]">
      <Link
        to="/products/$productId"
        params={{ productId: product.id }}
        className="relative block overflow-hidden"
      >
        <img
          src={img(product.image, 600, 450)}
          alt={product.name}
          width={600}
          height={450}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-farm-700">
          {product.tag}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <Link
          to="/products/$productId"
          params={{ productId: product.id }}
          className="font-display text-[17px] font-bold leading-snug text-farm-900 hover:text-farm-600"
        >
          {product.name}
        </Link>
        <p className="text-sm leading-snug text-muted">
          {product.shortDescription}
        </p>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <p className="text-lg font-bold tabular-nums text-farm-800">
              {formatPence(product.pricePence)}
            </p>
            <p className="text-xs text-muted">{product.unit}</p>
          </div>
          <button
            type="button"
            onClick={() => add(product.id)}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white transition ${
              justAdded ? 'bg-farm-600' : 'bg-farm-700 hover:bg-farm-800'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="h-4 w-4" strokeWidth={3} />
                Added
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" strokeWidth={3} />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
