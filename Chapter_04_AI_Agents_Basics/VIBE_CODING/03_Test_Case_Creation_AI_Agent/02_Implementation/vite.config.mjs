import { resolve } from "node:path";

const implementationRoot = resolve(import.meta.dirname);

export default {
  root: resolve(implementationRoot, "src/frontend"),
  build: {
    outDir: resolve(implementationRoot, "dist"),
    emptyOutDir: true,
  },
};
