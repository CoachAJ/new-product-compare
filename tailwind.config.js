/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#FFD700',
          dark: '#0A0A0A',
          card: '#1A1A1A',
        },
        // Explicit color definitions for reliability
        gold: {
          50: '#FFFDF0',
          100: '#FFF9D6',
          200: '#FFF0A3',
          300: '#FFE566',
          400: '#FFD700',
          500: '#E6C200',
          600: '#B39600',
          700: '#806B00',
          800: '#4D4000',
          900: '#1A1500',
        },
        cyan: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
        },
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          'from': { boxShadow: '0 0 5px #FFD700, 0 0 10px #FFD700' },
          'to': { boxShadow: '0 0 20px #FFD700, 0 0 30px #FFD700' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      }
    },
  },
  plugins: [],
}
