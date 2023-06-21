/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    },
    colors: {
      transparent: 'transparent',
      black: '#000',
      white: '#fff',
      primary: '#0747A6',
      tertiary: '#e6e9f0',
      textDarkest: '#172b4d',
      textDark: '#42526E',
      textMedium: '#5E6C84',
      textLight: '#8993a4',
      textLink: '#0052cc',
      textLogo: '#DEEBFF',

      backgroundDarkPrimary: '#0747A6',
      backgroundMedium: '#dfe1e6',
      backgroundLight: '#ebecf0',
      backgroundLightest: '#F4F5F7',
      backgroundLightPrimary: '#D2E5FE',
      backgroundLightSuccess: '#E4FCEF',

      borderLightest: '#dfe1e6',
      borderLight: '#C1C7D0',
      borderInputFocus: '#4c9aff'
    },
    borderColor: theme => ({
      ...theme('colors'),
      default: theme('colors.gray.300', 'currentColor')
    }),
    spacing: {
      sidebar: '230px',
      sidebarShort: '210px',
      navbarLeft: '64px',
      navbarLeftSidebar: `${230 + 64}px`,
      navbarLeftSidebarShort: `${210 + 64}px`,
      px: '1px',
      0: '0',
      1: '0.25rem',
      '1-25': '0.3125rem',
      '1-5': '0.375rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      32: '8rem',
      40: '10rem',
      48: '12rem',
      56: '14rem',
      64: '16rem',
      72: '18rem',
      80: '20rem',
      88: '22rem'
    }
  },

  plugins: []
}
