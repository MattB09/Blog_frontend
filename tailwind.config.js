module.exports = {
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        '104': '36rem',
        '120': '40rem'
      }
    },
  },
  variants: {
    extend: {},
    margin: ["last", "responsive"]
  },
  plugins: [],
}
