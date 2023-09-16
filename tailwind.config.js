/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      screens: {
        'xs' : '400px',
        'lg-2': '950px',
        'md-2' : '850px'
      },
      colors :{
        'black-rgba-1' : "rgba(0, 0, 0 , 0.3)",
        'dropbox1' : '#eeeeee',
        'dropbox2' : '#fafafa',
        'dropbox3': '#bdbdbd',
        'white-rgba-1' : "rgba(255, 255, 255 , 0.9)",
        'white-rgba-2' : "rgba(255, 255, 255 , 0.01)",
      }, 
      animation : {
        fadeOut : 'fadeOut .3s ease-in-out'
      },
      keyframes : ({
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': {opacity: 0}
        },
      })
    },
  },
  plugins: [

  ],
}
