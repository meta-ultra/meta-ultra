const path = require("path");

module.exports = (mode, envVars) => {
  return {
    mode: "development",
    output: {
      filename: "static/js/[name].js",
      assetModuleFilename: "static/media/[name][ext][query]",
    },
    cache: {
      type: "filesystem",
    },
    module: {
      noParse: /^(lodash|jquery)$/,
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
      ],
    },
    resolve: {
      alias: {
        "lodash-es$": "lodash",
      },
    },
    devtool: "eval-cheap-module-source-map",
    watchOptions: {
      ignored: /node_modules/,
    },
    devServer: {
      static: [path.resolve("public")],
      /**
       * `true`, when there is no matching backend service for specified URL, the dev server will respond the `index.html`.
       * `{rewrites: [{from: /error/, to: '/index.html'}]}`, forward to `index.html` when the request URL contains `error`.
       */
      historyApiFallback: true,
      hot: true,
      open: true,
      port: 8081,
    },
  };
};
