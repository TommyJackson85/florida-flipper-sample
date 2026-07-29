import type { PropertyScreen } from "@/types/property";
import { formatDate } from "@/lib/format";
import {
  deriveClosingReadinessStatus,
  deriveProgressSummary,
  labelForClosingReadiness,
  labelForProgressSummary,
  labelForPropertyStage,
  milestoneUrgencyLabel,
  nextMilestone,
  toneForClosingReadiness,
  toneForProgressSummary,
  toneForPropertyStage,
} from "@/lib/property-metrics";
import { ArchivedStatusPill } from "./ArchivedStatusPill";
import { DetailList } from "./DetailList";
import { SectionCard } from "./SectionCard";
import { StatusPill } from "./StatusPill";

type PropertyClientStatusViewProps = {
  property: PropertyScreen;
};

type DocsRollup = "complete" | "partial" | "missing";

function deriveDocsRollup(
  property: PropertyScreen
): { status: DocsRollup; summary: string } | null {
  const items = property.missingDocuments?.items ?? [];
  if (items.length === 0) return null;

  const missing = items.filter((item) => item.state === "missing").length;
  const requested = items.filter((item) => item.state === "requested").length;
  const received = items.filter((item) => item.state === "received").length;
  const summary = `${missing} missing · ${requested} requested · ${received} received`;

  if (items.every((item) => item.state === "received")) {
    return { status: "complete", summary };
  }
  if (items.every((item) => item.state === "missing")) {
    return { status: "missing", summary };
  }
  return { status: "partial", summary };
}

function docsLabel(status: DocsRollup): string {
  switch (status) {
    case "complete":
      return "Complete";
    case "partial":
      return "Partial";
    case "missing":
    default:
      return "Missing";
  }
}

function docsTone(status: DocsRollup): "good" | "warn" | "bad" {
  switch (status) {
    case "complete":
      return "good";
    case "partial":
      return "warn";
    case "missing":
    default:
      return "bad";
  }
}

export function PropertyClientStatusView({
  property,
}: PropertyClientStatusViewProps) {
  const isSample = Boolean(property.isSample);
  const progress = isSample ? null : deriveProgressSummary(property);
  const closingStatus = isSample
    ? null
    : property.closingReadiness?.items?.length
      ? deriveClosingReadinessStatus(property.closingReadiness)
      : null;
  const milestone = isSample ? null : nextMilestone(property.milestones);
  const milestoneUrgency = milestone
    ? milestoneUrgencyLabel(milestone)
    : null;
  const docs = isSample ? null : deriveDocsRollup(property);

  return (
    <div className="page-stack" style={{ gap: "1rem" }}>
      <p className="muted-note">
        Demo client status preview — curated fields only. Not a live share link.
      </p>

      <header className="property-header">
        <p className="property-header__eyebrow">Deal status</p>
        <div className="property-header__row">
          <div>
            <h1>{property.address}</h1>
            <p className="property-header__community">
              {property.city}, {property.state} {property.zip}
              {property.community ? ` · ${property.community}` : ""}
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {isSample ? <StatusPill label="Sample" tone="warn" /> : null}
            <ArchivedStatusPill property={property} />
            {!isSample && property.stage ? (
              <StatusPill
                label={labelForPropertyStage(property.stage)}
                tone={toneForPropertyStage(property.stage)}
              />
            ) : null}
            {progress ? (
              <StatusPill
                label={`Progress: ${labelForProgressSummary(progress.status)}`}
                tone={toneForProgressSummary(progress.status)}
              />
            ) : null}
          </div>
        </div>
      </header>

      {isSample ? (
        <SectionCard
          title="Status"
          subtitle="Client-facing demo preview — curated fields only."
        >
          <p className="muted-note">
            Practice shell — identity only; underwriting status is not set for
            client preview.
          </p>
        </SectionCard>
      ) : (
        <SectionCard
          title="Status"
          subtitle="Client-facing demo preview — curated fields only."
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: "0.75rem",
            }}
          >
            {closingStatus ? (
              <StatusPill
                label={`Closing: ${labelForClosingReadiness(closingStatus)}`}
                tone={toneForClosingReadiness(closingStatus)}
              />
            ) : null}
            {docs ? (
              <StatusPill
                label={`Documents: ${docsLabel(docs.status)}`}
                tone={docsTone(docs.status)}
              />
            ) : null}
            {milestoneUrgency ? (
              <StatusPill
                label={milestoneUrgency}
                tone={milestoneUrgency === "Overdue" ? "bad" : "warn"}
              />
            ) : null}
          </div>
          <DetailList
            items={[
              {
                label: "Stage",
                value: property.stage
                  ? labelForPropertyStage(property.stage)
                  : "Not set on this screen",
              },
              {
                label: "Progress",
                value: progress
                  ? `${labelForProgressSummary(progress.status)} · ${progress.reason}`
                  : "Not set on this screen",
              },
              {
                label: "Next date",
                value: milestone
                  ? `${milestone.label} · ${formatDate(milestone.date)}${
                      milestoneUrgency ? ` · ${milestoneUrgency}` : ""
                    }`
                  : "Not set on this screen",
              },
              {
                label: "Closing",
                value: closingStatus
                  ? labelForClosingReadiness(closingStatus)
                  : "Not set on this screen",
              },
              {
                label: "Documents",
                value: docs ? docs.summary : "Not set on this screen",
              },
            ]}
          />
        </SectionCard>
      )}
    </div>
  );
}
