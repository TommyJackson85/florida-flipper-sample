import { getCatalogProperties } from "@/data/properties";
import { INTAKE_STUB_SESSION_KEY } from "@/lib/intake-property-stub";
import { ARCHIVED_IDS_SESSION_KEY } from "@/lib/property-archive";
import { PINNED_IDS_SESSION_KEY } from "@/lib/property-pinning";
import { getRecentPropertyIds } from "@/lib/property-recents";
import { PROPERTY_STAGES } from "@/lib/property-stage";
import { PROPERTY_TAGS_SESSION_KEY } from "@/lib/property-tags";
import type { PropertyScreen, PropertyStage } from "@/types/property";
import type { WorkspaceTransferV1 } from "@/lib/workspace-transfer";

export type DiagnosticIssue = {
  code: string;
  message: string;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const CONDO_RISK_KEYS = [
  "milestoneInspection",
  "sirsReserves",
  "specialAssessments",
  "hoaDues",
  "insurance",
  "litigationOrRecords",
] as const;

const STAGE_SET = new Set<string>(PROPERTY_STAGES);

type OverlaySnapshot = {
  archived: string[];
  unarchived: string[];
  pinned: string[];
  tagKeys: string[];
  recentIds: string[];
  intakeStub: Record<string, unknown> | null;
};

function pushIssue(
  issues: DiagnosticIssue[],
  code: string,
  message: string
): void {
  issues.push({ code, message });
}

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

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : [];
}

function readLiveOverlays(): OverlaySnapshot {
  const archiveRaw = readSessionJson(ARCHIVED_IDS_SESSION_KEY);
  const archive =
    archiveRaw && typeof archiveRaw === "object" && !Array.isArray(archiveRaw)
      ? (archiveRaw as { archived?: unknown; unarchived?: unknown })
      : null;

  const tagsRaw = readSessionJson(PROPERTY_TAGS_SESSION_KEY);
  const tagKeys =
    tagsRaw && typeof tagsRaw === "object" && !Array.isArray(tagsRaw)
      ? Object.keys(tagsRaw)
      : [];

  const intakeRaw = readSessionJson(INTAKE_STUB_SESSION_KEY);
  const intakeStub =
    intakeRaw && typeof intakeRaw === "object" && !Array.isArray(intakeRaw)
      ? (intakeRaw as Record<string, unknown>)
      : null;

  return {
    archived: asStringArray(archive?.archived),
    unarchived: asStringArray(archive?.unarchived),
    pinned: asStringArray(readSessionJson(PINNED_IDS_SESSION_KEY)),
    tagKeys,
    recentIds: getRecentPropertyIds(),
    intakeStub,
  };
}

function overlaysFromTransfer(payload: WorkspaceTransferV1): OverlaySnapshot {
  return {
    archived: payload.overlays.archived?.archived ?? [],
    unarchived: payload.overlays.archived?.unarchived ?? [],
    pinned: payload.overlays.pinned ?? [],
    tagKeys: payload.overlays.tags ? Object.keys(payload.overlays.tags) : [],
    recentIds: payload.recentIds,
    intakeStub: payload.overlays.intakeStub,
  };
}

function knownIdSet(
  catalog: PropertyScreen[],
  intakeStub: Record<string, unknown> | null
): Set<string> {
  const ids = new Set(catalog.map((property) => property.id));
  const stubId = intakeStub?.id;
  if (typeof stubId === "string" && stubId.trim()) {
    ids.add(stubId.trim());
  }
  return ids;
}

function checkOrphans(
  issues: DiagnosticIssue[],
  knownIds: Set<string>,
  overlays: OverlaySnapshot
): void {
  const groups: { label: string; ids: string[] }[] = [
    { label: "Pinned", ids: overlays.pinned },
    { label: "Archived overlay", ids: overlays.archived },
    { label: "Unarchived overlay", ids: overlays.unarchived },
    { label: "Tags overlay", ids: overlays.tagKeys },
    { label: "Recently viewed", ids: overlays.recentIds },
  ];

  for (const group of groups) {
    for (const id of group.ids) {
      if (!knownIds.has(id)) {
        pushIssue(
          issues,
          "orphan-id",
          `${group.label} id “${id}” is not in the property catalog${
            overlays.intakeStub ? " or intake stub" : ""
          }.`
        );
      }
    }
  }
}

function checkDuplicateCatalogIds(
  issues: DiagnosticIssue[],
  catalog: PropertyScreen[]
): void {
  const seen = new Set<string>();
  for (const property of catalog) {
    if (seen.has(property.id)) {
      pushIssue(
        issues,
        "duplicate-id",
        `Duplicate catalog id “${property.id}”.`
      );
    }
    seen.add(property.id);
  }
}

function checkIntakeStubIdentity(
  issues: DiagnosticIssue[],
  intakeStub: Record<string, unknown> | null
): void {
  if (!intakeStub) return;

  const required = ["id", "address", "city", "state", "zip"] as const;
  for (const field of required) {
    const value = intakeStub[field];
    if (typeof value !== "string" || !value.trim()) {
      pushIssue(
        issues,
        "intake-identity",
        `Intake stub is missing a usable “${field}” field.`
      );
    }
  }

  const stubId = intakeStub.id;
  if (typeof stubId === "string" && stubId.trim()) {
    const collision = getCatalogProperties().some(
      (property) => property.id === stubId.trim()
    );
    if (collision) {
      pushIssue(
        issues,
        "intake-collision",
        `Intake stub id “${stubId.trim()}” collides with a seed catalog property.`
      );
    }
  }
}

function isValidStage(value: unknown): value is PropertyStage {
  return typeof value === "string" && STAGE_SET.has(value);
}

function checkStage(
  issues: DiagnosticIssue[],
  label: string,
  stage: unknown
): void {
  if (stage === undefined || stage === null) return;
  if (!isValidStage(stage)) {
    pushIssue(
      issues,
      "invalid-stage",
      `${label} has an invalid stage “${String(stage)}”.`
    );
  }
}

function checkNestedLists(
  issues: DiagnosticIssue[],
  label: string,
  property: Record<string, unknown>
): void {
  const parents: { key: string; nested: boolean }[] = [
    { key: "milestones", nested: false },
    { key: "missingDocuments", nested: true },
    { key: "closingReadiness", nested: true },
    { key: "postCloseItems", nested: true },
  ];

  for (const parent of parents) {
    const value = property[parent.key];
    if (value === undefined || value === null) continue;
    if (parent.nested) {
      if (typeof value !== "object" || Array.isArray(value)) {
        pushIssue(
          issues,
          "nested-list",
          `${label} “${parent.key}” should be an object with an items array.`
        );
        continue;
      }
      const items = (value as { items?: unknown }).items;
      if (!Array.isArray(items)) {
        pushIssue(
          issues,
          "nested-list",
          `${label} “${parent.key}.items” is missing or not an array.`
        );
      }
    } else if (!Array.isArray(value)) {
      pushIssue(
        issues,
        "nested-list",
        `${label} “${parent.key}” should be an array.`
      );
    }
  }
}

function checkDates(
  issues: DiagnosticIssue[],
  label: string,
  property: Record<string, unknown>
): void {
  const milestones = property.milestones;
  if (Array.isArray(milestones)) {
    for (const entry of milestones) {
      if (!entry || typeof entry !== "object") continue;
      const date = (entry as { date?: unknown }).date;
      if (typeof date === "string" && !ISO_DATE.test(date)) {
        pushIssue(
          issues,
          "bad-date",
          `${label} milestone date “${date}” is not YYYY-MM-DD.`
        );
      }
    }
  }

  const missingDocuments = property.missingDocuments;
  if (
    missingDocuments &&
    typeof missingDocuments === "object" &&
    !Array.isArray(missingDocuments)
  ) {
    const items = (missingDocuments as { items?: unknown }).items;
    if (Array.isArray(items)) {
      for (const entry of items) {
        if (!entry || typeof entry !== "object") continue;
        const dueDate = (entry as { dueDate?: unknown }).dueDate;
        if (dueDate === undefined || dueDate === null) continue;
        if (typeof dueDate === "string" && !ISO_DATE.test(dueDate)) {
          pushIssue(
            issues,
            "bad-date",
            `${label} document dueDate “${dueDate}” is not YYYY-MM-DD.`
          );
        } else if (typeof dueDate !== "string") {
          pushIssue(
            issues,
            "bad-date",
            `${label} has a non-string document dueDate.`
          );
        }
      }
    }
  }
}

function checkCondoRiskFlags(
  issues: DiagnosticIssue[],
  label: string,
  property: Record<string, unknown>
): void {
  const flags = property.condoRiskFlags;
  if (flags === undefined || flags === null) return;
  if (typeof flags !== "object" || Array.isArray(flags)) {
    pushIssue(
      issues,
      "risk-flags",
      `${label} condoRiskFlags should be an object.`
    );
    return;
  }

  const record = flags as Record<string, unknown>;
  for (const key of CONDO_RISK_KEYS) {
    const flag = record[key];
    if (!flag || typeof flag !== "object" || Array.isArray(flag)) {
      pushIssue(
        issues,
        "risk-flags",
        `${label} condoRiskFlags is missing a usable “${key}” entry.`
      );
      continue;
    }
    const status = (flag as { status?: unknown }).status;
    if (
      status !== "unknown" &&
      status !== "open" &&
      status !== "clear"
    ) {
      pushIssue(
        issues,
        "risk-flags",
        `${label} condoRiskFlags.${key} has an invalid status.`
      );
    }
  }
}

function diagnosePropertyRecord(
  issues: DiagnosticIssue[],
  label: string,
  property: Record<string, unknown>
): void {
  checkStage(issues, label, property.stage);
  checkNestedLists(issues, label, property);
  checkDates(issues, label, property);
  checkCondoRiskFlags(issues, label, property);
}

function diagnoseOverlaysAndCatalog(
  overlays: OverlaySnapshot
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  const catalog = getCatalogProperties();
  const knownIds = knownIdSet(catalog, overlays.intakeStub);

  checkDuplicateCatalogIds(issues, catalog);
  checkOrphans(issues, knownIds, overlays);
  checkIntakeStubIdentity(issues, overlays.intakeStub);

  for (const property of catalog) {
    diagnosePropertyRecord(
      issues,
      `Catalog property “${property.id}”`,
      property as unknown as Record<string, unknown>
    );
  }

  if (overlays.intakeStub) {
    diagnosePropertyRecord(issues, "Intake stub", overlays.intakeStub);
  }

  return issues;
}

/** Read-only checks over seed catalog + this tab’s session overlays. */
export function diagnoseWorkspace(): DiagnosticIssue[] {
  return diagnoseOverlaysAndCatalog(readLiveOverlays());
}

/** Read-only checks for a parsed transfer against the current catalog. */
export function diagnoseTransfer(
  payload: WorkspaceTransferV1
): DiagnosticIssue[] {
  return diagnoseOverlaysAndCatalog(overlaysFromTransfer(payload));
}

export function formatDiagnosticSummary(issues: DiagnosticIssue[]): string {
  if (issues.length === 0) return "No issues found.";
  const preview = issues
    .slice(0, 5)
    .map((issue) => `• ${issue.message}`)
    .join("\n");
  const more =
    issues.length > 5 ? `\n…and ${issues.length - 5} more.` : "";
  return `${issues.length} issue${issues.length === 1 ? "" : "s"} found:\n${preview}${more}`;
}
