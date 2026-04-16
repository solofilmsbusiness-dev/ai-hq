/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hq-dark': '#0A0E27',
        'hq-accent': '#FFD700',
        'hq-wall': '#1a1f3a',
      },
    },
  },
  plugins: [],
}
