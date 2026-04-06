import Hero from "../components/Hero"
import { Link } from "react-router-dom"
import { benefits, categories, featuredProducts } from "../data/products"
import { useShop } from "../context/ShopContext"

export default function Homepage() {
  const { addToCart } = useShop()

  return (
    <div className="bg-[#fbf6f2] pb-20">
      <Hero />

      <section className="mx-auto mt-8 max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-t border-[#e7d7d0] bg-white px-6 py-10 sm:px-10 lg:grid-cols-[1.2fr_1fr] lg:px-12">
          <div>
            <div className="flex items-center gap-4 text-[#d9c8bf]">
              <span className="h-px flex-1 bg-current" />
              <p className="font-display text-4xl text-[#3a2329] sm:text-5xl">
                Why Choose Velora
              </p>
              <span className="h-px flex-1 bg-current" />
            </div>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#6b4e55]">
              Premium textures, soft finishes, and a luxury shopping experience
              made for beautiful everyday hair. Every collection is selected to
              look rich, natural, and easy to style.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {categories.map((category) => (
              <div key={category.name} className="rounded-2xl bg-[#f8f0eb] p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-[#94606c]">
                  {category.name}
                </p>
                <p className="mt-3 text-sm leading-7 text-[#6b4e55]">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="section-kicker">Shop</p>
            <h2 className="section-title">Best-selling Velora favorites</h2>
          </div>
          <Link className="hidden text-sm font-semibold text-[#6d3140] md:block" to="/shop">
            View all products
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <article key={product.id} className="product-card">
              <img
                src={product.image}
                alt={product.name}
                className="h-72 w-full rounded-[1.75rem] object-cover"
              />
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#94606c]">
                    {product.category}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#351920]">
                    {product.name}
                  </h3>
                </div>
                <span className="rounded-full bg-[#f7d9c9] px-3 py-1 text-xs font-semibold text-[#6d3140]">
                  {product.badge}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#6b4e55]">
                {product.description}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <p className="text-2xl font-semibold text-[#351920]">
                  ${product.price}
                </p>
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="rounded-full bg-[#6d3140] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#52242f]"
                >
                  Add to cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 rounded-[2rem] bg-[#4d212c] px-6 py-8 text-[#f8ede6] md:grid-cols-3">
          {benefits.map((item) => (
            <div key={item} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm leading-7 text-[#f8ede6]/90">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
