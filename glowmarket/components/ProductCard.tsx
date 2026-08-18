import Link from "next/link";
import { formatSek, Product } from "@/lib/demo-data";

export function ProductCard({ product }: { product: Product }) {
  return <article className="product-card">
    <div className="product-art" style={{ background: `linear-gradient(145deg, ${product.accent}, ${product.tone})` }}>
      <span>{product.category}</span><div className="bottle"><i /></div>
      <button aria-label={`Save ${product.name}`}>♡</button>
    </div>
    <p className="eyebrow">{product.salon}</p>
    <h3>{product.name}</h3>
    <div className="product-meta"><strong>{formatSek(product.price)}</strong><Link href="/salon/nordic-glow">View product →</Link></div>
  </article>;
}
