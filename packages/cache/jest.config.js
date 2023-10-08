const fs = require("fs");
const path = require("path");

const roots = (roots) => {
  return roots
    .filter((dir) => {
      return fs.existsSync(path.resolve(__dirname, dir));
    })
    .map((dir) => `<rootDir>/${dir}`);
};

module.exports = {
  roots: roots(["src", "test", "tests", "__test__", "__tests__"]),
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: [
    "**/*.(spec|test).(ts|tsx|js|jsx)",
    "**/__test(s)?__/**/*.(ts|tsx|js|jsx)",
  ],
  // collect coverage information or not, defaults to false.
  collectCoverage: true,
  // coverageDirectory: "test/coverage", // where to output the coverage information files
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
};
