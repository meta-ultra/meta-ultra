/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{tsx,jsx,ts,js,html}"],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-textshadow")],
};
