import Link from "next/link";
import { BrandMark } from "./BrandMark";

export function Footer() {
  return <footer><BrandMark /><p>The marketplace built for independent hair professionals.</p><div><Link href="/marketplace">Shop</Link><Link href="/register">Sell on GlowMarket</Link><Link href="/sign-in">Salon sign in</Link></div><small>© 2026 GlowMarket · Stockholm, Sweden</small></footer>;
}
