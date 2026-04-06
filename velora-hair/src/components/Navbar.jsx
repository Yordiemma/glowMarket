import { useState } from "react"
import { Link } from "react-router-dom"
import { BsCart2 } from "react-icons/bs"
import { useShop } from "../context/ShopContext"
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi"

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { cartCount } = useShop()

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-[rgba(77,33,44,0.88)] text-white backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link
            to="/"
            className="font-display text-3xl tracking-wide text-[#fff4ef] transition hover:text-[#f9d7d2]"
          >
            Velora Hair
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <Link
              to="/"
              className="border-b border-transparent pb-1 text-white/80 transition hover:border-white hover:text-white"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="border-b border-transparent pb-1 text-white/80 transition hover:border-white hover:text-white"
            >
              Shop
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <Link
              to="/cart"
              className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 transition hover:bg-white/15"
            >
              <BsCart2 size={24} />
              <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#f8d2bc] px-1 text-xs font-semibold text-[#522c32]">
                {cartCount}
              </span>
            </Link>
          </div>

          <div className="flex lg:hidden items-center gap-4">
            <Link
              to="/cart"
              className="relative flex items-center justify-center rounded-full border border-white/20 bg-white/10 p-2 transition hover:text-white/80"
            >
              <BsCart2 size={26} />
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f8d2bc] px-1 text-[10px] font-semibold text-[#522c32]">
                {cartCount}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 transition hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {menuOpen ? <HiOutlineX size={28} /> : <HiOutlineMenu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="border-t border-white/10 pb-4 lg:hidden">
            <div className="flex flex-col gap-2 pt-4 text-sm font-medium">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2 transition hover:bg-white/10"
              >
                Home
              </Link>

              <Link
                to="/shop"
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2 transition hover:bg-white/10"
              >
                Shop
              </Link>

              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2 transition hover:bg-white/10"
              >
                Cart
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar
