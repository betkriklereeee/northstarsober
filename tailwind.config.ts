import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#f8f9fa',
          secondary: '#f1f3f5',
          tertiary: '#dee2e6',
          card: '#ffffff',
          elevated: '#e9ecef',
        },
        fg: {
          primary: '#0f1923',
          secondary: '#4a5568',
          muted: '#718096',
        },
        accent: {
          DEFAULT: '#4a7fa5',
          light: '#6b9fc4',
          dark: '#2d6a8f',
          subtle: '#c5ddf0',
          faint: '#e8f1f8',
        },
        border: {
          DEFAULT: '#dee2e6',
          light: '#e9ecef',
          accent: '#c5ddf0',
        },
        status: {
          pending: '#c4943a',
          live: '#4a7fa5',
          rejected: '#9e5050',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '90rem',
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
    },
  },
  plugins: [],
}

export default config
