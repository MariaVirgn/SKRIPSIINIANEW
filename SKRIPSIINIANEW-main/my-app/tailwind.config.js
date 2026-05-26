/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        archivo: ["Archivo", "sans-serif"],
        bebas: ["Bebas Neue", "cursive"],
        timesNewRoman: ["Times New Roman", "serif"],
      },
      colors: {
        primary: "rgba(130, 111, 199, 1)", // warna custom
      },
      fontSize: {
        749: "749px", // ini besar banget, biasanya font nggak segede ini
        189: "189px", // biasanya ukuran font yang realistis antara 8-96px
      },
      
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".text-stroke-1": {
          "-webkit-text-stroke": "2px black",
        },
        ".text-stroke-2": {
          "-webkit-text-stroke": "2px black",
          color: "transparent",
        },
        ".text-stroke-white": {
          "-webkit-text-stroke-color": "white",
        },
        ".text-stroke-black": {
          "-webkit-text-stroke-color": "black",
        },
      });
    },
  ],
};
