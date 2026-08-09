import Link from "next/link";
import type { PropertyScreen } from "@/types/property";
import { formatMoney } from "@/lib/format";
import {
  labelForProvisionalStatus,
  toneForProvisionalStatus,
} from "@/lib/property-metrics";
import { StatusPill } from "./StatusPill";

type TrialPropertyListProps = {
  properties: PropertyScreen[];
};

type TrialPropertyListCardProps = {
  property: PropertyScreen;
};

function TrialPropertyListCard({ property }: TrialPropertyListCardProps) {
  const recommendation =
    property.status?.currentRecommendation ??
    labelForProvisionalStatus(property.status?.provisionalStatus);
  const tone = toneForProvisionalStatus(property.status?.provisionalStatus);
  const summary = [
    formatMoney(property.pricing?.listingPrice),
    property.unitConfiguration,
    property.yearBuilt != null ? `Built ${property.yearBuilt}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/properties/${property.id}/`}
      className="property-list-card trial-property-card"
      aria-label={`Open ${property.address}, ${recommendation} screening`}
    >
      <div className="property-list-card__top">
        <div>
          <h2 aria-hidden="true">{property.address}</h2>
          <p className="property-list-card__meta" aria-hidden="true">
            {property.city}, {property.state} {property.zip}
          </p>
        </div>
        {/* Visual status only — not a separate control; card is one link. */}
        <span aria-hidden="true">
          <StatusPill label={recommendation} tone={tone} />
        </span>
      </div>

      {property.community ? (
        <p className="property-list-card__community" aria-hidden="true">
          {property.community}
        </p>
      ) : null}

      {summary ? (
        <p className="trial-property-card__summary" aria-hidden="true">
          {summary}
        </p>
      ) : null}

      <p className="trial-property-card__focus" aria-hidden="true">
        Association diligence remains open.
        <span className="trial-property-card__focus-detail">
          Key focus: reserves, SIRS/inspection status, HOA dues, and association
          records.
        </span>
      </p>
    </Link>
  );
}

/**
 * Trial-facing property selection — one calm list, no CRM filters or metrics.
 */
export function TrialPropertyList({ properties }: TrialPropertyListProps) {
  const count = properties.length;
  const countLabel = `${count} propert${count === 1 ? "y" : "ies"}`;

  return (
    <>
      <p className="muted-note" style={{ margin: 0 }}>
        {countLabel}
      </p>
      {count === 0 ? (
        <p className="muted-note">No screened properties yet.</p>
      ) : (
        <section className="property-grid" aria-label="Screened properties">
          {properties.map((property) => (
            <TrialPropertyListCard key={property.id} property={property} />
          ))}
        </section>
      )}
    </>
  );
}
