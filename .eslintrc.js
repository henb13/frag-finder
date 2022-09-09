module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  overrides: [
    {
      files: ["src/__tests__/**"],
      plugins: ["jest"],
      extends: ["plugin:jest/all"],
      rules: {},
    },
  ],
  rules: {
    "no-param-reassign": "warn",
    "prefer-const": [
      "warn",
      {
        destructuring: "all",
        ignoreReadBeforeAssign: false,
      },
    ],
  },
};
