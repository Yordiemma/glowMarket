export type Product = {
  id: number;
  name: string;
  salon: string;
  category: string;
  price: number;
  tone: string;
  accent: string;
};

export const products: Product[] = [
  { id: 1, name: "Hydration ritual set", salon: "Nordic Glow Studio", category: "Hair care", price: 549, tone: "#d8b9a5", accent: "#f3e8df" },
  { id: 2, name: "Silk edge control", salon: "Crown & Coil", category: "Styling", price: 189, tone: "#7d604d", accent: "#d6c0ad" },
  { id: 3, name: "Scalp renewal oil", salon: "Atelier Strand", category: "Scalp care", price: 329, tone: "#b6a77c", accent: "#e7e0c9" },
  { id: 4, name: "Curl definition cream", salon: "Crown & Coil", category: "Curls", price: 259, tone: "#9f765f", accent: "#ead8cc" },
  { id: 5, name: "Bond repair mask", salon: "Nordic Glow Studio", category: "Treatments", price: 399, tone: "#c7a7a1", accent: "#f1dfdc" },
  { id: 6, name: "Shine finishing mist", salon: "Studio STHLM", category: "Styling", price: 229, tone: "#a49b91", accent: "#e7e4df" },
];

export const formatSek = (price: number) =>
  new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(price);
