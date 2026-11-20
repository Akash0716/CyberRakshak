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
        cyber: {
          bg: '#07111F',
          darker: '#040B15',
          secondary: '#0D1B2A',
          card: '#12263A',
          cardHover: '#172E46',
          border: '#1F3A56',
          accent: '#00D9FF',
          accentBlue: '#287BFF',
          accentPurple: '#8B5CF6',
          cyanGlow: 'rgba(0, 217, 255, 0.15)',
          blueGlow: 'rgba(40, 123, 255, 0.15)',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          muted: '#94A3B8',
          text: '#F8FAFC'
        }
      },
      boxShadow: {
        'cyan-glow': '0 0 25px -5px rgba(0, 217, 255, 0.3)',
        'blue-glow': '0 0 25px -5px rgba(40, 123, 255, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}

