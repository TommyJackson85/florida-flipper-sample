import type { PropertyScreen } from "@/types/property";
import { formatDate } from "@/lib/format";
import {
  labelForPropertyStage,
  toneForPropertyStage,
} from "@/lib/property-metrics";
import { showDemoDealExtras } from "@/lib/trial-build";
import { ArchivedStatusPill } from "./ArchivedStatusPill";
import { PinnedStatusPill } from "./PinnedStatusPill";
import { StatusPill } from "./StatusPill";

type PropertyHeaderProps = {
  property: PropertyScreen;
};

export function PropertyHeader({ property }: PropertyHeaderProps) {
  const isSample = Boolean(property.isSample);
  const showStage = !isSample && Boolean(property.stage);
  const showSessionPills = showDemoDealExtras();

  return (
    <header className="property-header">
      <p className="property-header__eyebrow">
        {property.county} · {property.propertyType}
        {property.status?.lastReviewedAt
          ? ` · Reviewed ${formatDate(property.status.lastReviewedAt)}`
          : ""}
      </p>
      <div className="property-header__row">
        <div>
          <h1>{property.address}</h1>
          <p className="property-header__community">
            {property.city}, {property.state} {property.zip}
            {property.community ? ` · ${property.community}` : ""}
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {isSample ? <StatusPill label="Example data" tone="warn" /> : null}
          {showSessionPills ? <PinnedStatusPill property={property} /> : null}
          {showSessionPills ? (
            <ArchivedStatusPill property={property} />
          ) : null}
          {showStage ? (
            <StatusPill
              label={labelForPropertyStage(property.stage)}
              tone={toneForPropertyStage(property.stage)}
            />
          ) : null}
        </div>
      </div>
      {isSample && property.sampleNote ? (
        <p className="property-header__purpose">{property.sampleNote}</p>
      ) : null}
      {property.summary?.purpose ? (
        <p className="property-header__purpose">{property.summary.purpose}</p>
      ) : null}
    </header>
  );
}
