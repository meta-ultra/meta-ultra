const path = require("path");
const { merge } = require("webpack-merge");

const dev = {
  mode: "development",
  output: {
    filename: "[name].development.js",
  },
};
const prod = {
  mode: "production",
  output: {
    filename: "[name].production.js",
  },
};
const configs = [dev, prod];

const common = {
  entry: {
    index: "./src/index.ts",
  },
  output: {
    path: path.resolve("./dist/cjs"),
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
  externals: [
    /^react\/.+$/,
    /^react$/,
    /^@tarojs\/taro\/.+$/,
    /^@tarojs\/taro$/,
  ],
};

module.exports = configs.map((config) => merge(common, config));
