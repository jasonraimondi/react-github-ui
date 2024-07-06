import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  format: ["cjs", "esm"],
  entry: ["src/contributors.tsx", "src/sponsors.tsx"],
  sourcemap: true,
  splitting: false,
});
