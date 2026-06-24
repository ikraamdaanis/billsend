/** @type {import("prettier").Config} */
const config = {
  arrowParens: "avoid",
  bracketSameLine: false,
  bracketSpacing: true,
  htmlWhitespaceSensitivity: "css",
  insertPragma: false,
  jsxSingleQuote: false,
  plugins: ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"],
  printWidth: 80,
  proseWrap: "preserve",
  quoteProps: "as-needed",
  requirePragma: false,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "none",
  useTabs: false
};

export default config;
