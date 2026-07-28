import type {
  ClosingReadiness,
  ClosingReadinessStatus,
  PropertyScreen,
  ProvisionalStatus,
  SourceEntry,
} from "@/types/property";
import { formatMoney } from "./format";

export type StatusTone = "neutral" | "good" | "warn" | "bad";

export function toneForProvisionalStatus(
  status?: ProvisionalStatus
): StatusTone {
  switch (status) {
    case "buy-candidate":
      return "good";
    case "pass":
      return "bad";
    case "track":
    case "need-more-information":
      return "warn";
    default:
      return "neutral";
  }
}

export function labelForProvisionalStatus(
  status?: ProvisionalStatus
): string {
  switch (status) {
    case "buy-candidate":
      return "Buy candidate";
    case "track":
      return "Track";
    case "pass":
      return "Pass";
    case "need-more-information":
      return "Need more information";
    default:
      return "Unknown";
  }
}

/**
 * Derive closing readiness from checklist item states.
 * Never returns "ready" unless every item is done (and there is at least one item).
 */
export function deriveClosingReadinessStatus(
  readiness?: ClosingReadiness
): ClosingReadinessStatus {
  const items = readiness?.items ?? [];
  if (items.length === 0) return "not-ready";
  if (items.some((item) => item.state === "blocked")) return "not-ready";
  if (items.some((item) => item.state === "open")) return "in-progress";
  if (items.every((item) => item.state === "done")) return "ready";
  return "not-ready";
}

export function toneForClosingReadiness(
  status: ClosingReadinessStatus
): StatusTone {
  switch (status) {
    case "ready":
      return "good";
    case "in-progress":
      return "warn";
    case "not-ready":
    default:
      return "bad";
  }
}

export function labelForClosingReadiness(
  status: ClosingReadinessStatus
): string {
  switch (status) {
    case "ready":
      return "Ready";
    case "in-progress":
      return "In progress";
    case "not-ready":
    default:
      return "Not ready";
  }
}

export function countMissingDiligenceItems(
  property: PropertyScreen
): number {
  return (property.missingDiligence ?? []).reduce(
    (total, group) => total + group.items.length,
    0
  );
}

export function summarizeSources(sources: SourceEntry[] = []): {
  total: number;
  filled: number;
  missing: number;
  notes: number;
  completenessLabel: string;
} {
  const total = sources.length;
  const filled = sources.filter((s) => s.status === "filled").length;
  const missing = sources.filter((s) => s.status === "missing").length;
  const notes = sources.filter((s) => s.status === "note").length;

  if (total === 0) {
    return {
      total,
      filled,
      missing,
      notes,
      completenessLabel: "No sources listed",
    };
  }

  return {
    total,
    filled,
    missing,
    notes,
    completenessLabel: `${filled} of ${total} sources linked`,
  };
}

export function summarizeTaxTrend(property: PropertyScreen): string | null {
  const history = [...(property.taxes?.annualHistory ?? [])].sort(
    (a, b) => a.year - b.year
  );
  if (history.length < 2) return null;

  const oldest = history[0];
  const newest = history[history.length - 1];
  const delta = newest.amount - oldest.amount;
  const pct = oldest.amount === 0 ? null : (delta / oldest.amount) * 100;
  const direction = delta > 0 ? "up" : delta < 0 ? "down" : "flat";

  const moneyDelta = formatMoney(Math.abs(delta), {
    maximumFractionDigits: 2,
  });
  const pctLabel =
    pct === null
      ? ""
      : ` (${pct > 0 ? "+" : ""}${pct.toFixed(0)}%)`;

  if (direction === "flat") {
    return `Annual tax bill essentially unchanged from ${oldest.year} to ${newest.year}.`;
  }

  return `Annual tax bill ${direction} ${moneyDelta}${pctLabel} from ${oldest.year} (${formatMoney(oldest.amount, { maximumFractionDigits: 2 })}) to ${newest.year} (${formatMoney(newest.amount, { maximumFractionDigits: 2 })}).`;
}
