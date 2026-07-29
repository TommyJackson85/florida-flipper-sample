import { INTAKE_STUB_SESSION_KEY } from "@/lib/intake-property-stub";
import { ARCHIVED_IDS_SESSION_KEY } from "@/lib/property-archive";
import { PINNED_IDS_SESSION_KEY } from "@/lib/property-pinning";
import {
  getRecentPropertyIds,
  queuePendingRecentPropertyIds,
} from "@/lib/property-recents";
import { PROPERTY_TAGS_SESSION_KEY } from "@/lib/property-tags";

export const WORKSPACE_TRANSFER_KIND = "flippers.workspace-transfer";
export const WORKSPACE_TRANSFER_VERSION = 1;

const SESSION_KEYS = [
  ARCHIVED_IDS_SESSION_KEY,
  PINNED_IDS_SESSION_KEY,
  PROPERTY_TAGS_SESSION_KEY,
  INTAKE_STUB_SESSION_KEY,
] as const;

type ArchiveOverlay = {
  archived: string[];
  unarchived: string[];
};

export type WorkspaceTransferV1 = {
  kind: typeof WORKSPACE_TRANSFER_KIND;
  version: typeof WORKSPACE_TRANSFER_VERSION;
  exportedAt: string;
  overlays: {
    archived: ArchiveOverlay | null;
    pinned: string[] | null;
    tags: Record<string, string[]> | null;
    intakeStub: Record<string, unknown> | null;
  };
  recentIds: string[];
};

function readSessionJson(key: string): unknown | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((entry) => typeof entry === "string")
  );
}

function isArchiveOverlay(value: unknown): value is ArchiveOverlay {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<ArchiveOverlay>;
  return isStringArray(record.archived) && isStringArray(record.unarchived);
}

function isTagsOverlay(value: unknown): value is Record<string, string[]> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.values(value).every(isStringArray);
}

function normalizeArchive(value: unknown): ArchiveOverlay | null {
  if (value === null) return null;
  return isArchiveOverlay(value) ? value : null;
}

function normalizePinned(value: unknown): string[] | null {
  if (value === null) return null;
  return isStringArray(value) ? value : null;
}

function normalizeTags(value: unknown): Record<string, string[]> | null {
  if (value === null) return null;
  return isTagsOverlay(value) ? value : null;
}

function normalizeIntakeStub(
  value: unknown
): Record<string, unknown> | null {
  if (value === null) return null;
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

/** Snapshot this tab’s session overlays + recents for download. */
export function buildWorkspaceTransfer(): WorkspaceTransferV1 {
  return {
    kind: WORKSPACE_TRANSFER_KIND,
    version: WORKSPACE_TRANSFER_VERSION,
    exportedAt: new Date().toISOString(),
    overlays: {
      archived: normalizeArchive(readSessionJson(ARCHIVED_IDS_SESSION_KEY)),
      pinned: normalizePinned(readSessionJson(PINNED_IDS_SESSION_KEY)),
      tags: normalizeTags(readSessionJson(PROPERTY_TAGS_SESSION_KEY)),
      intakeStub: normalizeIntakeStub(
        readSessionJson(INTAKE_STUB_SESSION_KEY)
      ),
    },
    recentIds: getRecentPropertyIds(),
  };
}

export function downloadWorkspaceTransfer(
  payload: WorkspaceTransferV1 = buildWorkspaceTransfer()
): void {
  if (typeof window === "undefined") return;
  const stamp = payload.exportedAt.slice(0, 10);
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `flippers-workspace-${stamp}.json`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export type ParseWorkspaceTransferResult =
  | { ok: true; payload: WorkspaceTransferV1 }
  | { ok: false; error: string };

/** Validate and normalize a workspace transfer JSON document. */
export function parseWorkspaceTransfer(
  raw: unknown
): ParseWorkspaceTransferResult {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: "File is not a workspace JSON object." };
  }

  const doc = raw as Partial<WorkspaceTransferV1>;
  if (doc.kind !== WORKSPACE_TRANSFER_KIND) {
    return {
      ok: false,
      error: "Unsupported file kind — expected a Flippers workspace transfer.",
    };
  }
  if (doc.version !== WORKSPACE_TRANSFER_VERSION) {
    return {
      ok: false,
      error: `Unsupported transfer version (got ${String(doc.version)}, need ${WORKSPACE_TRANSFER_VERSION}).`,
    };
  }
  if (!doc.overlays || typeof doc.overlays !== "object") {
    return { ok: false, error: "Missing overlays object." };
  }

  const overlays = doc.overlays as Partial<WorkspaceTransferV1["overlays"]>;
  const archived =
    overlays.archived === undefined
      ? null
      : normalizeArchive(overlays.archived);
  const pinned =
    overlays.pinned === undefined ? null : normalizePinned(overlays.pinned);
  const tags =
    overlays.tags === undefined ? null : normalizeTags(overlays.tags);
  const intakeStub =
    overlays.intakeStub === undefined
      ? null
      : normalizeIntakeStub(overlays.intakeStub);

  if (overlays.archived != null && archived === null) {
    return { ok: false, error: "Invalid archived overlay shape." };
  }
  if (overlays.pinned != null && pinned === null) {
    return { ok: false, error: "Invalid pinned overlay shape." };
  }
  if (overlays.tags != null && tags === null) {
    return { ok: false, error: "Invalid tags overlay shape." };
  }
  if (overlays.intakeStub != null && intakeStub === null) {
    return { ok: false, error: "Invalid intake stub shape." };
  }

  const recentIds = isStringArray(doc.recentIds) ? doc.recentIds : [];

  return {
    ok: true,
    payload: {
      kind: WORKSPACE_TRANSFER_KIND,
      version: WORKSPACE_TRANSFER_VERSION,
      exportedAt:
        typeof doc.exportedAt === "string"
          ? doc.exportedAt
          : new Date().toISOString(),
      overlays: { archived, pinned, tags, intakeStub },
      recentIds,
    },
  };
}

/**
 * Replace this tab’s session overlays with the transfer payload.
 * Clears overlay keys first (replace, not merge). Caller should reload.
 */
export function applyWorkspaceTransfer(payload: WorkspaceTransferV1): void {
  if (typeof window === "undefined") return;

  for (const key of SESSION_KEYS) {
    window.sessionStorage.removeItem(key);
  }

  const { overlays } = payload;
  if (overlays.archived) {
    window.sessionStorage.setItem(
      ARCHIVED_IDS_SESSION_KEY,
      JSON.stringify(overlays.archived)
    );
  }
  if (overlays.pinned) {
    window.sessionStorage.setItem(
      PINNED_IDS_SESSION_KEY,
      JSON.stringify(overlays.pinned)
    );
  }
  if (overlays.tags) {
    window.sessionStorage.setItem(
      PROPERTY_TAGS_SESSION_KEY,
      JSON.stringify(overlays.tags)
    );
  }
  if (overlays.intakeStub) {
    window.sessionStorage.setItem(
      INTAKE_STUB_SESSION_KEY,
      JSON.stringify(overlays.intakeStub)
    );
  }

  queuePendingRecentPropertyIds(payload.recentIds);
}
