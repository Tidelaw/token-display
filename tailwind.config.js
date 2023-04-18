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
        'orange': '#e84225',
        'light-orange':'#e36d59',
        'light-black':'#14171c'
      },
    },
    container:{
      center: true,
    }
  },
  plugins: [],
}