import type { PropertyScreen } from "@/types/property";
import {
  labelForProvisionalStatus,
  toneForProvisionalStatus,
} from "@/lib/property-metrics";
import { formatDate } from "@/lib/format";
import { StatusPill } from "./StatusPill";

type PropertyHeaderProps = {
  property: PropertyScreen;
};

export function PropertyHeader({ property }: PropertyHeaderProps) {
  const recommendation =
    property.status?.currentRecommendation ??
    labelForProvisionalStatus(property.status?.provisionalStatus);
  const tone = toneForProvisionalStatus(property.status?.provisionalStatus);

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
        <StatusPill label={recommendation} tone={tone} />
      </div>
      {property.summary?.purpose ? (
        <p className="property-header__purpose">{property.summary.purpose}</p>
      ) : null}
    </header>
  );
}
