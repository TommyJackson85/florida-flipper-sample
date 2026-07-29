import type { PropertyScreen } from "@/types/property";

export const PROPERTY_TAGS_SESSION_KEY = "flippers.propertyTags.v1";

export const TAG_CAP = 8;

type TagsOverlay = Record<string, string[]>;

function readOverlay(): TagsOverlay {
  if (typeof window === "undefined") return {};
  const raw = window.sessionStorage.getItem(PROPERTY_TAGS_SESSION_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as TagsOverlay;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeOverlay(overlay: TagsOverlay): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(
    PROPERTY_TAGS_SESSION_KEY,
    JSON.stringify(overlay)
  );
}

export function normalizeTag(value: string): string | null {
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed) return null;
  if (trimmed.length > 24) return trimmed.slice(0, 24).trim();
  return trimmed;
}

function dedupeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const tag of tags) {
    const normalized = normalizeTag(tag);
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
    if (result.length >= TAG_CAP) break;
  }
  return result;
}

/** Effective tags: session overlay replaces seed when present for that property id. */
export function getPropertyTags(property: PropertyScreen): string[] {
  const overlay = readOverlay();
  if (Object.prototype.hasOwnProperty.call(overlay, property.id)) {
    return dedupeTags(overlay[property.id] ?? []);
  }
  return dedupeTags(property.tags ?? []);
}

export function setPropertyTagsInSession(
  propertyId: string,
  tags: string[]
): void {
  const overlay = readOverlay();
  overlay[propertyId] = dedupeTags(tags);
  writeOverlay(overlay);
}

export function addPropertyTag(
  property: PropertyScreen,
  rawTag: string
): string[] {
  const nextTag = normalizeTag(rawTag);
  const current = getPropertyTags(property);
  if (!nextTag) return current;
  const next = dedupeTags([...current, nextTag]);
  setPropertyTagsInSession(property.id, next);
  return next;
}

export function removePropertyTag(
  property: PropertyScreen,
  tag: string
): string[] {
  const key = tag.toLowerCase();
  const next = getPropertyTags(property).filter(
    (entry) => entry.toLowerCase() !== key
  );
  setPropertyTagsInSession(property.id, next);
  return next;
}

export function collectUniqueTags(properties: PropertyScreen[]): string[] {
  const tags = properties.flatMap((property) => getPropertyTags(property));
  return dedupeTags(tags).sort((a, b) => a.localeCompare(b));
}
