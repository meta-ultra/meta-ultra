module.exports = {
  plugins: {
    autoprefixer: {},
    "tailwindcss/nesting": {},
    tailwindcss: {},
    "postcss-preset-env": {
      features: {
        "nesting-rules": false,
      },
    },
  },
};
