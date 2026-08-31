/**
 * Dataset catalog metadata — single source for registry ids, tiers, and trial visibility.
 * Property seed files remain in sibling `<id>.ts` files; this file describes how they are grouped.
 */

export type PropertyCatalogTier =
  | "pilot-primary"
  | "contrast-pass"
  | "sample-shell";

export type PropertyCatalogEntry = {
  id: string;
  tier: PropertyCatalogTier;
  label: string;
  /** Omitted from list routes when TRIAL_BUILD is true. */
  hiddenInTrialBuild: boolean;
};

/** Ordered registry of seeded deals. Append new entries when adding properties. */
export const PROPERTY_CATALOG: PropertyCatalogEntry[] = [
  {
    id: "7863-niagara-1921",
    tier: "pilot-primary",
    label: "7863 Niagara Ave #1921 (Track)",
    hiddenInTrialBuild: false,
  },
  {
    id: "2200-e-fowler-ave-b12",
    tier: "contrast-pass",
    label: "2200 E Fowler Ave #B12 (Pass)",
    hiddenInTrialBuild: true,
  },
  {
    id: "4821-cypress-hammock-dr-33617",
    tier: "sample-shell",
    label: "4821 Cypress Hammock Dr (sample shell)",
    hiddenInTrialBuild: true,
  },
];

export const TRIAL_HIDDEN_PROPERTY_IDS = new Set(
  PROPERTY_CATALOG.filter((entry) => entry.hiddenInTrialBuild).map(
    (entry) => entry.id
  )
);

/** Full-deal pilot examples (not sample shells) that show end-of-review feedback. */
export const PILOT_FEEDBACK_PROPERTY_IDS = new Set(
  PROPERTY_CATALOG.filter((entry) => entry.tier !== "sample-shell").map(
    (entry) => entry.id
  )
);
