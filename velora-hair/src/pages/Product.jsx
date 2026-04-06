import { Link, useParams } from "react-router-dom"
import { getProductBySlug } from "../data/products"
import { useShop } from "../context/ShopContext"

export default function Product() {
  const { slug } = useParams()
  const { addToCart } = useShop()
  const product = getProductBySlug(slug)

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="product-card text-center">
          <h1 className="font-display text-5xl text-[#351920]">Product not found</h1>
          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-full bg-[#6d3140] px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white"
          >
            Back to shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full rounded-[2.25rem] object-cover"
        />

        <div className="product-card h-fit">
          <p className="text-xs uppercase tracking-[0.3em] text-[#94606c]">
            {product.category}
          </p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[#351920]">
            {product.name}
          </h1>
          <p className="mt-5 text-base leading-8 text-[#6b4e55]">
            {product.description}
          </p>

          <div className="mt-6 flex items-end gap-4">
            <p className="text-4xl font-semibold text-[#351920]">${product.price}</p>
            <p className="pb-1 text-base text-[#94606c] line-through">${product.oldPrice}</p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              ["Length", product.length],
              ["Texture", product.texture],
              ["Density", product.density],
              ["Color", product.color],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.4rem] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-[#94606c]">
                  {label}
                </p>
                <p className="mt-2 text-base font-semibold text-[#351920]">{value}</p>
              </div>
            ))}
          </div>

          <ul className="mt-8 space-y-3 text-sm leading-7 text-[#6b4e55]">
            {product.details.map((detail) => (
              <li key={detail}>- {detail}</li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="rounded-full bg-[#6d3140] px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white"
            >
              Add to cart
            </button>
            <Link
              to="/cart"
              className="rounded-full border border-[#6d3140]/20 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#6d3140]"
            >
              Go to cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
