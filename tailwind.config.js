/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          DEFAULT: '#00FFFF',
          '50': '#E0FFFF',
          '100': '#CCFFFF',
          '200': '#99FFFF',
          '300': '#66FFFF',
          '400': '#33FFFF',
          '500': '#00FFFF',
          '600': '#00CCCC',
          '700': '#009999',
          '800': '#006666',
          '900': '#003333'
        }
      }
    },
  },
  plugins: [],
};
