"use client";

import Link from "next/link";
import type { PropertyScreen } from "@/types/property";
import { formatMoney } from "@/lib/format";
import {
  countMissingDiligenceItems,
  labelForPropertyStage,
  labelForProvisionalStatus,
  summarizeSources,
  toneForPropertyStage,
  toneForProvisionalStatus,
} from "@/lib/property-metrics";
import { StatusPill } from "./StatusPill";

type PropertyListCardProps = {
  property: PropertyScreen;
  archived?: boolean;
  onUnarchive?: (propertyId: string) => void;
};

export function PropertyListCard({
  property,
  archived = false,
  onUnarchive,
}: PropertyListCardProps) {
  const isSample = Boolean(property.isSample);
  const recommendation =
    property.status?.currentRecommendation ??
    labelForProvisionalStatus(property.status?.provisionalStatus);
  const tone = toneForProvisionalStatus(property.status?.provisionalStatus);
  const missingCount = countMissingDiligenceItems(property);
  const sources = summarizeSources(property.sources);
  const showStage = !isSample && Boolean(property.stage);

  return (
    <Link href={`/properties/${property.id}`} className="property-list-card">
      <div className="property-list-card__top">
        <div>
          <h2>{property.address}</h2>
          <p className="property-list-card__meta">
            {property.city}, {property.state} {property.zip}
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {isSample ? <StatusPill label="Sample" tone="warn" /> : null}
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
          </>
        )}
      </div>

      {archived && onUnarchive ? (
        <div
          className="doc-state-actions"
          style={{ marginTop: "0.65rem" }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
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
          <span className="muted-note">
            Return to the active list (this tab only).
          </span>
        </div>
      ) : null}
    </Link>
  );
}
