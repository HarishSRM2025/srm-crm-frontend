/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base brand colors: #fff (surface), #137fc1 (primary/blue), #53a766 (secondary/green)
        primary: {
          50: "#f0f4ff",
          100: "#e0ebff",
          200: "#c7dcff",
          300: "#9ec5ff",
          400: "#6ba2ff",
          500: "#3b7eff",
          600: "#1a5eff", // Indigo/Blue accent
          700: "#1147cc",
          800: "#123aa3",
          900: "#133182",
          950: "#0c1b47",
        },
        secondary: {
          50: "#eafaf1",
          100: "#e6f9f5", // Soft teal background
          200: "#b3f0df",
          300: "#7fe7ca",
          400: "#4cd9b4",
          500: "#22c59d",
          600: "#10b981", // Emerald accent
          700: "#0d9468",
          800: "#0b7553",
          900: "#095c42",
          950: "#053d2b",
        },
        surface: {
          DEFAULT: "#ffffff",
          50: "#ffffff",
          100: "#f8fafc",
          200: "#f1f5f9",
        },
        pastel: {
          blue: {
            bg: "#e0ebff",
            text: "#3b72d9",
            border: "#cce0ff",
          },
          amber: {
            bg: "#fff0e0",
            text: "#d97706",
            border: "#ffe0c2",
          },
          rose: {
            bg: "#ffe8f0",
            text: "#db2777",
            border: "#ffd1e3",
          },
          teal: {
            bg: "#e6f9f5",
            text: "#0d9488",
            border: "#ccf2ea",
          },
          purple: {
            bg: "#f3e8ff",
            text: "#7c3aed",
            border: "#e9d5ff",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
