import HeroCarousel from "./HeroCarousel"
import { Link } from "react-router-dom"

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.72),_transparent_32%),radial-gradient(circle_at_85%_18%,rgba(255,240,236,0.32),transparent_20%),linear-gradient(135deg,_#f2cbc8_0%,_#e4b2b1_42%,_#8b4f5d_100%)]"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(77,33,44,0.08),transparent_35%,rgba(255,255,255,0.12)_100%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-20">
        <div className="relative z-10 max-w-xl text-[#4c2530]">
          <p className="text-sm uppercase tracking-[0.45em] text-[#7d4352]/85">
            Luxury Hair Shop
          </p>

          <h1
            id="hero-heading"
            className="mt-4 font-display text-5xl leading-[0.95] md:text-6xl lg:text-[5.3rem]"
          >
            Luxury hair for every shade of beauty
          </h1>

          <p className="mt-5 max-w-lg text-lg leading-8 text-[#6a3b46] md:text-[1.35rem]">
            Premium wigs, bundles, and closures designed for soft movement,
            rich color, and a flawless luxury finish.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="rounded-xl bg-[#7e4052] px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_14px_36px_rgba(101,44,57,0.22)] transition hover:bg-[#663242]"
            >
              Shop Now
            </Link>

            <Link
              to="/shop"
              className="rounded-xl border border-[#7e4052]/16 bg-[#fff5ef] px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#7e4052] shadow-[0_12px_32px_rgba(255,255,255,0.2)] transition hover:bg-white"
            >
              Explore Collection
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="glass-panel rounded-[1.4rem] p-4">
              <p className="text-2xl font-semibold">24h</p>
              <p className="mt-1 text-sm text-[#6a4850]">Order processing</p>
            </div>
            <div className="glass-panel rounded-[1.4rem] p-4">
              <p className="text-2xl font-semibold">4.9/5</p>
              <p className="mt-1 text-sm text-[#6a4850]">Client love</p>
            </div>
            <div className="glass-panel rounded-[1.4rem] p-4">
              <p className="text-2xl font-semibold">3 ways</p>
              <p className="mt-1 text-sm text-[#6a4850]">To pay later or now</p>
            </div>
          </div>
        </div>

        <HeroCarousel />
      </div>
    </section>
  )
}
