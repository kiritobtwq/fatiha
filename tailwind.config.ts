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
        primary: "#0d7c5f",
        "primary-dark": "#095e48",
        "primary-light": "#e6f5ef",
        accent: "#0d7c5f",
        "accent-light": "#e6f5ef",
        mint: "#0d7c5f",
        bg: "#fafbf9",
        "bg-page": "#fafbf9",
        "bg-deep": "#f0f5f1",
        "bg-accent": "#f3f4f6",
        "bg-gray": "#f8faf9",
        "text-primary": "#0f1a14",
        "text-secondary": "#4a5d52",
        "text-muted": "#8a9c92",
        "dark-bg": "#0a1210",
        "dark-surface": "#131f1a",
        border: "#d4e8db",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 40px rgba(0, 0, 0, 0.08)',
        'widget': '0 25px 60px rgba(0, 0, 0, 0.15)',
        'glow': '0 0 40px rgba(13, 124, 95, 0.15)',
        'glow-accent': '0 0 30px rgba(13, 124, 95, 0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(13, 124, 95, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(13, 124, 95, 0.4)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
