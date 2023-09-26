const path = require("path");
const webpack = require("webpack");
const svgToMiniDataURI = require("mini-svg-data-uri");
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const { merge } = require("webpack-merge");

module.exports = {
  mode: "development",
  entry: {
    index: {
      import: "./src/index.ts",
      filename: "index.js",
    },
    LinkButton: "./src/components/button/LinkButton/LinkButton.tsx",
    LinkDeleteButton:
      "./src/components/button/LinkDeleteButton/LinkDeleteButton.tsx",
    LinkUpdateButton:
      "./src/components/button/LinkUpdateButton/LinkUpdateButton.tsx",
    Dialog: "./src/components/dialog/Dialog/index.ts",
    FormDialog: "./src/components/dialog/FormDialog/index.ts",
  },
  output: {
    clean: true,
    path: path.resolve("dist/cjs"),
    filename: "[name]/index.js",
    library: {
      type: "commonjs2",
    },
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
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|webp|hdr|eot|otf|ttf|woff2?)$/i,
        type: "asset/inline",
      },
      {
        test: /\.svg$/i,
        oneOf: [
          {
            include: path.resolve("src/assets/icons/svg_sprite"),
            type: "javascript/auto",
            use: [
              {
                loader: "svg-sprite-loader",
                options: {
                  extract: false,
                },
              },
              "svgo-loader",
            ],
          },
          /**
           * Wrap SVG as a ReactComponent, which can be used in `import Password1 from "./svg/password1.svg"`.
           */
          {
            issuer: /\.(j|t)sx$/i,
            type: "javascript/auto",
            resourceQuery: { not: /url/i },
            use: "@svgr/webpack",
          },
          {
            type: "asset",
            generator: {
              dataUrl: (content) => svgToMiniDataURI(content.toString()),
            },
          },
        ],
      },
    ],
  },
  resolve: {
    // Stop resolving immediately, once existing file has been found.
    // If there are both `App.jsx` and `app.js`, `import * from "./app"` would be resolved to `App.jsx`.
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    alias: {
      "@": path.resolve("src"),
    },
    mainFiles: ["index"],
  },
  externals: [
    /^react\/.+$/,
    /^react$/,
    /^react-dom\/.+$/,
    /^react-dom$/,
    /^antd$/,
    /^@babel\/runtime\/.*$/,
    /**
     *
     * @param {*} param0
     * - context, 请求发起的目录
     * - request, 请求资源的URI（可带扩展名或不带扩展名，如./LinkButton.tsx、./LinkButton.jsx, ./LinkButton, react等）
     * - dependencyType : "esm"
     * - contextInfo
     *   - issuer, 请求发起的文件，例如entry配置的入口则issuer为''
     *   - issuerLayer, null
     *   - compiler, undefined
     * - getResolve: Function
     * @param {*} callback - callback()则不排除，callback(null, request)则排除
     */
    // (state, callback) => {
    //   if (
    //     state.contextInfo.issuer !== "" &&
    //     /LinkButton(\.(t|j)sx)?$/.test(state.request)
    //   ) {
    //     callback(null, state.request);
    //   } else {
    //     callback();
    //   }
    // },
  ],
  optimization: {
    minimizer: ["...", new CssMinimizerWebpackPlugin()],
  },
  plugins: [
    new SpriteLoaderPlugin({
      // Remove the additional styles and usages in extract mode.(there is no additional styles and usages in inline mode)
      plainSprite: true,
    }),
    // any require statement matching './local' from any directories ending with 'moment' will be ignored.
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new MiniCssExtractPlugin({
      filename(pathData) {
        const { name } = pathData.chunk;
        if (name === "index") {
          return "style.css";
        } else {
          return `${name}/style.css`;
        }
      },
    }),
  ],
};
