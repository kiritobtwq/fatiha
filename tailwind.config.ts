import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2ECC8E",
        "primary-dark": "#1FA870",
        "primary-light": "#E8F8F2",
        accent: "#1C1C1E",
        mint: "#2ECC8E",
        bg: "#F7FAF8",
        "bg-page": "#F7FAF8",
        "bg-accent": "#F2F2F7",
        "bg-gray": "#F8FAFC",
        "text-primary": "#1C1C1E",
        "text-secondary": "#6B6B6B",
        border: "#D4EDE3",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-nunito)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
      },
    },
  },
  plugins: [],
};
export default config;
