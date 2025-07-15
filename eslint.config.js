import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import eslintPluginPrettier from "eslint-plugin-prettier";
import pluginNode from "eslint-plugin-n";

export default defineConfig([
  js.configs.recommended,
  {
    ignores: ["**/dist"],
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.node,
    },
    plugins: {
      prettier: eslintPluginPrettier,
      n: pluginNode,
    },
    rules: {
      ...pluginNode.configs["recommended"].rules,
      "no-unused-vars": ["warn", { argsIgnorePattern: "req|res|next|val" }],
      "n/no-unsupported-features/node-builtins": "error",
      "n/no-deprecated-api": "warn",
      "n/no-missing-import": "warn",
      "n/no-path-concat": "warn",
      "n/no-unpublished-import": "off",
    },
  },
]);
