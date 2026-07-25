# Deal Screen

Lightweight Next.js app for Florida condo deal screening. File-based only — no database or auth.

## Workflow

| Keep in | Put here |
|---|---|
| `memos/`, `notes/`, `sources/`, `screenshots/` | Narrative research, URLs-in-progress, screenshots, long-form reasoning |
| `src/data/properties/<id>.ts` | Stable, repeated facts that power the UI (address, taxes, association, diligence checklist, screen status) |

Do not invent underwriting numbers. If HOA, rent, insurance, or returns are unverified, leave them `null` / `"unknown"` and record conflicts as notes.

## Add a property

1. Copy the shape of `src/data/properties/7863-niagara-1921.ts`.
2. Use a kebab-case `id` matching the filename (and the URL `/properties/<id>`).
3. Register the export in `src/data/properties/index.ts`.
4. Optionally set `referencePaths` to the related memo/notes/sources files.
5. Run `npm run dev` and open `/properties`.

## Scripts

```bash
npm run dev
npm run build
```
