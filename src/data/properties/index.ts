import type { PropertyScreen } from "@/types/property";
import { property2200EFowlerAveB12 } from "./2200-e-fowler-ave-b12";
import { property4821CypressHammockDr33617 } from "./4821-cypress-hammock-dr-33617";
import { property7863Niagara1921 } from "./7863-niagara-1921";
import { TRIAL_BUILD } from "@/lib/trial-build";

/**
 * Register properties here (file-based only — no DB).
 *
 * Add another property:
 * 1. Create `src/data/properties/<id>.ts` via /intake stub or by copying `_template.ts`.
 * 2. Export a `PropertyScreen` object. Fill verified identity only; leave null/"unknown".
 * 3. Import it below and append to `properties`.
 * 4. Confirm `/properties` lists it and `/properties/<id>` loads.
 *
 * Never import `_template.ts` into this array.
 *
 * Trial build: Niagara is the seeded deal for pilots. Additional properties
 * may stay registered as non-trial fixtures for internal use, but they are
 * omitted from the visible list and route resolution while TRIAL_BUILD is on.
 */

/** Full property registry (includes non-trial fixtures). */
export const properties: PropertyScreen[] = [
  property7863Niagara1921,
  property2200EFowlerAveB12,
  property4821CypressHammockDr33617,
];

/** Non-trial fixtures omitted from list and routes when TRIAL_BUILD is true. */
const TRIAL_HIDDEN_PROPERTY_IDS = new Set([
  "2200-e-fowler-ave-b12",
  "4821-cypress-hammock-dr-33617",
]);

export function getCatalogProperties(): PropertyScreen[] {
  return properties;
}

/** Properties shown in the normal list / pilot flow. */
export function getAllProperties(): PropertyScreen[] {
  if (!TRIAL_BUILD) {
    return properties;
  }
  return properties.filter(
    (property) => !TRIAL_HIDDEN_PROPERTY_IDS.has(property.id)
  );
}

/** Resolve a property for app routes. Non-trial fixtures are unavailable in trial. */
export function getPropertyById(id: string): PropertyScreen | undefined {
  if (TRIAL_BUILD && TRIAL_HIDDEN_PROPERTY_IDS.has(id)) {
    return undefined;
  }
  return properties.find((property) => property.id === id);
}

export {
  property2200EFowlerAveB12,
  property7863Niagara1921,
  property4821CypressHammockDr33617,
};
