const path = require("path");
const { merge } = require("webpack-merge");

const dev = {
  mode: "development",
  output: {
    filename: "index.development.js",
  },
};
const prod = {
  mode: "production",
  output: {
    filename: "index.production.js",
  },
};
const configs = [dev, prod];

const common = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve("./dist"),
    library: {
      type: "commonjs2",
    },
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  externals: [/^react\/.+$/, /^react$/],
};

module.exports = configs.map((config) => merge(common, config));
