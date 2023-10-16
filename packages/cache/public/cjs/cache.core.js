module.exports =
  process.env.NODE_ENV === "production"
    ? require("./cache.core.production.js")
    : require("./cache.core.development.js");
