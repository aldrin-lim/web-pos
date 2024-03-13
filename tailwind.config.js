/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      fontWeight: {
        bold: 700
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        // light: {
        //   ...require("daisyui/src/theming/themes")["light"],
        //   primary: "#856AD4",
        //   secondary: "#3A9E92",
        //   warning: "FF7300",
        //   "primary-content": "#ffffff",
        //   "secondary-content": "#ffffff",
        //   "accent-content": "#ffffff",
        // },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#856AD4",
          secondary: "#3A9E92",
          warning: "FF7300",
          neutral: "#FFFFFF",
          "primary-content": "#ffffff",
          "secondary-content": "#ffffff",
          "accent-content": "#ffffff",
          "base-secondary": "#fff"

        }
      },
      // "dark",
      // "cupcake",
      // "bumblebee",
      // "emerald",
      // "corporate",
      // "synthwave",
      // "retro",
      // "cyberpunk",
      // "valentine",
      // "halloween",
      // "garden",
      // "forest",
      // "aqua",
      // "lofi",
      // "pastel",
      // "fantasy",
      // "wireframe",
      // "black",
      // "luxury",
      // "dracula",
      // "cmyk",
      // "autumn",
      // "business",
      // "acid",
      // "lemonade",
      // "night",
      // "coffee",
      // "winter",
    ],
  },
}
