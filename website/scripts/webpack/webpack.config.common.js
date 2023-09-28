const path = require("path");
const webpack = require("webpack");
const svgToMiniDataURI = require("mini-svg-data-uri");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin");
const env = require("./env");

module.exports = (mode, envVars) => {
  return {
    mode,
    entry: ["react-hot-loader/patch", "./src/index.tsx"],
    output: {
      path: path.resolve("dist"),
      publicPath: envVars.PUBLIC_URL,
      clean: true,
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
          test: /\.ya?ml$/,
          use: "yaml-loader",
        },
        {
          test: /\.(png|jpe?g|gif|webp|hdr|eot|otf|ttf|woff)$/i,
          // a file with size less than 8kb will be treated as a `inline` module type and `resource` module type otherwise.
          type: "asset",
        },
        {
          test: /\.(glb|gltf)$/i,
          type: "asset/resource",
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
                    // Generate SVG sprite file under outputPath named `sprite.svg` in extract mode.
                    // Note that, the outputPath and filename can not be modified actually(the options `outputPath` and `spriteFilename` do not work)
                    extract: !envVars.ENABLE_INLINE_SVG_SPRITE,
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
      // modules: [path.resolve("node_modules")],
      mainFiles: ["index"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        // Deprecated option to set the title for the generated HTML document, use `title` element in template instead.
        // Besides, it's recommended to add the `meta` element, favicon and `base` element in template rather than options of html-webpack-plugin.
        title: "Webpack App",
        // Set Webpack relative or absolute path to the template(parsed by EJS(https://ejs.bootcss.com/) by default).
        // By default it uses `src/index.ejs` if it exists.
        template: "public/index.html",
        // Define EJS variables which can be referenced by `<%= PUBLIC_URL %>`, merged with the default values.
        templateParameters: envVars,
        // The file path to write the HTML to, which is based on the `path` of `output`.
        // The `[name]` placeholder will be replaced with the entry name.
        // In account of `index` option of `devServer` has been removed, set `filename` to `index.html`.
        filename: "index.html",
        // By default it's `true` if `mode` is `production`, otherwise `false`.
        // minify: false,
        // Overrides the `publicPath` of `output` used for `script` and `link` tags, when its value is not the default value - `"auto"`.
        publicPath: "auto",
        // Inject all assets into the given `template`. By default `true` means asset injection depending on the `scriptLoading` option.
        inject: true,
        // By default using non blocking javascript loading `"defer"` to improve the page startup performance.
        // Setting to `"module"` adds attribute `type="module"` on script element.
        scriptLoading: "defer",
      }),
      new SpriteLoaderPlugin({
        // Remove the additional styles and usages in extract mode.(there is no additional styles and usages in inline mode)
        plainSprite: true,
      }),
      new webpack.DefinePlugin(env.defineEnvironment("process.env", envVars)),
      // any require statement matching './local' from any directories ending with 'moment' will be ignored.
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
    ],
  };
};
