const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["src/server.ts"],
    bundle: true,
    platform: "node",
    target: "node22.12",
    outfile: "dist/index.js",
    external: ["@prisma/client", "prisma"],
  })
  .catch(() => process.exit(1));
