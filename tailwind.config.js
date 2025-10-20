/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)", "system-ui", "sans-serif"], // global Poppins
        inter: ["Inter", "sans-serif"], // for chat messages
      },
      spacing: {
        '18px': '18px', // custom spacing if needed
        '25px': '25px',
      },
      maxWidth: {
        'nav': '100%', // allow navbar to use full width
      },
      zIndex: {
        '60': '60', // optional higher z-index if needed for dropdowns
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".backface-hidden": {
          "backface-visibility": "hidden",
          "-webkit-backface-visibility": "hidden",
        },
        ".preserve-3d": {
          "transform-style": "preserve-3d",
        },
        ".perspective": {
          perspective: "1000px",
        },
        ".rotate-y-180": {
          transform: "rotateY(180deg)",
        },
        // Additional utility for nowrap items
        ".flex-nowrap": {
          "flex-wrap": "nowrap",
        },
        ".whitespace-nowrap": {
          "white-space": "nowrap",
        },
      });
    },
  ],
};
