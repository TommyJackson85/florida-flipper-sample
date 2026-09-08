import { SectionCard } from "./SectionCard";
import { StatusPill } from "./StatusPill";

/** Led by Reserves / SIRS / inspection — the gates pilots called most important. */
const UNVERIFIED_ROWS = [
  {
    label: "Reserve / SIRS status",
    status: "Not verified",
    tone: "bad" as const,
    value:
      "Approved budget, reserve schedule, and Structural Integrity Reserve Study status not obtained.",
    priority: true,
  },
  {
    label: "Milestone / structural inspection",
    status: "Not verified",
    tone: "bad" as const,
    value:
      "No milestone or similar building/phase inspection report on this screen.",
    priority: true,
  },
  {
    label: "Monthly HOA dues",
    status: "Unverified",
    tone: "warn" as const,
    value: "Conflicting listing figures — about $376 vs $499/month",
    priority: false,
  },
  {
    label: "Listing-data discrepancy",
    status: "Listing conflict",
    tone: "warn" as const,
    value:
      "$123 per month between listed figures ($1,476 if annualized). Listing-data spread only — not verified dues and not a cost forecast.",
    priority: false,
  },
  {
    label: "Assessments / capital projects",
    status: "Not verified",
    tone: "neutral" as const,
    value: "Not verified",
    priority: false,
  },
  {
    label: "Master insurance",
    status: "Not verified",
    tone: "neutral" as const,
    value: "Not verified",
    priority: false,
  },
  {
    label: "Litigation / claims",
    status: "Not verified",
    tone: "neutral" as const,
    value: "Not verified",
    priority: false,
  },
] as const;

/**
 * Spreadsheet-style panel of underwriting inputs still unverified on the sample deal.
 */
export function UnverifiedUnderwritingInputs() {
  return (
    <SectionCard
      id="unverified-underwriting-inputs"
      title="Underwriting inputs still unverified"
      subtitle="Reserves, SIRS, and inspection status lead this sheet — then listing-data and secondary association gaps. Not estimates or advice."
    >
      <div className="screening-sheet-wrap">
        <table className="data-table screening-sheet">
          <thead>
            <tr>
              <th scope="col">Input</th>
              <th scope="col">Status</th>
              <th scope="col">Detail</th>
            </tr>
          </thead>
          <tbody>
            {UNVERIFIED_ROWS.map((row) => (
              <tr
                key={row.label}
                className={
                  row.priority ? "screening-sheet__priority-row" : undefined
                }
              >
                <td className="screening-sheet__item">{row.label}</td>
                <td>
                  <StatusPill label={row.status} tone={row.tone} />
                </td>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="unverified-inputs__note muted-note">
        Until association records confirm these items, monthly carrying costs,
        cash needed at closing, and other underwriting inputs can change. This
        panel does not estimate assessments, repairs, insurance premiums, or
        returns.
      </p>
    </SectionCard>
  );
}
