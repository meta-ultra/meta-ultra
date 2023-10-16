module.exports =
  process.env.NODE_ENV === "production"
    ? require("./taro-cache.production.js")
    : require("./taro-cache.development.js");
