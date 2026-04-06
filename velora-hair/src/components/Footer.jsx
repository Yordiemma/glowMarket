export default function Footer() {
  return (
    <footer className="border-t border-[#d8b9a5] bg-[#4d212c] text-[#f8ede6]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-3xl">Velora Hair</p>
          <p className="mt-4 text-sm leading-7 text-[#f8ede6]/80">
            Luxury wigs, bundles, closures, and salon services curated for
            softness, confidence, and everyday glam.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#f2c9b2]">
            Shop
          </p>
          <ul className="mt-4 space-y-3 text-sm text-[#f8ede6]/80">
            <li>Signature wigs</li>
            <li>Bundle collections</li>
            <li>Closures and frontals</li>
            <li>Checkout and cart</li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#f2c9b2]">
            Payments
          </p>
          <ul className="mt-4 space-y-3 text-sm text-[#f8ede6]/80">
            <li>Stripe secure checkout</li>
            <li>Klarna split payments</li>
            <li>Swish quick pay</li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#f2c9b2]">
            Contact
          </p>
          <ul className="mt-4 space-y-3 text-sm text-[#f8ede6]/80">
            <li>hello@velorahair.com</li>
            <li>Online luxury hair boutique</li>
            <li>Support for orders and product help</li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
