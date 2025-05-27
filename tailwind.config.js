// tailwind.config.js

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gsYellow: '#f9c300',
        gsRed: '#8b0000',
      },
      backgroundImage: {
        'gs-spin': 'linear-gradient(120deg, #83232A, #E5A823, #83232A)',
        
      },
      backgroundSize: {
        '250': '100% 250%',
      },
      keyframes: {
        rotateBg: {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
   swing: {
      '0%': { transform: 'rotate(6deg)' },
      '50%': { transform: 'rotate(-6deg)' },
      '100%': { transform: 'rotate(6deg)' },
    },
},
animation: {
  rotateBg: 'rotateBg 14s ease-in-out infinite',
  swing: 'swing 4.5s ease-in-out infinite',
  spin: 'spin 40s linear infinite',
  'spin-slow': 'spin 20s linear infinite',
},
    },
  },
  plugins: [],
};
