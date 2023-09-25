const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

/**
 * @param {string} mode
 * @returns {string[]}
 */
const getEnvFileNames = (mode) => [".env", `.env.${mode}`, ".env.local", `.env.${mode}.local`];

/**
 * @param {string} mode
 * @returns
 */
const getEnvVarsFromConfigFiles = (mode) => {
  const fileNames = getEnvFileNames(mode);
  const env = fileNames.reduce((env, fileName) => {
    if (fileName) {
      const filePath = path.resolve(fileName);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, { encoding: "utf8" });
        // calling `dotenv.parse` won't pollute `process.env`
        Object.assign(env, dotenv.parse(content));
      }
    }

    return env;
  }, {});

  return env;
};

const extractReactAppEnvVars = (env) => {
  return Object.entries(env).reduce((reactAppEnv, [key, value]) => {
    if (key.startsWith("REACT_APP")) {
      reactAppEnv[key] = JSON.stringify(value);
    }

    return reactAppEnv;
  }, {});
};

const specialVars = {
  PUBLIC_URL(mode, env) {
    let PUBLIC_URL = mode === "development" ? "" : env.PUBLIC_URL || "";
    if (PUBLIC_URL.length > 0 && PUBLIC_URL[PUBLIC_URL.length - 1] !== "/") {
      PUBLIC_URL += "/";
    }

    return PUBLIC_URL;
  },
  ENABLE_INLINE_SVG_SPRITE(mode, env) {
    return eval(`!!${env.ENABLE_INLINE_SVG_SPRITE}`);
  },
};

const getEnvVars = (mode) => {
  const env = getEnvVarsFromConfigFiles(mode);

  return Object.assign(
    extractReactAppEnvVars(env),
    Object.keys(specialVars).reduce((envVars, name) => {
      envVars[name] = specialVars[name].call(null, mode, env);
      return envVars;
    }, {})
  );
};

const defineEnvironment = (name, env) => {
  return {
    [name]: Object.keys(env).reduce((envVars, name) => {
      envVars[name] = name === "PUBLIC_URL" ? JSON.stringify(env[name]) : env[name];
      return envVars;
    }, {}),
  };
};

module.exports = {
  getEnvVars,
  defineEnvironment,
};
