"use client";

import Link from "next/link";
import type { PropertyScreen, PropertyStage } from "@/types/property";
import { formatDate } from "@/lib/format";
import {
  countMissingDiligenceItems,
  labelForPropertyStage,
  labelForProvisionalStatus,
  milestoneUrgencyLabel,
  nextMilestone,
  toneForProvisionalStatus,
} from "@/lib/property-metrics";
import { isPropertyPinned } from "@/lib/property-pinning";
import { PROPERTY_STAGES } from "@/lib/property-stage";
import { StatusPill } from "./StatusPill";

type PropertyBoardCardProps = {
  property: PropertyScreen;
  archived?: boolean;
  onStageChange: (propertyId: string, stage: PropertyStage | null) => void;
};

export function PropertyBoardCard({
  property,
  archived = false,
  onStageChange,
}: PropertyBoardCardProps) {
  const isSample = Boolean(property.isSample);
  const recommendation =
    property.status?.currentRecommendation ??
    labelForProvisionalStatus(property.status?.provisionalStatus);
  const tone = toneForProvisionalStatus(property.status?.provisionalStatus);
  const missingCount = countMissingDiligenceItems(property);
  const isPinned = isPropertyPinned(property);
  const milestone = isSample ? null : nextMilestone(property.milestones);
  const milestoneUrgency = milestone
    ? milestoneUrgencyLabel(milestone)
    : null;
  const stageValue = property.stage ?? "";

  return (
    <article className="property-board-card">
      <Link href={`/properties/${property.id}`} className="property-board-card__link">
        <h3>{property.address}</h3>
        <p className="property-board-card__meta">
          {property.city}, {property.state} {property.zip}
        </p>
        <div className="property-board-card__pills">
          {isSample ? <StatusPill label="Sample" tone="warn" /> : null}
          {isPinned ? <StatusPill label="Pinned" tone="warn" /> : null}
          {archived ? <StatusPill label="Archived" tone="neutral" /> : null}
          {!isSample ? (
            <StatusPill label={recommendation} tone={tone} />
          ) : (
            <StatusPill label="Practice shell" tone="neutral" />
          )}
          {milestoneUrgency ? (
            <StatusPill
              label={milestoneUrgency}
              tone={milestoneUrgency === "Overdue" ? "bad" : "warn"}
            />
          ) : null}
        </div>
        <p className="muted-note" style={{ marginTop: "0.45rem" }}>
          {isSample
            ? property.sampleNote ?? "Identity shell"
            : `${missingCount} open diligence item${
                missingCount === 1 ? "" : "s"
              }`}
          {milestone
            ? ` · Next: ${milestone.label} · ${formatDate(milestone.date)}`
            : null}
        </p>
      </Link>

      <label className="property-board-card__stage">
        Stage
        <select
          value={stageValue}
          aria-label={`Stage for ${property.address}`}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => {
            const value = event.target.value;
            onStageChange(
              property.id,
              value === "" ? null : (value as PropertyStage)
            );
          }}
        >
          <option value="">Unstaged</option>
          {PROPERTY_STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {labelForPropertyStage(stage)}
            </option>
          ))}
        </select>
      </label>
    </article>
  );
}
