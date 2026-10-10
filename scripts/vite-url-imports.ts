import { plugin, resolveSync } from "bun";

// Lets Bun load modules written for Vite: an `?url` font import resolves to
// the file's absolute path, which react-pdf reads straight from disk.
plugin({
  name: "vite-url-imports",
  setup(build) {
    build.onResolve({ filter: /\?url$/ }, args => ({
      path: resolveSync(args.path.replace(/\?url$/, ""), args.importer)
    }));
    build.onLoad({ filter: /\.woff2?$/ }, args => ({
      contents: `export default ${JSON.stringify(args.path)};`,
      loader: "js"
    }));
  }
});
