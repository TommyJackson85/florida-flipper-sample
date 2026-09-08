import type { PropertyScreen } from "@/types/property";
import { formatMoney } from "@/lib/format";
import { countOpenRiskFlags } from "@/lib/property-metrics";
import { SectionCard } from "./SectionCard";
import { StatusPill } from "./StatusPill";

type InvestorDealSummaryProps = {
  property: PropertyScreen;
};

const SCREENING_PILL = "Hold — association diligence required";

/** Real-deal priority gates — lead with Reserves / SIRS / inspection. */
const PRIMARY_BLOCKERS = [
  {
    item: "Reserves / SIRS status",
    status: "Unverified",
    tone: "bad" as const,
    note: "Approved budget, reserve schedule, and SIRS status not in hand.",
  },
  {
    item: "Milestone / structural inspection",
    status: "Open item",
    tone: "bad" as const,
    note: "No building/phase inspection report obtained yet.",
  },
  {
    item: "Special assessments / capital projects",
    status: "Unconfirmed",
    tone: "warn" as const,
    note: "Current or recent assessments not confirmed with association records.",
  },
  {
    item: "Master insurance posture",
    status: "Unknown",
    tone: "neutral" as const,
    note: "Association and unit insurance not researched on this screen.",
  },
  {
    item: "HOA dues",
    status: "Unverified",
    tone: "warn" as const,
    note: "Listing sources conflict (~$376 vs ~$499/month).",
  },
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
 * Investor-first summary: screening status, spreadsheet-style metrics,
 * and primary blockers led by Reserves / SIRS / inspection.
 */
export function InvestorDealSummary({ property }: InvestorDealSummaryProps) {
  const openRisks = countOpenRiskFlags(property.condoRiskFlags);
  const missingDocs = countMissingAssociationDocuments(property);
  const annualTax =
    property.taxes?.mostRecentPaymentAmount ??
    [...(property.taxes?.annualHistory ?? [])].sort((a, b) => b.year - a.year)[0]
      ?.amount;

  const cityStateZip = `${property.city}, ${property.state} ${property.zip}`;

  const metricRows = [
    {
      item: "Asking price",
      status: "From listing",
      tone: "good" as const,
      value: formatMoney(property.pricing?.listingPrice),
    },
    {
      item: "Annual property tax",
      status: "From county record",
      tone: "good" as const,
      value: formatMoney(annualTax, { maximumFractionDigits: 2 }),
    },
    {
      item: "HOA dues",
      status: "Unverified",
      tone: "warn" as const,
      value: hoaDuesSummary(property),
    },
    {
      item: "Open risk flags",
      status: "Open item",
      tone: "warn" as const,
      value: String(openRisks),
    },
    {
      item: "Missing association documents",
      status: "Missing",
      tone: "bad" as const,
      value: String(missingDocs),
    },
  ];

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
          On a real deal, start with reserves, SIRS, and inspection status.
        </p>
        <p className="investor-summary__disclaimer muted-note">
          Preliminary public-record screen only. This is not legal, engineering,
          insurance, or investment advice.
        </p>
      </header>

      <SectionCard
        title="Verify first — reserves, SIRS, and inspection"
        subtitle="Highest-priority association gates for underwriting this condo. Treat these before secondary cost inputs."
      >
        <div className="screening-sheet-wrap">
          <table className="data-table screening-sheet">
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Status</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody>
              {PRIMARY_BLOCKERS.slice(0, 2).map((row) => (
                <tr key={row.item} className="screening-sheet__priority-row">
                  <td className="screening-sheet__item">{row.item}</td>
                  <td>
                    <StatusPill label={row.status} tone={row.tone} />
                  </td>
                  <td>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Key deal metrics">
        <div className="screening-sheet-wrap">
          <table className="data-table screening-sheet">
            <thead>
              <tr>
                <th scope="col">Metric</th>
                <th scope="col">Status</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              {metricRows.map((row) => (
                <tr key={row.item}>
                  <td className="screening-sheet__item">{row.item}</td>
                  <td>
                    <StatusPill label={row.status} tone={row.tone} />
                  </td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard
        title="Primary deal blockers"
        subtitle="Association gaps that prevent reliable underwriting right now — not a final property judgment. Ordered by real-deal priority."
      >
        <div className="screening-sheet-wrap">
          <table className="data-table screening-sheet">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Blocker</th>
                <th scope="col">Status</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody>
              {PRIMARY_BLOCKERS.map((row, index) => (
                <tr
                  key={row.item}
                  className={
                    index < 2 ? "screening-sheet__priority-row" : undefined
                  }
                >
                  <td>{index + 1}</td>
                  <td className="screening-sheet__item">{row.item}</td>
                  <td>
                    <StatusPill label={row.status} tone={row.tone} />
                  </td>
                  <td>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </section>
  );
}
