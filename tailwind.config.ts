import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Be Vietnam Pro', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Literata', 'Georgia', 'serif'],
      },
      colors: {
        bg: {
          primary: '#201d18',
          secondary: '#26221c',
          elevated: '#2f2922',
        },
        text: {
          primary: '#f2ece3',
          secondary: '#d8ccbe',
          muted: '#a89b8b',
        },
        border: {
          subtle: '#3a352f',
          default: '#4d443a',
        },
        accent: {
          purple: '#d9763b',
          blue: '#7ca4d1',
          emerald: '#36b596',
          amber: '#e3a539',
          red: '#d87171',
        },
      },
      boxShadow: {
        card: '0 10px 28px rgba(0, 0, 0, 0.24)',
        'glow-purple': '0 0 0 1px rgba(217, 118, 59, 0.3), 0 8px 24px rgba(217, 118, 59, 0.18)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 280ms ease-out',
        shimmer: 'shimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
