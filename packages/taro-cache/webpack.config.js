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
    "taro-cache": "./src/index.ts",
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
  externals: [/^@tarojs\/taro\/.+$/, /^@tarojs\/taro$/],
};

module.exports = (env) => {
  console.log(env);
  return configs
    .slice(0, env.production ? undefined : 1)
    .map((config) => merge(common, config));
};
