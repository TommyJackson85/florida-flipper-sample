import Link from "next/link";
import { notFound } from "next/navigation";
import { AssociationCard } from "@/components/property/AssociationCard";
import { DetailList } from "@/components/property/DetailList";
import { KnownMissingCard } from "@/components/property/KnownMissingCard";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { RecommendationBanner } from "@/components/property/RecommendationBanner";
import { RiskFlagsCard } from "@/components/property/RiskFlagsCard";
import { ScreeningCard } from "@/components/property/ScreeningCard";
import { SectionCard } from "@/components/property/SectionCard";
import { SourcesCard } from "@/components/property/SourcesCard";
import { TaxHistoryCard } from "@/components/property/TaxHistoryCard";
import { getAllProperties, getPropertyById } from "@/data/properties";
import { formatMoney } from "@/lib/format";

type PropertyDetailPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return getAllProperties().map((property) => ({ id: property.id }));
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) {
    notFound();
  }

  const isSample = Boolean(property.isSample);

  return (
    <main className="page-stack">
      <Link href="/properties" className="back-link">
        ← All properties
      </Link>

      <PropertyHeader property={property} />
      <RecommendationBanner property={property} />

      {isSample ? null : <RiskFlagsCard property={property} />}

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
