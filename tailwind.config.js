/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'pitch-green': {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
          darker: '#047857',
        },
        'deep-blue': {
          DEFAULT: '#1e293b',
          light: '#334155',
          dark: '#0f172a',
          darker: '#020617',
        },
        'elegant-black': {
          DEFAULT: '#0b0f19',
          card: 'rgba(15, 23, 42, 0.75)',
        },
        'gold': {
          DEFAULT: '#fbbf24',
          light: '#fde68a',
          dark: '#f59e0b',
          premium: '#d97706',
        },
        'alert-orange': {
          DEFAULT: '#f97316',
          light: '#fb923c',
          red: '#ef4444',
        },
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(251, 191, 36, 0.35)',
        'green-glow': '0 0 25px rgba(16, 185, 129, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'pitch-pattern': "radial-gradient(circle, rgba(16,185,129,0.1) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
