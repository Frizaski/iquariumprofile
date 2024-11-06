/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html'],
  theme: {
    extend: {
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

