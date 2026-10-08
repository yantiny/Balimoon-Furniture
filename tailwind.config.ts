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
        sans: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        serif: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        mono: ['var(--font-mono)', 'Space Mono', 'monospace'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      fontSize: {
        '2xs': ['0.7rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
        'xs': ['0.75rem', { lineHeight: '1.2rem', letterSpacing: '0.01em' }],
        'sm': ['0.875rem', { lineHeight: '1.45rem', letterSpacing: '0' }],
        'base': ['1rem', { lineHeight: '1.65rem', letterSpacing: '-0.01em' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.85rem', letterSpacing: '-0.015em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '2.35rem', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.025em' }],
        '5xl': ['3rem', { lineHeight: '3.4rem', letterSpacing: '-0.025em' }],
        '6xl': ['3.75rem', { lineHeight: '4.25rem', letterSpacing: '-0.03em' }],
        '7xl': ['4.5rem', { lineHeight: '5rem', letterSpacing: '-0.03em' }],
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
