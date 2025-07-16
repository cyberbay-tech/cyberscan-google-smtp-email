module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "@typescript-eslint/recommended"],
  rules: {
    // TypeScript specific rules
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/prefer-const": "error",
    "@typescript-eslint/no-var-requires": "error",

    // General rules
    "no-console": "off", // Allow console.log for CLI applications
    "no-debugger": "error",
    "no-duplicate-imports": "error",
    "no-unused-expressions": "error",
    "prefer-const": "error",
    "no-var": "error",

    // Code style
    indent: ["error", 2],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": ["error", "never"],
    "space-before-function-paren": ["error", "never"],
    "space-before-blocks": "error",
    "keyword-spacing": "error",
    "space-infix-ops": "error",
    "eol-last": "error",
    "no-trailing-spaces": "error",
    "no-multiple-empty-lines": ["error", { max: 2 }],
  },
  env: {
    node: true,
    es2020: true,
  },
  ignorePatterns: ["dist/", "node_modules/", "*.js", "*.d.ts"],
};
