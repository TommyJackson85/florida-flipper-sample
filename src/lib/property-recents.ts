const RECENT_CAP = 5;

/** One-shot restore after workspace import + reload (not normal persistence). */
export const PENDING_RECENT_IDS_SESSION_KEY =
  "flippers.pendingRecentPropertyIds.v1";

let recentIds: string[] = [];
let hydratedPending = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function normalizeIds(ids: string[]): string[] {
  return ids
    .map((id) => id.trim())
    .filter(Boolean)
    .filter((id, index, all) => all.indexOf(id) === index)
    .slice(0, RECENT_CAP);
}

function hydratePendingRecents(): void {
  if (hydratedPending || typeof window === "undefined") return;
  hydratedPending = true;
  const raw = window.sessionStorage.getItem(PENDING_RECENT_IDS_SESSION_KEY);
  if (!raw) return;
  window.sessionStorage.removeItem(PENDING_RECENT_IDS_SESSION_KEY);
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      recentIds = normalizeIds(
        parsed.filter((id): id is string => typeof id === "string")
      );
    }
  } catch {
    // ignore corrupt pending payload
  }
}

/** Most-recent-first property ids for this JS session only (clears on refresh). */
export function getRecentPropertyIds(): string[] {
  hydratePendingRecents();
  return [...recentIds];
}

export function recordPropertyView(propertyId: string): void {
  hydratePendingRecents();
  const id = propertyId.trim();
  if (!id) return;
  recentIds = [id, ...recentIds.filter((entry) => entry !== id)].slice(
    0,
    RECENT_CAP
  );
  emit();
}

/** Clears the in-memory recently-viewed list for this JS session. */
export function clearRecentPropertyIds(): void {
  hydratePendingRecents();
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(PENDING_RECENT_IDS_SESSION_KEY);
  }
  if (recentIds.length === 0) return;
  recentIds = [];
  emit();
}

/** Replace the in-memory recently-viewed list (most-recent-first). */
export function setRecentPropertyIds(ids: string[]): void {
  hydratePendingRecents();
  recentIds = normalizeIds(ids);
  emit();
}

/**
 * Queue recent ids to restore after the next full page load (import flow).
 * Removed on first read — does not keep recents across ordinary refreshes.
 */
export function queuePendingRecentPropertyIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  const next = normalizeIds(ids);
  if (next.length === 0) {
    window.sessionStorage.removeItem(PENDING_RECENT_IDS_SESSION_KEY);
    return;
  }
  window.sessionStorage.setItem(
    PENDING_RECENT_IDS_SESSION_KEY,
    JSON.stringify(next)
  );
}

export function subscribeRecentPropertyIds(
  listener: () => void
): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const RECENT_PROPERTY_CAP = RECENT_CAP;
