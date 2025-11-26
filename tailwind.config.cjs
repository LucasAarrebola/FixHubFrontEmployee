/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2B6CB0', 
        accent: '#F6E05E',  
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
};
