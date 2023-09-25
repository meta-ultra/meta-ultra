const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");

module.exports = (mode, envVars) => {
  return {
    mode: "production",
    output: {
      filename: "static/js/[name].[contenthash:8].bundle.js",
      chunkFilename: "static/js/[name].[contenthash:8].chunk.js",
      assetModuleFilename: "static/media/[name].[contenthash:8][ext][query]",
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
        },
      ],
    },
    optimization: {
      chunkIds: "named",
      minimizer: ["...", new CssMinimizerWebpackPlugin()],
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
        minChunks: 1,
        minSize: 0,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            filename: "static/js/[name].[contenthash:8].vendors.js",
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            filename: "static/js/[name].[contenthash:8].common.js",
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
    devtool: false,
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "public",
            noErrorOnMissing: true,
            globOptions: {
              // allow patterns to match entries that begin with a period.
              dot: true,
              /**
               * ignore the html-webpack-plugin template file, otherwise `Error in Conflict: Multiple assets emit different content to the same filename index.html` throws.
               * - Setting `index.html` or `public/index.html` to `ignore` option does not work;
               * - Setting `**\/index.html` to `ignore` option will ignore all index.html under the nest folder even.
               * - Neither does using `Regex` in `filter` option.
               */
              ignore: ["**/public/index.html"],
            },
          },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:8].css",
        chunkFilename: "static/css/[name].[contenthash:8].css",
      }),
    ],
  };
};
