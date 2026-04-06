import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20 text-center">
      <div className="product-card">
        <h1 className="font-display text-5xl text-[#351920]">Page not found</h1>
        <p className="mt-4 text-sm leading-7 text-[#6b4e55]">
          This part of the Velora shop is not available yet.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-[#6d3140] px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white"
        >
          Return home
        </Link>
      </div>
    </div>
  )
}
