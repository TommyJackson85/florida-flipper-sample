#!/usr/bin/env node
/**
 * Copy the Next static export into docs/ for GitHub Pages (branch main + /docs).
 * Preserves product markdown already in docs/ (PRD, development plan).
 *
 * Also renames Next's `properties/[id]` chunk folders — GitHub Pages rejects
 * literal brackets in paths — and rewrites matching asset URLs.
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const outDir = join(root, "out");
const docsDir = join(root, "docs");

if (!existsSync(outDir)) {
  console.error("Missing out/. Run next build with GITHUB_PAGES=true first.");
  process.exit(1);
}

mkdirSync(docsDir, { recursive: true });

/** Keep product docs; remove previous static-site artifacts. */
const preserve = new Set(["PRD.md", "DEVELOPMENT_PLAN.md"]);
for (const name of readdirSync(docsDir)) {
  if (preserve.has(name)) continue;
  rmSync(join(docsDir, name), { recursive: true, force: true });
}

for (const name of readdirSync(outDir)) {
  cpSync(join(outDir, name), join(docsDir, name), { recursive: true });
}

/** Prevent Jekyll from ignoring folders like _next on GitHub Pages. */
writeFileSync(join(docsDir, ".nojekyll"), "");

sanitizeBracketPaths(docsDir);

if (!existsSync(join(docsDir, "index.html"))) {
  console.error("docs/index.html was not created.");
  process.exit(1);
}

console.log("Published static site to docs/ (index.html + assets).");

/**
 * GitHub Pages builds fail on paths containing `[` / `]`.
 * Next puts App Router chunks under `properties/[id]/`; rename to `properties/id/`.
 */
function sanitizeBracketPaths(dir) {
  const bracketDir = join(
    dir,
    "_next/static/chunks/app/properties/[id]"
  );
  const safeDir = join(dir, "_next/static/chunks/app/properties/id");
  if (existsSync(bracketDir)) {
    if (existsSync(safeDir)) {
      rmSync(safeDir, { recursive: true, force: true });
    }
    renameSync(bracketDir, safeDir);
  }

  rewriteAssetUrls(dir);
}

function rewriteAssetUrls(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) {
      rewriteAssetUrls(path);
      continue;
    }
    if (!/\.(html|js|css|txt|json|map)$/.test(name)) continue;
    const before = readFileSync(path, "utf8");
    // Only rewrite URL-encoded asset folder refs, not router route ids in manifests.
    const after = before.replaceAll(
      "properties/%5Bid%5D/",
      "properties/id/"
    );
    if (after !== before) {
      writeFileSync(path, after);
    }
  }
}
