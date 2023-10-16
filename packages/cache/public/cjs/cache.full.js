module.exports =
  process.env.NODE_ENV === "production"
    ? require("./cache.full.production.js")
    : require("./cache.full.development.js");
