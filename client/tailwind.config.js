/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Soul 风格配色
        soul: {
          bg:      '#0a0a1a',
          dark:    '#0d1137',
          purple:  '#1a1040',
          pink:    '#ff6b9d',
          'pink-light': '#ff8fb3',
          cyan:    '#45d9d9',
          gold:    '#f0c060',
          lavender:'#a78bfa',
          card:    'rgba(255,255,255,0.05)',
        },
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', '"Helvetica Neue"', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
