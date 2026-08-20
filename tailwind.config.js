/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0907',
        bone: '#EFE4D1',
        amber: { DEFAULT: '#C98B4B' },
        panel: '#16110D',
        paper: '#EAE2D4',
        paperPanel: '#DFD5C4',
        amberDeep: { DEFAULT: '#8F5F2C' },
        slate: { DEFAULT: '#2A3B47' },
      },
      fontFamily: {
        sans: ['"Almarai"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
      },
    },
  },
  plugins: [],
}
