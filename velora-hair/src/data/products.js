import imageOne from "../assets/1.png"
import imageTwo from "../assets/2.png"

export const products = [
  {
    id: 1,
    slug: "signature-body-wave-lace-wig",
    name: "Signature Body Wave Lace Wig",
    category: "Wigs",
    price: 329,
    oldPrice: 389,
    image: imageOne,
    length: '24"',
    texture: "Body Wave",
    density: "180%",
    color: "Soft Espresso",
    rating: 4.9,
    reviews: 124,
    badge: "Best Seller",
    description:
      "A full lace wig with effortless volume, soft movement, and a natural melt that looks custom installed from day one.",
    details: [
      "Transparent lace with pre-plucked hairline",
      "Heat safe and glueless friendly",
      "Adjustable cap for secure everyday wear",
    ],
  },
  {
    id: 2,
    slug: "silk-press-straight-hd-wig",
    name: "Silk Press Straight HD Wig",
    category: "Wigs",
    price: 349,
    oldPrice: 410,
    image: imageTwo,
    length: '26"',
    texture: "Silk Straight",
    density: "200%",
    color: "Midnight Noir",
    rating: 4.8,
    reviews: 98,
    badge: "New Drop",
    description:
      "Sleek, polished, and ready for luxury everyday styling with ultra-fine lace and rich healthy shine.",
    details: [
      "HD lace for a seamless hairline",
      "Full ends with silky finish",
      "Ideal for center and side parts",
    ],
  },
  {
    id: 3,
    slug: "raw-curly-luxe-bundle-set",
    name: "Raw Curly Luxe Bundle Set",
    category: "Bundles",
    price: 259,
    oldPrice: 299,
    image: imageOne,
    length: '20" / 22" / 24"',
    texture: "Raw Curly",
    density: "Full Bundle Set",
    color: "Natural Black",
    rating: 4.9,
    reviews: 76,
    badge: "Salon Favorite",
    description:
      "Three rich curly bundles with defined pattern, bounce, and softness made for glamorous installs.",
    details: [
      "Minimal shedding with proper care",
      "Can be colored by a professional",
      "Perfect for sew-ins and custom wigs",
    ],
  },
  {
    id: 4,
    slug: "seamless-hd-closure-5x5",
    name: "Seamless HD Closure 5x5",
    category: "Closures",
    price: 139,
    oldPrice: 169,
    image: imageTwo,
    length: '18"',
    texture: "Natural Straight",
    density: "Lightweight",
    color: "Natural Brown",
    rating: 4.7,
    reviews: 54,
    badge: "Easy Install",
    description:
      "A clean, breathable closure that gives your install a soft realistic finish with a beginner-friendly lace area.",
    details: [
      "Swiss lace with natural scalp effect",
      "Designed for quick installs",
      "Pairs beautifully with straight and wave bundles",
    ],
  },
  {
    id: 5,
    slug: "velora-custom-install-service",
    name: "Velora Custom Install Service",
    category: "Salon",
    price: 189,
    oldPrice: 229,
    image: imageOne,
    length: "In Studio",
    texture: "Custom Styling",
    density: "Tailored",
    color: "Your Match",
    rating: 5,
    reviews: 31,
    badge: "Appointment",
    description:
      "Book a polished install with lace customization, styling, and finishing touches for your Velora units and bundles.",
    details: [
      "Consultation and install included",
      "Hair prep and finishing style included",
      "Perfect add-on for wig and bundle orders",
    ],
  },
  {
    id: 6,
    slug: "velvet-loose-wave-frontal-wig",
    name: "Velvet Loose Wave Frontal Wig",
    category: "Wigs",
    price: 369,
    oldPrice: 425,
    image: imageTwo,
    length: '28"',
    texture: "Loose Wave",
    density: "180%",
    color: "Mocha Melt",
    rating: 4.9,
    reviews: 67,
    badge: "Luxury Pick",
    description:
      "A high-impact frontal wig with plush fullness and soft dimensional color made for statement styling.",
    details: [
      "Pre-layered front for face framing",
      "Soft lace and secure comb construction",
      "Great for glam waves or sleek brushing",
    ],
  },
]

export const featuredProducts = products.slice(0, 4)

export const categories = [
  {
    name: "Wigs",
    description: "Glueless, frontal, and HD lace units with premium density.",
  },
  {
    name: "Bundles",
    description: "Soft, reusable hair bundles for custom installs and volume.",
  },
  {
    name: "Closures",
    description: "Natural-looking lace closures for a seamless everyday finish.",
  },
  {
    name: "Salon",
    description: "Install services and matching appointments for a complete look.",
  },
]

export const benefits = [
  "Premium hair textures chosen for softness, longevity, and movement.",
  "Luxury shades designed to flatter deeper, warm, and neutral undertones.",
  "Flexible checkout with Stripe, Klarna, and Swish payment options.",
]

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug)
}
