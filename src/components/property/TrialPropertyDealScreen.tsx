import Link from "next/link";
import type {
  CondoRiskFlags,
  MissingDocumentState,
  PropertyScreen,
  RiskFlagStatus,
} from "@/types/property";
import { formatDate, formatMoney } from "@/lib/format";
import {
  countOpenRiskFlags,
  type StatusTone,
} from "@/lib/property-metrics";
import { DetailList } from "./DetailList";
import { SectionCard } from "./SectionCard";
import { StatusPill } from "./StatusPill";
import { PilotEndOfReviewFeedback } from "./PilotEndOfReviewFeedback";
import { PilotReviewGuidance } from "./PilotReviewGuidance";
import { showPilotEndOfReviewFeedback } from "@/lib/pilot-feedback";

type TrialPropertyDealScreenProps = {
  property: PropertyScreen;
  backHref?: string;
  backLabel?: string;
};

const RISK_FLAG_ORDER: (keyof CondoRiskFlags)[] = [
  "milestoneInspection",
  "sirsReserves",
  "specialAssessments",
  "hoaDues",
  "insurance",
  "litigationOrRecords",
];

const DOC_STATE_ORDER: MissingDocumentState[] = [
  "received",
  "requested",
  "missing",
];

/** Concise trial-facing diligence narrative (seed list stays unchanged). */
const TRIAL_STILL_MISSING: { title: string; items: string[] }[] = [
  {
    title: "Association / governance",
    items: [
      "Confirm River Oaks Condominium II Association, Inc. matches RIVER OAKS CONDO II ASSN INC and that Unit 1921 is within the same project.",
      "Review received estoppel and condo questionnaire for Unit 1921 (delinquencies, rental restrictions, litigation); other association packet items remain open.",
    ],
  },
  {
    title: "Cost verification",
    items: [
      "Confirm current monthly HOA dues for Unit 1921 and what they include.",
    ],
  },
  {
    title: "Reserves, SIRS, and structural",
    items: [
      "Obtain the approved budget and reserve schedule; confirm SIRS status and whether a milestone or similar structural inspection applies to this building or phase.",
    ],
  },
  {
    title: "Assessments, capital projects, and litigation",
    items: [
      "Confirm special assessments, material litigation or insurance disputes, and capital projects that could increase reserves or future owner costs.",
    ],
  },
];

const FLOODPLAIN_NOTE =
  "Preliminary map reference only. Confirm current flood-zone, insurance, and disclosure requirements through appropriate sources.";

const TRACK_RATIONALE =
  "Public facts and tax status are sufficient to continue review. Do not make a buy/pass decision until the association budget, reserve schedule, SIRS or inspection status, verified HOA dues, insurance posture, assessments, and litigation context are confirmed.";

function riskTone(status: RiskFlagStatus): StatusTone {
  if (status === "clear") return "good";
  if (status === "open") return "warn";
  return "neutral";
}

function riskLabel(status: RiskFlagStatus): string {
  if (status === "clear") return "Clear";
  if (status === "open") return "Open";
  return "Unknown";
}

function docTone(state: MissingDocumentState): StatusTone {
  if (state === "received") return "good";
  if (state === "requested") return "warn";
  return "bad";
}

function docLabel(state: MissingDocumentState): string {
  if (state === "received") return "Received";
  if (state === "requested") return "Requested";
  return "Missing";
}

function countDocsByState(
  property: PropertyScreen,
  state: MissingDocumentState
): number {
  return (property.missingDocuments?.items ?? []).filter(
    (item) => item.state === state
  ).length;
}

function countTrialDiligenceItems(): number {
  return TRIAL_STILL_MISSING.reduce(
    (total, group) => total + group.items.length,
    0
  );
}

function sourceNoteFor(label: string, notes?: string): string | undefined {
  if (/floodplain/i.test(label)) return FLOODPLAIN_NOTE;
  return notes;
}

/**
 * Trial-facing, read-only Florida condo screening report.
 * Catalog-only; no session overlays, demo controls, or CRM chrome.
 */
export function TrialPropertyDealScreen({
  property,
  backHref = "/properties",
  backLabel = "← Properties",
}: TrialPropertyDealScreenProps) {
  const recommendation =
    property.status?.currentRecommendation ?? "Track";
  const openRisks = countOpenRiskFlags(property.condoRiskFlags);
  const openDiligence = countTrialDiligenceItems();
  const received = countDocsByState(property, "received");
  const requested = countDocsByState(property, "requested");
  const missing = countDocsByState(property, "missing");
  const docs = [...(property.missingDocuments?.items ?? [])].sort(
    (a, b) =>
      DOC_STATE_ORDER.indexOf(a.state) - DOC_STATE_ORDER.indexOf(b.state)
  );
  const taxRows = [...(property.taxes?.annualHistory ?? [])].sort(
    (a, b) => b.year - a.year
  );
  const oldestTax = taxRows[taxRows.length - 1];
  const newestTax = taxRows[0];
  const linkedSources = (property.sources ?? []).filter(
    (source) => Boolean(source.url) || source.status === "note"
  );
  const pendingSourceLabels = (property.sources ?? [])
    .filter((source) => source.status === "missing" && !source.url)
    .map((source) => source.label);
  const hoaConflictNote =
    "Listing figures conflict (about $499 vs about $376 per month). Do not use either figure for underwriting until confirmed with the association or estoppel.";
  const nextMissingDoc = docs.find((item) => item.state === "missing");

  return (
    <main className="page-stack trial-deal-screen">
      <Link href={backHref} className="back-link">
        {backLabel}
      </Link>

      <PilotReviewGuidance property={property} />

      {/* 1–3. Header + one Track badge + supporting line */}
      <header className="property-header">
        <p className="property-header__eyebrow">
          {property.county} · {property.propertyType}
          {property.status?.lastReviewedAt
            ? ` · Reviewed ${formatDate(property.status.lastReviewedAt)}`
            : ""}
        </p>
        <div className="property-header__row">
          <div>
            <p className="muted-note" style={{ margin: "0 0 6px", fontWeight: 600 }}>
              Florida condo screening
            </p>
            <h1>{property.address}</h1>
            <p className="property-header__community">
              {property.city}, {property.state} {property.zip}
              {property.community ? ` · ${property.community}` : ""}
            </p>
          </div>
          <StatusPill label={recommendation} tone="warn" />
        </div>
        <p className="property-header__purpose">
          Public-record and listing review for a preliminary decision.
          Association diligence remains open.
        </p>
      </header>

      {/* 4. Screening recommendation */}
      <section className="recommendation-banner">
        <h2>Screening recommendation</h2>
        <p className="recommendation-banner__lede">
          Continue targeted diligence. Public facts are usable, but association
          diligence still gates a buy/pass decision.
        </p>
      </section>

      {/* 5. Screening summary */}
      <SectionCard title="Screening summary">
        <DetailList
          items={[
            { label: "Open risk flags", value: openRisks },
            { label: "Open diligence items", value: openDiligence },
            {
              label: "Next gate",
              value:
                "Review association budget, reserves, SIRS status, inspection status, and estoppel package",
            },
          ]}
        />
      </SectionCard>

      {/* 6. Next decision gate */}
      <SectionCard
        title="Next decision gate"
        subtitle="What still stands between this Track screen and a buy/pass call."
      >
        <ol
          className="deal-timeline trial-decision-timeline"
          aria-label="Screening timeline"
        >
          <li className="deal-timeline__item">
            <div
              className="deal-timeline__marker deal-timeline__marker--done"
              aria-hidden="true"
            />
            <div className="deal-timeline__content">
              <div className="deal-timeline__header trial-status-row">
                <p className="deal-timeline__label trial-status-row__title">
                  Initial public-record screen
                </p>
                <StatusPill label="Complete" tone="good" />
              </div>
            </div>
          </li>
          <li className="deal-timeline__item">
            <div
              className="deal-timeline__marker deal-timeline__marker--upcoming"
              aria-hidden="true"
            />
            <div className="deal-timeline__content">
              <div className="deal-timeline__header trial-status-row">
                <p className="deal-timeline__label trial-status-row__title">
                  Association diligence
                </p>
                <StatusPill label="Open" tone="warn" />
              </div>
            </div>
          </li>
          <li className="deal-timeline__item">
            <div
              className="deal-timeline__marker deal-timeline__marker--planned"
              aria-hidden="true"
            />
            <div className="deal-timeline__content">
              <div className="deal-timeline__header trial-status-row">
                <p className="deal-timeline__label trial-status-row__title">
                  Buy / pass decision
                </p>
                <StatusPill label="Pending" tone="neutral" />
              </div>
            </div>
          </li>
        </ol>
      </SectionCard>

      {/* 7. Florida condo risk flags */}
      <SectionCard
        title="Florida condo risk flags"
        subtitle="Unknown means not yet researched. Open means researched enough to know it remains unresolved."
      >
        {property.condoRiskFlags ? (
          <ul className="risk-flag-list">
            {RISK_FLAG_ORDER.map((key) => {
              const flag = property.condoRiskFlags?.[key];
              if (!flag) return null;
              const note =
                key === "hoaDues" ? hoaConflictNote : flag.note;
              const label =
                key === "hoaDues" ? "HOA dues" : flag.label;
              const statusLabel =
                key === "hoaDues" && flag.status === "open"
                  ? "Unverified / Open"
                  : riskLabel(flag.status);
              return (
                <li key={key} className="risk-flag-row">
                  <div className="risk-flag-row__main trial-status-row">
                    <span className="risk-flag-row__label trial-status-row__title">
                      {label}
                    </span>
                    <StatusPill
                      label={statusLabel}
                      tone={riskTone(flag.status)}
                    />
                  </div>
                  {note ? (
                    <p className="risk-flag-row__note">{note}</p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="muted-note">No risk flags recorded.</p>
        )}
      </SectionCard>

      {/* 8. Missing documents */}
      <SectionCard
        title="Missing documents"
        subtitle={`Received: ${received} · Requested: ${requested} · Missing: ${missing}`}
      >
        {docs.length ? (
          <ul className="risk-flag-list">
            {docs.map((item) => (
              <li key={item.id} className="risk-flag-row">
                <div className="risk-flag-row__main trial-status-row">
                  <span className="risk-flag-row__label trial-status-row__title">
                    {item.label}
                  </span>
                  <StatusPill
                    label={docLabel(item.state)}
                    tone={docTone(item.state)}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted-note">No document checklist on this screen.</p>
        )}
        {nextMissingDoc ? (
          <p className="muted-note" style={{ marginTop: "0.75rem" }}>
            Next request: {nextMissingDoc.label.toLowerCase()}.
          </p>
        ) : null}
      </SectionCard>

      {/* 9. Property snapshot */}
      <SectionCard title="Property snapshot">
        <DetailList
          items={[
            { label: "Community", value: property.community },
            { label: "County", value: property.county },
            { label: "Property type", value: property.propertyType },
            { label: "Configuration", value: property.unitConfiguration },
            { label: "Year built", value: property.yearBuilt },
            { label: "Heated square feet", value: property.size?.heatedSqFt },
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
            { label: "Tax account", value: property.identifiers?.taxAccount },
            {
              label: "Owner on tax roll",
              value: property.ownership?.ownerOnTaxRoll,
            },
          ]}
        />
        <details className="trial-details">
          <summary>Additional public-record details</summary>
          <DetailList
            items={[
              { label: "PIN", value: property.identifiers?.pin },
              { label: "Zoning", value: property.zoning },
              { label: "Gross square feet", value: property.size?.grossSqFt },
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
                label: "Ownership interest",
                value: property.ownership?.ownershipInterest,
              },
            ]}
          />
        </details>
      </SectionCard>

      {/* 10. Known facts and remaining diligence */}
      <SectionCard
        title="Known facts and remaining diligence"
        subtitle="What the public record and listing already support, versus what still blocks a buy/pass call."
      >
        {(property.summary?.whatIsKnown?.length ?? 0) > 0 ? (
          <>
            <h3 className="subsection-title" style={{ marginTop: 0 }}>
              Known
            </h3>
            <ul>
              {(property.summary?.whatIsKnown ?? []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        ) : null}
        {(property.summary?.publicRiskSignals?.length ?? 0) > 0 ? (
          <>
            <h3 className="subsection-title">Public-risk signals</h3>
            <ul>
              {(property.summary?.publicRiskSignals ?? []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        ) : null}
        <h3 className="subsection-title">Still missing</h3>
        {TRIAL_STILL_MISSING.map((group) => (
          <div key={group.title}>
            <h4 className="subsection-title" style={{ fontSize: "0.95rem" }}>
              {group.title}
            </h4>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </SectionCard>

      {/* 11. Tax summary */}
      <SectionCard title="Tax summary">
        <p style={{ marginTop: 0 }}>
          {property.status?.taxStatus ?? "—"}. Most recent payment:{" "}
          {formatMoney(property.taxes?.mostRecentPaymentAmount, {
            maximumFractionDigits: 2,
          })}{" "}
          on {formatDate(property.taxes?.mostRecentPaymentDate)}.
        </p>
        {oldestTax && newestTax && oldestTax.year !== newestTax.year ? (
          <p className="muted-note">
            Annual tax bill increased from{" "}
            {formatMoney(oldestTax.amount, { maximumFractionDigits: 2 })} in{" "}
            {oldestTax.year} to{" "}
            {formatMoney(newestTax.amount, { maximumFractionDigits: 2 })} in{" "}
            {newestTax.year}.
          </p>
        ) : null}
        {taxRows.length > 0 ? (
          <details className="trial-details">
            <summary>Multi-year tax history</summary>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Paid date</th>
                  </tr>
                </thead>
                <tbody>
                  {taxRows.map((row) => (
                    <tr key={row.year}>
                      <td>{row.year}</td>
                      <td>
                        {formatMoney(row.amount, {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td style={{ textTransform: "capitalize" }}>
                        {row.status}
                      </td>
                      <td>{formatDate(row.paidDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        ) : null}
      </SectionCard>

      {/* 12. Association summary */}
      <SectionCard
        title="Association summary"
        subtitle={property.association?.legalName}
      >
        <dl className="trial-fact-list">
          {property.association?.corporateStatus ? (
            <div className="trial-fact-row">
              <dt className="trial-fact-row__label">Entity status</dt>
              <dd className="trial-fact-row__value">
                Active Florida not-for-profit entity —{" "}
                {property.association.corporateStatus}
              </dd>
            </div>
          ) : null}
          {(property.association?.dbprStatus?.length ?? 0) > 0 ? (
            <div className="trial-fact-row">
              <dt className="trial-fact-row__label">Entity / DBPR context</dt>
              <dd className="trial-fact-row__value">
                {property.association?.dbprStatus?.[0]}
              </dd>
            </div>
          ) : null}
          {property.association?.managerNote ? (
            <div className="trial-fact-row">
              <dt className="trial-fact-row__label">Manager confirmation</dt>
              <dd className="trial-fact-row__value">
                {property.association.managerNote}
              </dd>
            </div>
          ) : null}
          <div className="trial-fact-row">
            <dt className="trial-fact-row__label">HOA dues</dt>
            <dd className="trial-fact-row__value">
              Remain unverified. {hoaConflictNote}
            </dd>
          </div>
          <div className="trial-fact-row">
            <dt className="trial-fact-row__label">Official-record signal</dt>
            <dd className="trial-fact-row__value">
              Collection activity across the association is a medium-risk
              signal. Verify current delinquencies, reserves, financial posture,
              litigation, and governing documents before a buy/pass decision.
            </dd>
          </div>
        </dl>
        <details className="trial-details">
          <summary>Corporate and filing details</summary>
          <DetailList
            items={[
              {
                label: "Document number",
                value: property.association?.documentNumber,
              },
              { label: "FEI / EIN", value: property.association?.fein },
              { label: "Date filed", value: property.association?.dateFiled },
              {
                label: "Registered agent",
                value: property.association?.registeredAgent,
              },
              {
                label: "Principal address",
                value: property.association?.principalAddress,
              },
            ]}
          />
          {(property.association?.officers?.length ?? 0) > 0 ? (
            <>
              <h3 className="subsection-title">Officers</h3>
              <ul>
                {(property.association?.officers ?? []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}
          {(property.association?.dbprStatus?.length ?? 0) > 1 ? (
            <>
              <h3 className="subsection-title">DBPR notes</h3>
              <ul>
                {(property.association?.dbprStatus ?? []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}
        </details>
      </SectionCard>

      {/* 13. Sources and references */}
      <SectionCard title="Sources and references">
        {linkedSources.length > 0 ? (
          <ul className="source-list">
            {linkedSources.map((source) => {
              const notes = sourceNoteFor(source.label, source.notes);
              return (
                <li key={source.label} className="source-item">
                  <div className="source-item__top trial-status-row">
                    <span className="source-item__label trial-status-row__title">
                      {source.url ? (
                        <a href={source.url} target="_blank" rel="noreferrer">
                          {source.label}
                        </a>
                      ) : (
                        source.label
                      )}
                    </span>
                    <StatusPill
                      label={source.url ? "Linked" : "Note"}
                      tone={source.url ? "good" : "warn"}
                    />
                  </div>
                  {notes ? (
                    <p className="source-item__notes">{notes}</p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="muted-note">No linked sources recorded yet.</p>
        )}
        {pendingSourceLabels.length > 0 ? (
          <p className="muted-note" style={{ marginTop: "0.75rem" }}>
            Additional public-record references: county appraiser, tax
            collector, official records, Florida DBPR, and brokerage listings.
            Links pending verification.
          </p>
        ) : null}
      </SectionCard>

      {/* 14. Track rationale */}
      <SectionCard title="Track rationale">
        <p style={{ marginTop: 0 }}>{TRACK_RATIONALE}</p>
      </SectionCard>

      {showPilotEndOfReviewFeedback(property) ? (
        <PilotEndOfReviewFeedback />
      ) : null}
    </main>
  );
}
