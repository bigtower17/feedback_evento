/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'custom-red': '#7A1E3A',
        'custom-red-dark': '#5A1529',
        'custom-green': '#7A1E3A',
        'custom-green-dark': '#5A1529'
      }
    },
  },
  plugins: [],
}