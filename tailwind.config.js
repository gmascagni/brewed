/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          oat: '#F7F4EE',
          cream: '#FAF7F2',
          linen: '#ECE6DC',
          bone: '#DFD7CB',
          card: '#FFFFFF',
          dark: '#181513',
        },
        caramel: {
          DEFAULT: '#C88A4B',
          50: '#FBF6EE',
          100: '#F5E8D4',
          200: '#EBCFA9',
          300: '#E0B27A',
          400: '#D69550',
          500: '#C88A4B',
          600: '#A8622D',
          700: '#844823',
        },
        terroir: {
          washed: '#4A6B53',
          natural: '#B85D36',
          anaerobic: '#9E4D67',
          honey: '#D48C38',
        },
        coffee: {
          950: '#0E0B08',
          900: '#18120C',
          800: '#2A1D13',
          700: '#422B1B',
          600: '#5C3818',
          500: '#7E4B21',
          400: '#A66E38',
          300: '#C48B56',
          200: '#D2A06E',
          100: '#E8C39E',
          roast: '#8B5A2B',
        },
        espresso: {
          950: '#14110F',
          900: '#1C1815',
          800: '#2A2421',
          700: '#443B36',
          600: '#5C524B',
          500: '#766A62',
          400: '#8C8178',
          300: '#B0A69D',
          200: '#D5CDC5',
          100: '#EBE6E0',
        },
        amber: {
          gold: '#D48C46',
          bright: '#E29D56',
          muted: '#A36D48',
        },
        cream: {
          light: '#FAF7F2',
          soft: '#F4EFEA',
          dark: '#E2DDD7',
        },
        slate: {
          950: '#0F1216',
          900: '#161A20',
          800: '#1E2228',
          700: '#2C3036',
        },
        sage: {
          900: '#26382E',
          700: '#435C4C',
          500: '#5E7E6A',
          300: '#8FA899',
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Fraunces', 'Cinzel', 'Georgia', 'serif'],
        editorial: ['Newsreader', 'Fraunces', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(20, 17, 15, 0.04), 0 1px 2px rgba(20, 17, 15, 0.03)',
        card: '0 4px 16px -2px rgba(20, 17, 15, 0.06), 0 2px 6px -1px rgba(20, 17, 15, 0.04)',
        elevated: '0 12px 32px -4px rgba(20, 17, 15, 0.08), 0 4px 12px -2px rgba(20, 17, 15, 0.04)',
        tactile: '0 8px 24px -4px rgba(200, 138, 75, 0.12), 0 2px 8px -2px rgba(20, 17, 15, 0.04)',
      }
    },
  },
  plugins: [],
}
