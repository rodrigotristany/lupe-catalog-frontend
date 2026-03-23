/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        lupe: {
          50:  '#fdf8f0',
          100: '#f9edd9',
          200: '#f2d7b0',
          300: '#e8b97e',
          400: '#de944a',
          500: '#d47a2e',
          600: '#c26124',
          700: '#a14a20',
          800: '#833b20',
          900: '#6b331d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};
