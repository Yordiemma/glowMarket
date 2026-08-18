import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "GlowMarket — Salon marketplace", description: "Discover products from verified independent hair salons." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
