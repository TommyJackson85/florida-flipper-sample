const RECENT_CAP = 5;

let recentIds: string[] = [];
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

/** Most-recent-first property ids for this JS session only (clears on refresh). */
export function getRecentPropertyIds(): string[] {
  return [...recentIds];
}

export function recordPropertyView(propertyId: string): void {
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
  if (recentIds.length === 0) return;
  recentIds = [];
  emit();
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
