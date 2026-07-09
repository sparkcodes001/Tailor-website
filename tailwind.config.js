/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
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
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};
