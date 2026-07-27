import type { PropertyScreen } from "@/types/property";
import { property7863Niagara1921 } from "./7863-niagara-1921";

/**
 * Register properties here (file-based only — no DB).
 *
 * Add a second property:
 * 1. Create `src/data/properties/<id>.ts` via /intake stub or by copying `_template.ts`.
 * 2. Export a `PropertyScreen` object. Fill verified identity only; leave null/"unknown".
 * 3. Import it below and append to `properties`.
 * 4. Confirm `/properties` lists it and `/properties/<id>` loads.
 *
 * Example:
 *   import { propertyExample } from "./example-id";
 *   export const properties: PropertyScreen[] = [
 *     property7863Niagara1921,
 *     propertyExample,
 *   ];
 *
 * Never import `_template.ts` into this array.
 */

export const properties: PropertyScreen[] = [property7863Niagara1921];

export function getPropertyById(id: string): PropertyScreen | undefined {
  return properties.find((property) => property.id === id);
}

export function getAllProperties(): PropertyScreen[] {
  return properties;
}

export { property7863Niagara1921 };
