/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // ── Static brand colors (still usable directly) ──
        mint: {
          light: "#e8fff8",
          DEFAULT: "#b8f7e4",
          dark: "#7ee8c8",
        },
        graphite: {
          light: "#3a3d42",
          DEFAULT: "#25272c",
          dark: "#15171a",
        },
        burgundy: {
          light: "#8a3245",
          DEFAULT: "#6b1d2e",
          dark: "#4e1220",
        },
        ivory: {
          DEFAULT: "#fffdf7",
          dark: "#fff5f6",
        },
        blush: {
          light: "#f5d0d6",
          DEFAULT: "#e8b4bc",
        },

        // ── Theme-aware colors using CSS variables ──
        // These automatically switch when data-theme changes
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
          card: "var(--bg-card)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          dark: "var(--accent-dark)",
          light: "var(--accent-light)",
        },
        border: {
          DEFAULT: "var(--border)",
          hover: "var(--border-hover)",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
