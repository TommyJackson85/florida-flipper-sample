import { SectionCard } from "./SectionCard";
import { StatusPill } from "./StatusPill";

const UNVERIFIED_ROWS = [
  {
    label: "Monthly HOA dues",
    status: "Unverified",
    tone: "warn" as const,
    value: "Conflicting listing figures — about $376 vs $499/month",
  },
  {
    label: "Listing-data discrepancy",
    status: "Listing conflict",
    tone: "warn" as const,
    value:
      "$123 per month between listed figures ($1,476 if annualized). Listing-data spread only — not verified dues and not a cost forecast.",
  },
  {
    label: "Reserve / SIRS status",
    status: "Not verified",
    tone: "neutral" as const,
    value: "Not verified",
  },
  {
    label: "Assessments / capital projects",
    status: "Not verified",
    tone: "neutral" as const,
    value: "Not verified",
  },
  {
    label: "Master insurance",
    status: "Not verified",
    tone: "neutral" as const,
    value: "Not verified",
  },
  {
    label: "Litigation / claims",
    status: "Not verified",
    tone: "neutral" as const,
    value: "Not verified",
  },
] as const;

/**
 * Static panel of underwriting inputs that remain unverified on the sample deal.
 */
export function UnverifiedUnderwritingInputs() {
  return (
    <SectionCard
      id="unverified-underwriting-inputs"
      title="Underwriting inputs still unverified"
      subtitle="Listing-data gaps and association items that still block reliable carrying-cost inputs — not estimates or advice."
    >
      <dl className="unverified-inputs">
        {UNVERIFIED_ROWS.map((row) => (
          <div key={row.label} className="unverified-inputs__row">
            <div className="unverified-inputs__main trial-status-row">
              <dt className="unverified-inputs__label trial-status-row__title">
                {row.label}
              </dt>
              <StatusPill label={row.status} tone={row.tone} />
            </div>
            <dd className="unverified-inputs__value">{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="unverified-inputs__note muted-note">
        Until association records confirm these items, monthly carrying costs,
        cash needed at closing, and other underwriting inputs can change. This
        panel does not estimate assessments, repairs, insurance premiums, or
        returns.
      </p>
    </SectionCard>
  );
}
