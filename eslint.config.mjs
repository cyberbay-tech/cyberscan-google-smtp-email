import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-var-requires": "error",
      "no-console": "off",
      "no-debugger": "error",
      "no-duplicate-imports": "error",
      "no-unused-expressions": "error",
      "prefer-const": "error",
      "no-var": "error",
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
  },
  {
    files: ["**/__tests__/**/*.ts", "**/*.test.ts", "**/*.spec.ts"],
    languageOptions: {
      globals: {
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        global: "readonly",
        console: "readonly",
        require: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-var-requires": "off", // Allow require in test files
    },
  },
];
