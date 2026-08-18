/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F8F1E8",
        linen: "#EFE1D1",
        sand: "#D8BFA5",
        cocoa: "#7A5A44",
        espresso: "#211813",
        gold: "#8B5A2B",
        amber: "#B45309",
        blush: "#F5E8E3",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 24px 80px rgba(33, 24, 19, 0.10)",
        card: "0 16px 50px rgba(33, 24, 19, 0.08)",
      },
    },
  },
  plugins: [],
};

export default tailwindConfig;
