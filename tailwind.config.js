/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './public/**/*.html'],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    // 确保一些自定义颜色类被保留
    {
      pattern: /text-\[.*\]/,
    },
    {
      pattern: /bg-\[.*\]/,
    },
  ],
}

// const plugin = require('tailwindcss/plugin')

// module.exports = {
//   plugins: [
//     plugin(function ({ addUtilities, addComponents, e, config }) {
//       // Add your custom styles here
//     }),
//   ],
// }
