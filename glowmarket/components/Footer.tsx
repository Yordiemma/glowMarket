import Link from "next/link";
import { BrandMark } from "./BrandMark";

export function Footer() {
  return <footer><BrandMark /><p>You take care of beauty. GlowMarket takes care of your online store.</p><div><Link href="/marketplace">Shop products</Link><Link href="/#pricing">Seller pricing</Link><Link href="/register">Seller signup</Link><Link href="/sign-in">Seller sign in</Link></div><small>© 2026 GlowMarket · Stockholm, Sweden</small></footer>;
}
