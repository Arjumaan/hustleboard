/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hustle-dark': '#0f172a',
        'hustle-secondary': '#1e293b',
        'hustle-accent': '#38bdf8', // Sky 400
        'hustle-purple': '#818cf8', // Indigo 400
        'hustle-pink': '#f472b6', // Pink 400
      }
    },
  },
  plugins: [],
}
