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
        }
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          'from': { boxShadow: '0 0 5px #FFD700, 0 0 10px #FFD700' },
          'to': { boxShadow: '0 0 20px #FFD700, 0 0 30px #FFD700' },
        }
      }
    },
  },
  plugins: [],
}
