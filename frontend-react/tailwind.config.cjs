/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        $primary: '#5C5ABC',
        '$primary-hover': '#3E3D87',
        $gray: '#F5F5F5',
        '$gray-hover': '#E1E1E1',
      },
      height: {
        $btn: '58px'
      }
    },
  },
  plugins: [],
};
