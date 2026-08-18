import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { getPublishedProducts } from "@/lib/catalog";

export default async function Home() {
  const products = await getPublishedProducts();
  return <><SiteHeader /><main>
    <section className="hero">
      <div className="hero-copy"><p className="kicker">THE MARKETPLACE FOR BEAUTY BUSINESSES</p><h1>Turn your product shelf into <em>an online store.</em></h1><p>Create your beauty store, prepare polished product listings with AI, and manage products and customer orders from one seller dashboard.</p><div className="button-row"><Link className="button button-dark" href="/register">Create your beauty store</Link><Link className="button button-light" href="/marketplace">View marketplace</Link></div><div className="trust-row"><span>✓ Swedish beauty businesses</span><span>✓ AI product drafts</span><span>✓ Stock and order tools</span></div></div>
      <div className="hero-visual"><div className="arch"><div className="hero-bottle"><span>GlowMarket</span><i /></div><div className="orb orb-one"/><div className="orb orb-two"/></div><aside><b>01</b><span>Scalp renewal oil<br/><small>by Atelier Strand</small></span></aside></div>
    </section>
    <section className="statement"><p>BUILT FOR INDEPENDENT BEAUTY BUSINESSES</p><h2>Your expertise.<br/><em>Your digital product shelf.</em></h2></section>
    <section className="featured"><div className="section-title"><div><p className="kicker">FROM VERIFIED BEAUTY BUSINESSES</p><h2>Beauty products</h2></div><Link href="/marketplace">Explore all products →</Link></div>{products.length?<div className="product-grid">{products.slice(0,4).map(product => <ProductCard key={product.id} product={product}/>)}</div>:<div className="empty-catalog"><h3>Beauty products are coming soon.</h3><p>Verified sellers can publish their first products from the dashboard.</p></div>}</section>
    <section id="how" className="how"><div><p className="kicker">SELLER MVP</p><h2>From store setup<br/>to your first listing.</h2></div><ol><li><b>01</b><div><h3>Create your beauty store</h3><p>Add your business profile and product dispatch address.</p></div></li><li><b>02</b><div><h3>Create product drafts</h3><p>Enter verified product facts and let AI prepare editable listing copy.</p></div></li><li><b>03</b><div><h3>Manage fulfilment</h3><p>Track stock and customer orders, then dispatch products from your saved address.</p></div></li></ol></section>
    <section id="salons" className="salon-cta"><p className="kicker">FOR BEAUTY BUSINESS OWNERS</p><h2>Start building your<br/><em>GlowMarket store.</em></h2><p>Create your seller account, add your dispatch details, and prepare your first beauty product listing.</p><Link className="button button-cream" href="/register">Create your beauty store</Link><div className="mini-proof"><span>Store profile</span><span>Dispatch address</span><span>AI product builder</span></div></section>
  </main><Footer /></>;
}
