import type { PropertyScreen } from "@/types/property";
import { formatDate } from "@/lib/format";
import {
  countMissingDiligenceItems,
  countOpenRiskFlags,
  deriveClosingReadinessStatus,
  labelForClosingReadiness,
  labelForPropertyStage,
  labelForProvisionalStatus,
  nextMilestone,
} from "@/lib/property-metrics";

function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Concise human-readable deal snapshot for clipboard share (seed-derived). */
export function buildPropertyExportSummary(property: PropertyScreen): string {
  const location = [
    property.address,
    [property.city, property.state, property.zip].filter(Boolean).join(", "),
  ]
    .filter(Boolean)
    .join(" · ");

  if (property.isSample) {
    return [
      location,
      "Status: Practice shell — not underwritten",
      property.sampleNote ? `Note: ${property.sampleNote}` : null,
      "—",
      "Demo identity snapshot from the deal screen (not saved / not a PDF).",
    ]
      .filter(Boolean)
      .join("\n");
  }

  const recommendation =
    property.status?.currentRecommendation ??
    labelForProvisionalStatus(property.status?.provisionalStatus);
  const closingStatus = deriveClosingReadinessStatus(
    property.closingReadiness
  );
  const diligenceCount = countMissingDiligenceItems(property);
  const openRisks = countOpenRiskFlags(property.condoRiskFlags);
  const milestone = nextMilestone(property.milestones);
  const today = todayIsoDate();
  const milestoneOverdue =
    milestone?.status === "upcoming" && milestone.date < today;

  const lines = [
    location,
    property.community ? `Community: ${property.community}` : null,
    property.stage
      ? `Stage: ${labelForPropertyStage(property.stage)}`
      : null,
    `Screen outcome: ${recommendation}`,
    `Closing readiness: ${labelForClosingReadiness(closingStatus)}`,
    `Open diligence items: ${diligenceCount}`,
    property.condoRiskFlags
      ? `Open risk flags: ${openRisks}`
      : null,
    milestone
      ? `Next milestone: ${milestone.label} · ${formatDate(milestone.date)}${
          milestoneOverdue ? " · Overdue" : ""
        }`
      : null,
    property.status?.lastReviewedAt
      ? `Last reviewed: ${formatDate(property.status.lastReviewedAt)}`
      : null,
    "—",
    "Demo seed snapshot from the deal screen (not saved / not a PDF).",
  ];

  return lines.filter((line) => line !== null && line !== undefined).join("\n");
}
