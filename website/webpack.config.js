const { merge } = require("webpack-merge");
const common = require("./scripts/webpack/webpack.config.common");
const { getEnvVars } = require("./scripts/webpack/env");

const proxy = [
  {
    context: [
      "/smartpark/api",
      "/smartpark/file",
      "/workorder/api",
      "/workorder/file",
    ],
    target: "https://fyict.cn:8091",
    secure: false,
  },
];

module.exports = (env, argv) => {
  const mode = (process.env.NODE_ENV = env.production
    ? "production"
    : "development");
  const envVars = getEnvVars(mode);
  console.log(envVars);

  const environment = require(`./scripts/webpack/webpack.config.${mode}`);
  const config = merge(
    common(mode, envVars),
    environment(mode, envVars),
    mode === "development" ? { devServer: { proxy } } : {}
  );

  return config;
};
