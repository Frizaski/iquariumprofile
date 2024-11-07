/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'primary': '#0455BF',
        'secondary': '#172554',
      },
    },
  },
  plugins: [
    require('tailwindcss-filters'),
  ],
}

