/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["**/*.{tsx,jsx,ts,js,html}"],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-textshadow")],
};
