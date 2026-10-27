/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#080B14',
        'background-secondary': '#101626',
        'card-bg': '#121B2D',
        'card-border': 'rgba(139, 92, 246, 0.2)',
        primary: {
          DEFAULT: '#8B5CF6',
          hover: '#7C3AED',
          glow: 'rgba(139, 92, 246, 0.5)',
        },
        secondary: {
          DEFAULT: '#38BDF8',
          hover: '#0284C7',
          glow: 'rgba(56, 189, 248, 0.5)',
        },
        accent: {
          cyan: '#06B6D4',
          neon: '#00F0FF',
          magenta: '#EC4899',
          emerald: '#10B981',
        },
        success: '#34D399',
        warning: '#FBBF24',
        danger: '#EF4444',
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Orbitron', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(56, 189, 248, 0.4)',
        'glow-emerald': '0 0 25px -5px rgba(52, 211, 153, 0.4)',
        'card-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
