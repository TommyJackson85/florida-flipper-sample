import type { PropertyScreen } from "@/types/property";
import { property2200EFowlerAveB12 } from "./2200-e-fowler-ave-b12";
import { property4821CypressHammockDr33617 } from "./4821-cypress-hammock-dr-33617";
import { property7863Niagara1921 } from "./7863-niagara-1921";

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
 */

export const properties: PropertyScreen[] = [
  property7863Niagara1921,
  property2200EFowlerAveB12,
  property4821CypressHammockDr33617,
];

export function getPropertyById(id: string): PropertyScreen | undefined {
  return properties.find((property) => property.id === id);
}

export function getAllProperties(): PropertyScreen[] {
  return properties;
}

export {
  property2200EFowlerAveB12,
  property7863Niagara1921,
  property4821CypressHammockDr33617,
};
