/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// const path = require("path");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  modulePathIgnorePatterns: ["dist", "./test.js"],
};
