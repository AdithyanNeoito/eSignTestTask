/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "300px",
      md: "600px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
    },
    extend: {},
  },
  plugins: [],
};
