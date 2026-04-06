import { useState } from "react"
import { Link } from "react-router-dom"
import { BsCart2 } from "react-icons/bs"
import { useShop } from "../context/ShopContext"
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi"

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { cartCount } = useShop()
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Match" },
    { to: "/shop", label: "Shop" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-[#975869] text-white shadow-[0_10px_30px_rgba(74,32,42,0.18)]">
      <nav className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link
            to="/"
            className="font-display text-[2rem] tracking-wide text-[#fff5f0] transition hover:text-white"
          >
            Velora Hair
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-white/80 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <Link
              to="/cart"
              className="relative flex min-w-[118px] items-center justify-center gap-2 rounded-md bg-[#f3dfb4] px-4 py-3 text-sm font-semibold text-[#5f3340] transition hover:bg-[#f7e6bf]"
            >
              <BsCart2 size={18} />
              <span>${(cartCount * 329 || 0).toFixed(2)}</span>
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6d3140] px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            </Link>
          </div>

          <div className="flex lg:hidden items-center gap-4">
            <Link
              to="/cart"
              className="relative flex items-center justify-center rounded-md bg-[#f3dfb4] p-2 text-[#5f3340] transition hover:bg-[#f7e6bf]"
            >
              <BsCart2 size={26} />
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6d3140] px-1 text-[10px] font-semibold text-white">
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

              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-3 py-2 transition hover:bg-white/10"
                >
                  {link.label}
                </Link>
              ))}

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
