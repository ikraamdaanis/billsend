import eslint from "@eslint/js";
import { tanstackConfig } from "@tanstack/eslint-config";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  ...tanstackConfig,
  ...tseslint.configs.recommended,
  eslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  reactHooks.configs.flat.recommended,
  {
    plugins: {
      "no-relative-import-paths": noRelativeImportPaths
    },
    rules: {
      "no-relative-import-paths/no-relative-import-paths": "error",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/set-state-in-effect": "off",
      "import/order": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/no-explicit-any": [
        "warn",
        {
          ignoreRestArgs: true
        }
      ],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_"
        }
      ]
    }
  },
  {
    files: ["**/*.{jsx,tsx}"],
    rules: {
      "no-console": "warn"
    }
  },
  globalIgnores(["build/**", "dist/**", "**/node_modules/", "**/*.js"])
]);
