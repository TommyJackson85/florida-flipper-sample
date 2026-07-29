import { INTAKE_STUB_SESSION_KEY } from "@/lib/intake-property-stub";
import { ARCHIVED_IDS_SESSION_KEY } from "@/lib/property-archive";
import { PINNED_IDS_SESSION_KEY } from "@/lib/property-pinning";
import { clearRecentPropertyIds } from "@/lib/property-recents";
import { PROPERTY_TAGS_SESSION_KEY } from "@/lib/property-tags";

const DEMO_SESSION_KEYS = [
  ARCHIVED_IDS_SESSION_KEY,
  PINNED_IDS_SESSION_KEY,
  PROPERTY_TAGS_SESSION_KEY,
  INTAKE_STUB_SESSION_KEY,
] as const;

/**
 * Clears this-tab demo overlays and in-memory recents.
 * Caller should reload so React UI state returns to seed.
 */
export function resetDemoData(): void {
  if (typeof window === "undefined") return;

  for (const key of DEMO_SESSION_KEYS) {
    window.sessionStorage.removeItem(key);
  }
  clearRecentPropertyIds();
}
