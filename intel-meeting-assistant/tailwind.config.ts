// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Intel Brand Colors
        intel: {
          blue: '#0071c5',
          'light-blue': '#00a8e8',
          navy: '#003c71',
          gray: '#6b7280',
          'light-gray': '#f3f4f6',
          'dark-gray': '#374151',
        },
        primary: {
          DEFAULT: '#0071c5',
          50: '#eff8ff',
          100: '#dbeefe',
          200: '#bee3fd',
          300: '#91d2fb',
          400: '#5eb9f7',
          500: '#389df2',
          600: '#2382e7',
          700: '#1a6dd4',
          800: '#1c59ab',
          900: '#1c4d87',
          950: '#163152',
        },
        secondary: {
          DEFAULT: '#6b7280',
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'intel-gradient': 'linear-gradient(135deg, #0071c5, #00a8e8)',
      },
    },
  },
  plugins: [],
}
export default config