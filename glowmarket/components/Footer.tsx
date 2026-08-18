import Link from "next/link";
import { BrandMark } from "./BrandMark";

export function Footer() {
  return <footer><BrandMark /><p>The marketplace built for independent beauty businesses.</p><div><Link href="/marketplace">Shop products</Link><Link href="/register">Create your store</Link><Link href="/sign-in">Seller sign in</Link></div><small>© 2026 GlowMarket · Stockholm, Sweden</small></footer>;
}
