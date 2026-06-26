import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#b9dffd',
          300: '#7cc5fb',
          400: '#36a8f6',
          500: '#0c8de7',
          600: '#006fc5',
          700: '#0159a0',
          800: '#064b84',
          900: '#0b3f6e',
          950: '#072849',
        },
        accent: {
          50: '#fef3f2',
          100: '#fee4e2',
          200: '#fececa',
          300: '#fcaca5',
          400: '#f87c71',
          500: '#ef5244',
          600: '#dd362a',
          700: '#ba291f',
          800: '#9a251d',
          900: '#80251e',
          950: '#450f0c',
        },
      },
    },
  },
  plugins: [],
};

export default config;