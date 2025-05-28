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
        wave: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-3px) rotate(1.5deg)' },
          '50%': { transform: 'translateY(2px) rotate(-1.5deg)' },
          '75%': { transform: 'translateY(-1px) rotate(1deg)' },
        },
        waveFlag: {
          '0%': { transform: 'rotate(0deg) translateX(0) skewY(1deg)' },
          '25%': { transform: 'rotate(0.3deg) translateX(-1px) skewY(2deg)' },
          '50%': { transform: 'rotate(-0.3deg) translateX(1px) skewY(-2deg)' },
          '75%': { transform: 'rotate(0.2deg) translateX(-1px) skewY(1deg)' },
          '100%': { transform: 'rotate(0deg) translateX(0) skewY(1deg)' },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 8px #f9c300, 0 0 16px #8b0000',
          },
          '50%': {
            boxShadow: '0 0 12px #8b0000, 0 0 24px #f9c300',
          },
        },
        glowText: {
          '0%, 100%': {
            textShadow: '0 0 4px #f9c300, 0 0 8px #8b0000',
          },
          '50%': {
            textShadow: '0 0 8px #f9c300, 0 0 12px #8b0000',
          },
        },
      },
      animation: {
        rotateBg: 'rotateBg 14s ease-in-out infinite',
        swing: 'swing 4.5s ease-in-out infinite',
        spin: 'spin 40s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
        wave: 'wave 4s ease-in-out infinite',
        waveFlag: 'waveFlag 2.5s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
        glowText: 'glowText 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
