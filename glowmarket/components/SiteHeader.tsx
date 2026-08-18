import Link from "next/link";
import { BrandMark } from "./BrandMark";

export function SiteHeader() {
  return (
    <header className="site-header">
      <BrandMark />
      <nav>
        <Link href="/marketplace">Marketplace</Link>
        <Link href="/#how">How it works</Link>
        <Link href="/#salons">For salons</Link>
      </nav>
      <div className="header-actions">
        <Link className="text-link" href="/sign-in">Sign in</Link>
        <Link className="button button-dark button-small" href="/register">List your salon</Link>
      </div>
    </header>
  );
}
