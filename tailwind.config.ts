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
          primary: '#faf7f2',
          secondary: '#f5f0e8',
          card: '#ffffff',
        },
        fg: {
          primary: '#1a1208',
          secondary: '#5c4a2a',
          muted: '#9c7f52',
        },
        accent: {
          DEFAULT: '#c97b2e',
          light: '#e09a4f',
          dark: '#a05e18',
          faint: '#fdf3e3',
          subtle: '#f5ddb0',
        },
        border: {
          DEFAULT: '#e8ddc8',
          accent: '#e0bc7a',
        },
        status: {
          pending: '#b8860b',
          live: '#c97b2e',
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
