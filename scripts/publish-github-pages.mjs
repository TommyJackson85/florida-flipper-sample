#!/usr/bin/env node
/**
 * Copy the Next static export into docs/ for GitHub Pages (branch main + /docs).
 * Preserves product markdown already in docs/ (PRD, development plan).
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
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

if (!existsSync(join(docsDir, "index.html"))) {
  console.error("docs/index.html was not created.");
  process.exit(1);
}

console.log("Published static site to docs/ (index.html + assets).");
