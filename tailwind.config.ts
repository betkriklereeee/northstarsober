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
          primary: '#0f0f0f',
          secondary: '#171717',
          tertiary: '#1f1f1f',
          card: '#1a1a1a',
          elevated: '#222222',
        },
        fg: {
          primary: '#f0ede8',
          secondary: '#a09b96',
          muted: '#5c5652',
        },
        sage: {
          DEFAULT: '#7a9e7e',
          light: '#9ab89e',
          dark: '#5a7a5e',
          subtle: '#1e2b1f',
          faint: '#161e17',
        },
        border: {
          DEFAULT: '#252525',
          light: '#2f2f2f',
          sage: '#3a4f3b',
        },
        status: {
          pending: '#c4943a',
          live: '#7a9e7e',
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
