/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind uses this file to know which files contain `className`.
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
