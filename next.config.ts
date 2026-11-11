import type { NextConfig } from "next";

// Set by the GitHub Pages workflow. Locally and on hosts such as Vercel
// both are unset and the site is served from the domain root as usual.
const staticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Cache Components (partial prerendering) needs a server, so it is only
  // enabled when the site is not being exported as static files.
  ...(staticExport
    ? { output: "export" as const, trailingSlash: true }
    : { cacheComponents: true, partialPrefetching: true }),
  basePath,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
