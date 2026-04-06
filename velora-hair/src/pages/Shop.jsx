import { Link } from "react-router-dom"
import { useShop } from "../context/ShopContext"
import { products } from "../data/products"

export default function Shop() {
  const { addToCart } = useShop()

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-kicker">Velora Collection</p>
          <h1 className="section-title">Wigs, bundles, closures, and frontals</h1>
        </div>
        <p className="max-w-xl text-sm leading-7 text-[#6b4e55]">
          Shop every texture from polished straight styles to loose waves and
          clean lace pieces, all powered by local product data in the app.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="product-card">
            <Link to={`/shop/${product.slug}`}>
              <img
                src={product.image}
                alt={product.name}
                className="h-80 w-full rounded-[1.75rem] object-cover"
              />
            </Link>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#94606c]">
                  {product.category}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-[#351920]">
                  {product.name}
                </h2>
              </div>
              <span className="rounded-full bg-[#f7d9c9] px-3 py-1 text-xs font-semibold text-[#6d3140]">
                {product.badge}
              </span>
            </div>

            <p className="mt-3 text-sm leading-7 text-[#6b4e55]">
              {product.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#6b4e55]">
              <span className="rounded-full bg-white px-3 py-2">{product.length}</span>
              <span className="rounded-full bg-white px-3 py-2">{product.texture}</span>
              <span className="rounded-full bg-white px-3 py-2">{product.color}</span>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-2xl font-semibold text-[#351920]">${product.price}</p>
                <p className="text-sm text-[#94606c] line-through">${product.oldPrice}</p>
              </div>
              <div className="flex gap-3">
                <Link
                  to={`/shop/${product.slug}`}
                  className="rounded-full border border-[#6d3140]/20 px-4 py-3 text-sm font-semibold text-[#6d3140]"
                >
                  View
                </Link>
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="rounded-full bg-[#6d3140] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#52242f]"
                >
                  Add
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
