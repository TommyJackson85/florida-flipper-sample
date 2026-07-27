# Deal Screen

Lightweight Next.js app for Florida condo deal screening. File-based only — no database or auth.

## Workflow

| Keep in | Put here |
|---|---|
| `memos/`, `notes/`, `sources/`, `screenshots/` | Narrative research, URLs-in-progress, screenshots, long-form reasoning |
| `src/data/properties/<id>.ts` | Stable, repeated facts that power the UI (address, taxes, association, risk flags, screen status) |

Do not invent underwriting numbers. If HOA, rent, insurance, or returns are unverified, leave them `null` / `"unknown"` and record conflicts as notes.

## Add a second property

**Path A — fastest identity stub**

1. Open `/intake`, enter address / city / state / ZIP (optional title, county, notes).
2. Copy the TypeScript stub.
3. Save as `src/data/properties/<kebab-case-id>.ts` (use the suggested filename).
4. Register the export in `src/data/properties/index.ts` (see comments there).
5. Run `npm run dev` → confirm the card on `/properties` and open `/properties/<id>`.

**Path B — full blank shape (recommended once you start filling diligence)**

1. Copy `src/data/properties/_template.ts` to `src/data/properties/<kebab-case-id>.ts`.
2. Paste identity fields from `/intake` (or type them in).
3. Leave `proForma` null, screening `"unknown"`, and all `condoRiskFlags` `"unknown"` until you have evidence.
4. Register in `index.ts`. Do **not** import `_template.ts` itself.
5. Keep narrative in `memos/` / `notes/` / `sources/` and point `referencePaths` at those files.

## Scripts

```bash
npm run dev
npm run build
```
