import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Enforce a strict 3-color professional & Orchid palette
        // 1. Accent: Violet (Sophisticated & Luxurious)
        indigo: colors.violet,
        blue: colors.violet,
        rose: colors.violet,
        // 2 & 3. Base/Backgrounds: Slate (Clean White to Deep Charcoal)
        gray: colors.slate,
        zinc: colors.slate,
        neutral: colors.slate,
        stone: colors.slate,
      },
      keyframes: {
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        reveal: 'reveal 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards',
        fadeIn: 'fadeIn 1s ease-out forwards',
      }
    },
  },
  plugins: [],
}