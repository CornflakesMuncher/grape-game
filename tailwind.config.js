/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "media", // or "class"
  theme: {
    extend: {
      scrollbarColor: {
        light: "#a78bfa #f3f4f6",  // thumb / track
        dark: "#a78bfa #1f2937",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
};
