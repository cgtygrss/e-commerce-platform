/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A1A1A', // Dark Charcoal
        secondary: '#D4AF37', // Soft Gold
        accent: '#F5E6E8', // Pale Blush
        background: '#FAFAFA', // Off-White
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Lato"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}