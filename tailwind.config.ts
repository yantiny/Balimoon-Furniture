import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF8F5',
          200: '#F3EFEA',
          300: '#E8E2D9',
        },
        wood: {
          light: '#C89D7C',
          DEFAULT: '#8B5A2B',
          medium: '#A06535',
          dark: '#5C3A1E',
          deep: '#3D2513',
        },
        charcoal: {
          100: '#3A3835',
          700: '#2C2A29',
          900: '#1A1918',
        },
        warm: {
          gray: '#6E6C68',
          border: '#E5E0DA',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(26, 25, 24, 0.05)',
        'elevated': '0 12px 30px -4px rgba(26, 25, 24, 0.08)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
};
export default config;
