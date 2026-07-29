import Link from "next/link";
import type { PropertyScreen } from "@/types/property";
import { formatMoney } from "@/lib/format";
import { AssociationCard } from "./AssociationCard";
import { ClosingReadinessCard } from "./ClosingReadinessCard";
import { DetailList } from "./DetailList";
import { KnownMissingCard } from "./KnownMissingCard";
import { MilestoneTimelineCard } from "./MilestoneTimelineCard";
import { MissingDocumentsCard } from "./MissingDocumentsCard";
import { PropertyExportSummaryCard } from "./PropertyExportSummaryCard";
import { PropertyHeader } from "./PropertyHeader";
import { PropertyOverviewCard } from "./PropertyOverviewCard";
import { RecommendationBanner } from "./RecommendationBanner";
import { RiskFlagsCard } from "./RiskFlagsCard";
import { ScreeningCard } from "./ScreeningCard";
import { SectionCard } from "./SectionCard";
import { SourcesCard } from "./SourcesCard";
import { TaxHistoryCard } from "./TaxHistoryCard";

type PropertyDealScreenProps = {
  property: PropertyScreen;
  backHref?: string;
  backLabel?: string;
  bannerNote?: string;
};

export function PropertyDealScreen({
  property,
  backHref = "/properties",
  backLabel = "← All properties",
  bannerNote,
}: PropertyDealScreenProps) {
  const isSample = Boolean(property.isSample);

  return (
    <main className="page-stack">
      <Link href={backHref} className="back-link">
        {backLabel}
      </Link>

      {bannerNote ? <p className="muted-note">{bannerNote}</p> : null}

      <PropertyHeader property={property} />
      <PropertyOverviewCard property={property} />
      <PropertyExportSummaryCard property={property} />
      <RecommendationBanner property={property} />
      <MilestoneTimelineCard property={property} />

      {isSample ? null : <RiskFlagsCard property={property} />}
      <ClosingReadinessCard property={property} />
      <MissingDocumentsCard property={property} />

      <SectionCard
        title="Snapshot"
        subtitle={
          isSample ? "Identity fields only for this sample shell." : undefined
        }
      >
        <DetailList
          items={[
            { label: "Community", value: property.community },
            { label: "County", value: property.county },
            { label: "Property type", value: property.propertyType },
            { label: "Configuration", value: property.unitConfiguration },
            { label: "Zoning", value: property.zoning },
            { label: "Year built", value: property.yearBuilt },
            { label: "Heated sq ft", value: property.size?.heatedSqFt },
            { label: "Gross sq ft", value: property.size?.grossSqFt },
            {
              label: "Listing price",
              value: formatMoney(property.pricing?.listingPrice),
            },
            {
              label: "County market value",
              value: formatMoney(property.pricing?.countyMarketValue),
            },
            { label: "MLS ID", value: property.pricing?.mlsId },
            { label: "Folio", value: property.identifiers?.folio },
            { label: "PIN", value: property.identifiers?.pin },
            { label: "Tax account", value: property.identifiers?.taxAccount },
            {
              label: "Subdivision / plat",
              value: property.identifiers?.subdivision
                ? `${property.identifiers.subdivision}${
                    property.identifiers.platBookPage
                      ? ` · Plat ${property.identifiers.platBookPage}`
                      : ""
                  }`
                : null,
            },
            {
              label: "Owner on tax roll",
              value: property.ownership?.ownerOnTaxRoll,
            },
            {
              label: "Ownership interest",
              value: property.ownership?.ownershipInterest,
            },
          ]}
        />
      </SectionCard>

      {isSample ? (
        <SectionCard
          title="Identity shell"
          subtitle="Underwriting panels are hidden while this record is marked as a sample."
        >
          <p className="muted-note">
            Tax history, association, screening checklist, risk-flag board,
            strengths/risks, and sources stay unset for this workflow-practice
            file. Convert to a real screen only after verified public-record and
            association inputs exist — then clear <code>isSample</code>.
          </p>
        </SectionCard>
      ) : null}

      <KnownMissingCard property={property} />

      {isSample ? null : (
        <>
          <ScreeningCard property={property} />

          <div className="split-panel">
            <SectionCard title="Strengths">
              <ul>
                {(property.summary?.strengths ?? []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="Risks">
              <ul>
                {(property.summary?.risks ?? []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </SectionCard>
          </div>

          <TaxHistoryCard property={property} />
          <AssociationCard property={property} />
          <SourcesCard property={property} />
        </>
      )}
    </main>
  );
}
