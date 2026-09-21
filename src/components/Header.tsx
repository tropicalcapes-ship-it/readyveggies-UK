import { Link } from '@tanstack/react-router'
import { Leaf, ShoppingBasket } from 'lucide-react'
import { useCart } from '@/lib/cart'

export function Header() {
  const { count, setOpen } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3.5">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-farm-700 text-white">
            <Leaf className="h-5 w-5" strokeWidth={2.4} />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-farm-800">
              Farm Fresh Produce
            </span>
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.14em] text-muted sm:block">
              Fresh · Local · Delivered
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-6 text-sm font-semibold text-farm-800 md:flex">
          <Link to="/" hash="shop" className="hover:text-farm-600">
            Shop
          </Link>
          <Link to="/" hash="how-it-works" className="hover:text-farm-600">
            How it works
          </Link>
          <Link to="/" hash="the-farm" className="hover:text-farm-600">
            The farm
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="ml-auto flex items-center gap-2 rounded-xl bg-farm-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-farm-800 md:ml-0"
        >
          <ShoppingBasket className="h-4 w-4" strokeWidth={2.4} />
          Basket
          <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-extrabold text-farm-900">
            {count}
          </span>
        </button>
      </div>
    </header>
  )
}
