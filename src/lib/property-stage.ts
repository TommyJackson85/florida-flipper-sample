import type { PropertyScreen, PropertyStage } from "@/types/property";

export const PROPERTY_STAGES: PropertyStage[] = [
  "lead",
  "screening",
  "diligence",
  "under-contract",
  "closing",
  "post-close",
];

/** null clears stage for the demo board (Unstaged column). */
export type StageOverrideValue = PropertyStage | null;

export type StageOverrides = Record<string, StageOverrideValue>;

export function getEffectiveStage(
  property: PropertyScreen,
  overrides: StageOverrides
): PropertyStage | undefined {
  if (Object.prototype.hasOwnProperty.call(overrides, property.id)) {
    const value = overrides[property.id];
    return value === null ? undefined : value;
  }
  return property.stage;
}

export function withEffectiveStage(
  property: PropertyScreen,
  overrides: StageOverrides
): PropertyScreen {
  const stage = getEffectiveStage(property, overrides);
  if (stage === property.stage) return property;
  return { ...property, stage };
}
