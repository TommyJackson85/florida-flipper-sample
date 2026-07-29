"use client";

import Link from "next/link";
import type { PropertyScreen } from "@/types/property";
import { formatDate, formatMoney } from "@/lib/format";
import {
  countMissingDiligenceItems,
  deriveProgressSummary,
  labelForProgressSummary,
  labelForPropertyStage,
  labelForProvisionalStatus,
  milestoneUrgencyLabel,
  nextMilestone,
  summarizeSources,
  toneForProgressSummary,
  toneForPropertyStage,
  toneForProvisionalStatus,
} from "@/lib/property-metrics";
import { getPropertyTags } from "@/lib/property-tags";
import {
  isPropertyPinned,
  setPropertyPinnedInSession,
} from "@/lib/property-pinning";
import { showDemoWorkspaceChrome } from "@/lib/trial-build";
import { StatusPill } from "./StatusPill";

type PropertyListCardProps = {
  property: PropertyScreen;
  archived?: boolean;
  pinned?: boolean;
  selected?: boolean;
  onUnarchive?: (propertyId: string) => void;
  onTogglePin?: (propertyId: string) => void;
  onToggleSelect?: (propertyId: string) => void;
};

export function PropertyListCard({
  property,
  archived = false,
  pinned = false,
  selected = false,
  onUnarchive,
  onTogglePin,
  onToggleSelect,
}: PropertyListCardProps) {
  const isSample = Boolean(property.isSample);
  const recommendation =
    property.status?.currentRecommendation ??
    labelForProvisionalStatus(property.status?.provisionalStatus);
  const tone = toneForProvisionalStatus(property.status?.provisionalStatus);
  const missingCount = countMissingDiligenceItems(property);
  const sources = summarizeSources(property.sources);
  const showStage = !isSample && Boolean(property.stage);
  const chrome = showDemoWorkspaceChrome();
  const tags = chrome ? getPropertyTags(property).slice(0, 3) : [];
  const isPinned = chrome && (pinned || isPropertyPinned(property));
  const milestone = isSample ? null : nextMilestone(property.milestones);
  const milestoneUrgency = milestone
    ? milestoneUrgencyLabel(milestone)
    : null;
  const progress = isSample ? null : deriveProgressSummary(property);

  return (
    <article className="property-list-card">
      {onToggleSelect ? (
        <label
          className="property-list-card__select"
          onClick={(event) => event.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={selected}
            aria-label={`Select ${property.address}`}
            onChange={() => onToggleSelect(property.id)}
          />
          Select
        </label>
      ) : null}

      <Link
        href={`/properties/${property.id}`}
        className="property-list-card__link"
      >
      <div className="property-list-card__top">
        <div>
          <h2>{property.address}</h2>
          <p className="property-list-card__meta">
            {property.city}, {property.state} {property.zip}
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {isSample ? <StatusPill label="Sample" tone="warn" /> : null}
          {isPinned ? <StatusPill label="Pinned" tone="warn" /> : null}
          {archived ? <StatusPill label="Archived" tone="neutral" /> : null}
          {showStage ? (
            <StatusPill
              label={labelForPropertyStage(property.stage)}
              tone={toneForPropertyStage(property.stage)}
            />
          ) : null}
          {!isSample ? (
            <StatusPill label={recommendation} tone={tone} />
          ) : (
            <StatusPill label="Practice shell" tone="neutral" />
          )}
          {tags.map((tag) => (
            <StatusPill key={tag} label={tag} tone="neutral" />
          ))}
          {milestoneUrgency ? (
            <StatusPill
              label={milestoneUrgency}
              tone={milestoneUrgency === "Overdue" ? "bad" : "warn"}
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

      <p className="property-list-card__community">
        {isSample
          ? property.sampleNote ?? "Workflow-practice sample"
          : property.community ?? property.propertyType ?? "Property"}
      </p>

      <dl className="property-list-card__stats">
        <div>
          <dt style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
            List price
          </dt>
          <dd style={{ margin: 0, fontWeight: 600 }}>
            {formatMoney(property.pricing?.listingPrice)}
          </dd>
        </div>
        <div>
          <dt style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
            Year built
          </dt>
          <dd style={{ margin: 0, fontWeight: 600 }}>
            {property.yearBuilt ?? "—"}
          </dd>
        </div>
        <div>
          <dt style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
            Beds / baths
          </dt>
          <dd style={{ margin: 0, fontWeight: 600 }}>
            {property.unitConfiguration ?? "—"}
          </dd>
        </div>
      </dl>

      <div className="property-list-card__footer">
        {isSample ? (
          <span>Identity shell — underwriting fields unset</span>
        ) : (
          <>
            <span>
              {missingCount} open diligence item
              {missingCount === 1 ? "" : "s"}
            </span>
            <span>{sources.completenessLabel}</span>
            {milestone ? (
              <span>
                Next: {milestone.label} · {formatDate(milestone.date)}
              </span>
            ) : null}
          </>
        )}
      </div>

      <div
        className="doc-state-actions"
        style={{ marginTop: "0.65rem" }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        {onTogglePin ? (
          <button
            type="button"
            className={
              isPinned
                ? "doc-state-actions__btn doc-state-actions__btn--active"
                : "doc-state-actions__btn"
            }
            aria-pressed={isPinned}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setPropertyPinnedInSession(property.id, !isPinned);
              onTogglePin(property.id);
            }}
          >
            {isPinned ? "Unpin" : "Pin"}
          </button>
        ) : null}
        {archived && onUnarchive ? (
          <button
            type="button"
            className="doc-state-actions__btn"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onUnarchive(property.id);
            }}
          >
            Unarchive
          </button>
        ) : null}
      </div>
      </Link>
    </article>
  );
}
