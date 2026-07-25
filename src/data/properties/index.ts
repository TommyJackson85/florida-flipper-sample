import type { PropertyScreen } from "@/types/property";
import { property7863Niagara1921 } from "./7863-niagara-1921";

/**
 * How to add another property
 * ---------------------------
 * 1. Create `src/data/properties/<id>.ts` exporting a `PropertyScreen` object.
 *    Use only verified facts. Leave underwriting values as `null` / `"unknown"`.
 * 2. Import it below and append it to the `properties` array.
 * 3. Keep narrative research in `memos/`, `notes/`, and `sources/`.
 *    Point `referencePaths` at those files when useful.
 *
 * Example:
 *   import { propertyExample } from "./example-id";
 *   export const properties: PropertyScreen[] = [
 *     property7863Niagara1921,
 *     propertyExample,
 *   ];
 */

export const properties: PropertyScreen[] = [property7863Niagara1921];

export function getPropertyById(id: string): PropertyScreen | undefined {
  return properties.find((property) => property.id === id);
}

export function getAllProperties(): PropertyScreen[] {
  return properties;
}

export { property7863Niagara1921 };
