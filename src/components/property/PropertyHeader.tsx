import type { PropertyScreen } from "@/types/property";
import { formatDate } from "@/lib/format";
import { StatusPill } from "./StatusPill";

type PropertyHeaderProps = {
  property: PropertyScreen;
};

export function PropertyHeader({ property }: PropertyHeaderProps) {
  const isSample = Boolean(property.isSample);

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
        {isSample ? <StatusPill label="Sample" tone="warn" /> : null}
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
