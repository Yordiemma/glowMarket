import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/demo-data";

export default function Home() {
  return <><SiteHeader /><main>
    <section className="hero">
      <div className="hero-copy"><p className="kicker">THE SALON MARKETPLACE</p><h1>Good hair starts with <em>the professionals.</em></h1><p>Discover products selected and sold by verified independent hair salons. Expert care, beyond the chair.</p><div className="button-row"><Link className="button button-dark" href="/marketplace">Shop salon products</Link><Link className="button button-light" href="/register">I own a salon</Link></div><div className="trust-row"><span>✓ Verified businesses</span><span>✓ Salon-selected products</span><span>✓ Secure checkout</span></div></div>
      <div className="hero-visual"><div className="arch"><div className="hero-bottle"><span>GlowMarket</span><i /></div><div className="orb orb-one"/><div className="orb orb-two"/></div><aside><b>01</b><span>Scalp renewal oil<br/><small>by Atelier Strand</small></span></aside></div>
    </section>
    <section className="statement"><p>Built for the people who know hair best.</p><h2>One marketplace.<br/><em>Hundreds of salon shelves.</em></h2></section>
    <section className="featured"><div className="section-title"><div><p className="kicker">PROFESSIONAL PICKS</p><h2>On the shelf</h2></div><Link href="/marketplace">Explore all products →</Link></div><div className="product-grid">{products.slice(0,4).map(product => <ProductCard key={product.id} product={product}/>)}</div></section>
    <section id="how" className="how"><div><p className="kicker">HOW IT WORKS</p><h2>From their shelf<br/>to your routine.</h2></div><ol><li><b>01</b><div><h3>Discover verified salons</h3><p>Browse professional products from real, registered hair businesses.</p></div></li><li><b>02</b><div><h3>Shop with confidence</h3><p>Get the products your stylist actually recommends, from a trusted source.</p></div></li><li><b>03</b><div><h3>Support local expertise</h3><p>Every purchase supports an independent salon and its craft.</p></div></li></ol></section>
    <section id="salons" className="salon-cta"><p className="kicker">FOR SALON OWNERS</p><h2>Your expertise deserves<br/><em>a bigger shelf.</em></h2><p>Open your digital storefront, share the products you trust, and grow beyond appointments.</p><Link className="button button-cream" href="/register">Start selling on GlowMarket</Link><div className="mini-proof"><span>No setup fee</span><span>Verified businesses only</span><span>Simple product tools</span></div></section>
  </main><Footer /></>;
}
