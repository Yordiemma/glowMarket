import Link from "next/link";
import { BrandMark } from "./BrandMark";

export function SiteHeader() {
  const showDeveloperDashboard = process.env.NODE_ENV === "development"
    && process.env.LOCAL_AUTH_BYPASS === "true";

  return (
    <header className="site-header">
      <BrandMark />
      <nav>
        <Link href="/#how">How it works</Link>
        <Link href="/marketplace">Products</Link>
        <Link href="/register">Start selling</Link>
      </nav>
      <div className="header-actions">
        {showDeveloperDashboard && <Link className="dev-dashboard-link" href="/dashboard"><span className="nav-full">Dashboard</span><span className="nav-short">Dash</span> <small>DEV</small></Link>}
        <Link className="text-link" href="/sign-in">Sign in</Link>
        <Link className="button button-dark button-small" href="/register"><span className="nav-full">Create your store</span><span className="nav-short">Register</span></Link>
      </div>
    </header>
  );
}
