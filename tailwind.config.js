/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './components/themes/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#407CE2',
        secondary: '#000000',
      },
      fontFamily: {
        montserratBold: ['MontserratBold', 'sans-serif'],
        montserratRegular: ['MontserratRegular', 'sans-serif'],
        montserratSemiBold: ['MontserratSemiBold', 'sans-serif'],
        montserratMedium: ['MontserratMedium', 'sans-serif'],
        montserratItalic: ['MontserratItalic', 'sans-serif'],
        montserratSemiBoldItalic: ['MontserratSemiBoldItalic', 'sans-serif'],
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
