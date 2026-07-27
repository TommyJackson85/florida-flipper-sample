import type { PropertyScreen } from "@/types/property";
import { property7863Niagara1921 } from "./7863-niagara-1921";

/**
 * How to add another property
 * ---------------------------
 * 1. Copy `_template.ts` to `<id>.ts`, or paste a stub from `/intake`.
 * 2. Fill verified facts only. Leave null / "unknown" when unsure.
 * 3. Import below and append to the `properties` array.
 * 4. Keep narrative research in `memos/`, `notes/`, and `sources/`.
 *
 * Example:
 *   import { propertyExample } from "./example-id";
 *   export const properties: PropertyScreen[] = [
 *     property7863Niagara1921,
 *     propertyExample,
 *   ];
 *
 * Do not import `_template.ts` into this array.
 */

export const properties: PropertyScreen[] = [property7863Niagara1921];

export function getPropertyById(id: string): PropertyScreen | undefined {
  return properties.find((property) => property.id === id);
}

export function getAllProperties(): PropertyScreen[] {
  return properties;
}

export { property7863Niagara1921 };
