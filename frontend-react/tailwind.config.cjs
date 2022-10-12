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
      }
    },
  },
  plugins: [],
};
