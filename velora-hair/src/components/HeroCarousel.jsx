import heroImage from "../assets/1.png"

export default function HeroCarousel() {
  return (
    <div className="relative h-[23rem] w-full overflow-hidden sm:h-[29rem] lg:h-[36rem]">
      <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.38),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(255,232,225,0.3),transparent_24%)]" />
      <div className="absolute inset-y-0 right-[-8%] w-[88%] sm:right-[-5%] sm:w-[78%] lg:right-0 lg:w-[82%]">
        <img
          src={heroImage}
          alt="Velora Hair hero model"
          className="h-full w-full object-contain object-right-bottom mix-blend-multiply opacity-95"
        />
      </div>
      <div className="absolute inset-y-0 left-0 w-[52%] bg-[linear-gradient(90deg,#f3d2cd_0%,rgba(243,210,205,0.96)_44%,rgba(243,210,205,0.62)_76%,transparent_100%)] sm:w-[50%] lg:w-[46%]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(243,210,205,0.42))]" />
      <div className="absolute bottom-6 left-8 h-16 w-44 rounded-full bg-white/15 blur-2xl sm:bottom-10 sm:left-16 sm:w-56" />
    </div>
  )
}
