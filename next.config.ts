import type { NextConfig } from "next";

/** Set when publishing the static site for GitHub Pages. */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const pagesBase = "/florida-flipper-sample";

/**
 * Local `npm run dev` / `npm run build` keep normal paths.
 * `GITHUB_PAGES=true npm run export:pages` prefixes assets for:
 * https://tommyjackson85.github.io/florida-flipper-sample/
 */
const nextConfig: NextConfig = {
  output: "export",
  /** Allow Cloudflare quick tunnels (trycloudflare.com) to load /_next/* in dev. */
  allowedDevOrigins: ["*.trycloudflare.com"],
  ...(isGithubPages
    ? {
        basePath: pagesBase,
        assetPrefix: pagesBase,
      }
    : {}),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
