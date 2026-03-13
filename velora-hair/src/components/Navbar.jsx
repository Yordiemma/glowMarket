import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="w-full bg-[#9b5163] text-white px-8 py-4 flex items-center justify-between">

      {/* Logo */}
      <div className="text-xl font-semibold tracking-wide">
        <Link to="/">Velora Hair</Link>
      </div>

      {/* Navigation Links */}
<div className="flex gap-8 text-sm font-medium">
  <Link to="/">Home</Link>
  <Link to="/shop">Shop</Link>
  <Link to="/ai-match">AI Match</Link>
  <Link to="/cart">Cart</Link>
</div>

      {/* Cart */}
      <div>
        <Link
          to="/cart"
          className="bg-[#d8b08c] text-[#3d2a2a] px-4 py-2 rounded-md font-semibold"
        >
          Cart
        </Link>
      </div>

    </nav>
  )
}

export default Navbar