import type { PropertyScreen } from "@/types/property";

export const ARCHIVED_IDS_SESSION_KEY = "flippers.archivedPropertyIds.v1";

type ArchiveOverlay = {
  archived: string[];
  unarchived: string[];
};

function emptyOverlay(): ArchiveOverlay {
  return { archived: [], unarchived: [] };
}

function readOverlay(): ArchiveOverlay {
  if (typeof window === "undefined") return emptyOverlay();
  const raw = window.sessionStorage.getItem(ARCHIVED_IDS_SESSION_KEY);
  if (!raw) return emptyOverlay();
  try {
    const parsed = JSON.parse(raw) as Partial<ArchiveOverlay>;
    return {
      archived: Array.isArray(parsed.archived) ? parsed.archived : [],
      unarchived: Array.isArray(parsed.unarchived) ? parsed.unarchived : [],
    };
  } catch {
    return emptyOverlay();
  }
}

function writeOverlay(overlay: ArchiveOverlay): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(
    ARCHIVED_IDS_SESSION_KEY,
    JSON.stringify(overlay)
  );
}

/** Effective archived state: session overlay overrides seed `archived`. */
export function isPropertyArchived(property: PropertyScreen): boolean {
  const overlay = readOverlay();
  if (overlay.unarchived.includes(property.id)) return false;
  if (overlay.archived.includes(property.id)) return true;
  return Boolean(property.archived);
}

export function setPropertyArchivedInSession(
  propertyId: string,
  archived: boolean
): void {
  const overlay = readOverlay();
  const next: ArchiveOverlay = {
    archived: overlay.archived.filter((id) => id !== propertyId),
    unarchived: overlay.unarchived.filter((id) => id !== propertyId),
  };
  if (archived) {
    next.archived.push(propertyId);
  } else {
    next.unarchived.push(propertyId);
  }
  writeOverlay(next);
}
