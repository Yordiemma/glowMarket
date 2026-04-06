import { Link } from "react-router-dom"
import { useShop } from "../context/ShopContext"

const paymentMethods = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Pay securely with bank card processing powered by Stripe.",
  },
  {
    id: "klarna",
    name: "Klarna",
    description: "Split your order into later payments for flexible checkout.",
  },
  {
    id: "swish",
    name: "Swish",
    description: "Fast Swedish mobile payments for quick order confirmation.",
  },
]

export default function Cart() {
  const {
    cartItems,
    clearCart,
    removeFromCart,
    selectedPayment,
    setSelectedPayment,
    shipping,
    subtotal,
    total,
    updateQuantity,
    vat,
  } = useShop()

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-kicker">Checkout</p>
          <h1 className="section-title">Your Velora cart and payment method</h1>
        </div>
        <p className="max-w-xl text-sm leading-7 text-[#6b4e55]">
          Review items, update quantities, and choose how you want to pay with
          Stripe, Klarna, or Swish.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="mt-10 rounded-[2rem] bg-white/70 p-10 text-center shadow-[0_18px_45px_rgba(91,41,54,0.08)]">
          <p className="font-display text-4xl text-[#351920]">Your cart is empty</p>
          <p className="mt-4 text-sm leading-7 text-[#6b4e55]">
            Start with a wig, bundle, closure, or salon service and come back
            here when you are ready to check out.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex rounded-full bg-[#6d3140] px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white"
          >
            Shop now
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            {cartItems.map((item) => (
              <article
                key={item.id}
                className="product-card flex flex-col gap-5 md:flex-row"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-44 w-full rounded-[1.5rem] object-cover md:w-44"
                />
                <div className="flex-1">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-[#94606c]">
                        {item.category}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-[#351920]">
                        {item.name}
                      </h2>
                      <p className="mt-2 text-sm text-[#6b4e55]">{item.length}</p>
                    </div>
                    <p className="text-2xl font-semibold text-[#351920]">
                      ${item.price}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="rounded-full border border-[#6d3140]/20 px-4 py-2"
                    >
                      -
                    </button>
                    <span className="min-w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="rounded-full border border-[#6d3140]/20 px-4 py-2"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto rounded-full bg-[#f8ddd3] px-4 py-2 text-sm font-semibold text-[#6d3140]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="product-card h-fit">
            <p className="text-xs uppercase tracking-[0.3em] text-[#94606c]">
              Payment
            </p>
            <h2 className="mt-3 font-display text-4xl text-[#351920]">
              Choose your checkout method
            </h2>

            <div className="mt-6 space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full rounded-[1.5rem] border p-4 text-left transition ${
                    selectedPayment === method.id
                      ? "border-[#6d3140] bg-[#fff4ef]"
                      : "border-[#6d3140]/10 bg-white"
                  }`}
                >
                  <p className="text-lg font-semibold text-[#351920]">{method.name}</p>
                  <p className="mt-1 text-sm leading-7 text-[#6b4e55]">
                    {method.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-8 space-y-4 text-sm text-[#6b4e55]">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>VAT</span>
                <span>${vat.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#6d3140]/10 pt-4 text-lg font-semibold text-[#351920]">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              className="mt-8 w-full rounded-full bg-[#6d3140] px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#52242f]"
            >
              Pay with {selectedPayment}
            </button>

            <button
              type="button"
              onClick={clearCart}
              className="mt-3 w-full rounded-full border border-[#6d3140]/20 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#6d3140]"
            >
              Clear cart
            </button>
          </aside>
        </div>
      )}
    </div>
  )
}
