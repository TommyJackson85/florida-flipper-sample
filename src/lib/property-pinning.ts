import type { PropertyScreen } from "@/types/property";

export const PINNED_IDS_SESSION_KEY = "flippers.pinnedPropertyIds.v1";

function readPinnedIds(): string[] {
  if (typeof window === "undefined") return [];
  const raw = window.sessionStorage.getItem(PINNED_IDS_SESSION_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function writePinnedIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(PINNED_IDS_SESSION_KEY, JSON.stringify(ids));
}

export function isPropertyPinned(property: PropertyScreen): boolean {
  return readPinnedIds().includes(property.id);
}

export function isPropertyIdPinned(propertyId: string): boolean {
  return readPinnedIds().includes(propertyId);
}

export function setPropertyPinnedInSession(
  propertyId: string,
  pinned: boolean
): void {
  const current = readPinnedIds().filter((id) => id !== propertyId);
  if (pinned) {
    current.unshift(propertyId);
  }
  writePinnedIds(current);
}

export function countPinnedAmong(properties: PropertyScreen[]): number {
  return properties.filter((property) => isPropertyPinned(property)).length;
}
