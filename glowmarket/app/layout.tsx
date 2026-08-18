import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "GlowMarket — Beauty marketplace", description: "Beauty products from verified independent beauty businesses." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
