module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/test/**/*.spec.ts"],
  // collect coverage information or not, defaults to false.
  collectCoverage: true,
  // coverageDirectory: "test/coverage", // where to output the coverage information files
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
};
