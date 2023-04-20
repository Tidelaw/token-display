/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        'orange': '#f50',
        'light-orange':'#ff9d00',
        'light-black':'#14171c'
      },
    },
    container:{
      center: true,
    }
  },
  plugins: [],
}