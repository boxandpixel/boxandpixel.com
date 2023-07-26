/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        dark: "#151531",
        purple: "#421a92",
        blue: "#0091c4",
        turquoise: "#39beff",
        pink: "#c051ff",
        grayVeryLight: "#eeeeee",
        magenta: "#C93053",
        yellow: "#C4BA14",
        yellowDark: "#787106",
        blueDark: "#377F99",
        text: "#ececf9",
      },
      fontFamily: {
        figtree: ["Figtree Variable", "sans-serif"],
      },
    },
  },
  plugins: [],
};
