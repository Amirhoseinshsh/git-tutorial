import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#effaf2',
          100: '#d8f3df',
          200: '#b4e6c2',
          500: '#28a745',
          600: '#1f8e3a',
          700: '#19722f',
        },
      },
      fontFamily: {
        sans: ['Vazirmatn', 'Tahoma', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
