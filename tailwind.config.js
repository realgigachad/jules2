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
        // Redefined theme colors to use CSS variables
        primary: 'var(--color-primary)',
        background: 'var(--color-background)',
        text: 'var(--color-text)',
        // Kept cyan as a fallback or for specific use
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
      },
      fontFamily: {
        // Redefined font families to use CSS variables
        sans: 'var(--font-body)',
        serif: 'var(--font-body)',
        mono: 'var(--font-body)',
        header: 'var(--font-header)',
        body: 'var(--font-body)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
