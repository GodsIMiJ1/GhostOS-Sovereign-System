/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        flame: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      boxShadow: {
        'flame': '0 0 20px rgba(251, 146, 60, 0.3)',
        'flame-lg': '0 0 40px rgba(251, 146, 60, 0.4)',
      },
      dropShadow: {
        'flame': '0 0 5px rgba(251, 146, 60, 0.8)',
      },
      animation: {
        'flame-pulse': 'flame-pulse 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'flame-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(251, 146, 60, 0.5)',
            textShadow: '0 0 5px rgba(251, 146, 60, 0.5)'
          },
          '50%': {
            boxShadow: '0 0 20px rgba(251, 146, 60, 0.8)',
            textShadow: '0 0 10px rgba(251, 146, 60, 0.8)'
          },
        },
        'glow': {
          '0%': { textShadow: '0 0 5px currentColor' },
          '100%': { textShadow: '0 0 20px currentColor' },
        },
      },
    },
  },
  plugins: [],
}
