import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Enforce a strict 3-color professional & Orchid palette matching the frontend
        indigo: colors.violet,
        blue: colors.violet,
        rose: colors.violet,
        gray: colors.slate,
        zinc: colors.slate,
        neutral: colors.slate,
        stone: colors.slate,
      }
    },
  },
  plugins: [],
}