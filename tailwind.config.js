/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff5f1',
          100: '#ffe8de',
          200: '#ffcfbc',
          300: '#ffaf8e',
          400: '#ff8258',
          500: '#FF6B35',
          600: '#e5511b',
          700: '#cc4016',
          800: '#a8351a',
          900: '#8a2e1a',
        },
        secondary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#1E3A5F',
          900: '#102a43',
        },
        accent: {
          50: '#fffdf0',
          100: '#fffadc',
          200: '#fff4b8',
          300: '#ffeb85',
          400: '#ffe052',
          500: '#FFB700',
          600: '#e6a500',
          700: '#cc9400',
          800: '#b38200',
          900: '#997100',
        },
      },
      fontFamily: {
        'display': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      animation: {
        'bounce-gentle': 'bounce 0.5s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}