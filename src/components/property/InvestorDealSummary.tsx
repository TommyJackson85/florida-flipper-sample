import type { PropertyScreen } from "@/types/property";
import { formatMoney } from "@/lib/format";
import { countOpenRiskFlags } from "@/lib/property-metrics";
import { SectionCard } from "./SectionCard";
import { StatusPill } from "./StatusPill";

type InvestorDealSummaryProps = {
  property: PropertyScreen;
};

const SCREENING_PILL = "Hold — association diligence required";

const PRIMARY_BLOCKERS = [
  "Budget, reserves, and SIRS status are unverified",
  "Milestone or structural inspection status is an open item",
  "Special assessments and capital projects are unconfirmed",
  "Master insurance posture is unknown",
  "HOA dues are unverified — listing sources conflict",
] as const;

function countMissingAssociationDocuments(property: PropertyScreen): number {
  return (property.missingDocuments?.items ?? []).filter(
    (item) => item.state === "missing"
  ).length;
}

function hoaDuesSummary(property: PropertyScreen): string {
  return (
    property.association?.hoaReportedNotes?.replace(
      /^Unverified listing figures conflict:\s*/i,
      "Unverified — listing sources show "
    ) ?? "Unverified — listing sources conflict."
  );
}

/**
 * Investor-first summary: screening status, key metrics, and primary blockers.
 */
export function InvestorDealSummary({ property }: InvestorDealSummaryProps) {
  const openRisks = countOpenRiskFlags(property.condoRiskFlags);
  const missingDocs = countMissingAssociationDocuments(property);
  const annualTax =
    property.taxes?.mostRecentPaymentAmount ??
    [...(property.taxes?.annualHistory ?? [])].sort((a, b) => b.year - a.year)[0]
      ?.amount;

  const cityStateZip = `${property.city}, ${property.state} ${property.zip}`;

  return (
    <section className="investor-summary" aria-label="Investor deal summary">
      <header className="investor-summary__header">
        <p className="investor-summary__eyebrow">Florida Condo Screening</p>
        <p className="investor-summary__status-label">
          Preliminary screening status
        </p>
        <div className="investor-summary__title-row">
          <h1 className="investor-summary__address">
            {property.address}, {cityStateZip}
          </h1>
          <StatusPill label={SCREENING_PILL} tone="warn" />
        </div>
        <p className="investor-summary__explanation">
          Association financial, structural, insurance, and assessment records
          remain unverified, so deal numbers are not ready for underwriting.
        </p>
        <p className="investor-summary__disclaimer muted-note">
          Preliminary public-record screen only. This is not legal, engineering,
          insurance, or investment advice.
        </p>
      </header>

      <SectionCard title="Key deal metrics">
        <dl className="investor-metrics">
          <div className="investor-metric">
            <dt className="investor-metric__term trial-status-row">
              <span className="investor-metric__label trial-status-row__title">
                Asking price
              </span>
              <StatusPill label="From listing" tone="good" />
            </dt>
            <dd className="investor-metric__value">
              {formatMoney(property.pricing?.listingPrice)}
            </dd>
          </div>

          <div className="investor-metric">
            <dt className="investor-metric__term trial-status-row">
              <span className="investor-metric__label trial-status-row__title">
                HOA dues
              </span>
              <StatusPill label="Unverified" tone="warn" />
            </dt>
            <dd className="investor-metric__value">{hoaDuesSummary(property)}</dd>
          </div>

          <div className="investor-metric">
            <dt className="investor-metric__term trial-status-row">
              <span className="investor-metric__label trial-status-row__title">
                Annual property tax
              </span>
              <StatusPill label="From county record" tone="good" />
            </dt>
            <dd className="investor-metric__value">
              {formatMoney(annualTax, { maximumFractionDigits: 2 })}
            </dd>
          </div>

          <div className="investor-metric">
            <dt className="investor-metric__term trial-status-row">
              <span className="investor-metric__label trial-status-row__title">
                Open risk flags
              </span>
              <StatusPill label="Open item" tone="warn" />
            </dt>
            <dd className="investor-metric__value">{openRisks}</dd>
          </div>

          <div className="investor-metric">
            <dt className="investor-metric__term trial-status-row">
              <span className="investor-metric__label trial-status-row__title">
                Missing association documents
              </span>
              <StatusPill label="Missing" tone="bad" />
            </dt>
            <dd className="investor-metric__value">{missingDocs}</dd>
          </div>
        </dl>
      </SectionCard>

      <SectionCard
        title="Primary deal blockers"
        subtitle="Deal blockers are association gaps that prevent reliable underwriting right now — not a final property judgment."
      >
        <ol className="investor-blockers">
          {PRIMARY_BLOCKERS.map((blocker) => (
            <li key={blocker} className="investor-blocker">
              {blocker}
            </li>
          ))}
        </ol>
      </SectionCard>
    </section>
  );
}
