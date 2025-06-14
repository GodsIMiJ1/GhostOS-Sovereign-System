/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./*.js",
    "./src/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        'ghost-black': '#0a0a0a',
        'ghost-deep': '#121212',
        'ghost-blue': '#00ffff',
        'ghost-purple': '#a471ff',
        'ghost-orange': '#ff5e00',
        'ghost-text': '#e5e5e5',
        'ghost-subtext': '#888888',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      animation: {
        'flicker': 'flicker 1.5s infinite',
        'glitch': 'glitch 1s infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '45%': { opacity: '0.6' },
          '55%': { opacity: '0.3' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-1px, 1px)' },
          '40%': { transform: 'translate(1px, -1px)' },
          '60%': { transform: 'translate(-1px, -1px)' },
          '80%': { transform: 'translate(1px, 1px)' },
          '100%': { transform: 'translate(0)' },
        }
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glow-orange': '0 0 20px rgba(255, 94, 0, 0.5)',
        'glow-purple': '0 0 20px rgba(164, 113, 255, 0.5)',
        'glow-cyan': '0 0 20px rgba(0, 255, 255, 0.5)',
      }
    },
  },
  plugins: [],
}
