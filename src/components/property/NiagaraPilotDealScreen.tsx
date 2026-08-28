import Link from "next/link";
import type {
  CondoRiskFlags,
  MissingDocumentState,
  PropertyScreen,
  RiskFlagStatus,
} from "@/types/property";
import { formatDate, formatMoney } from "@/lib/format";
import { countOpenRiskFlags, type StatusTone } from "@/lib/property-metrics";
import { DetailList } from "./DetailList";
import { StatusPill } from "./StatusPill";
import { PilotEndOfReviewFeedback } from "./PilotEndOfReviewFeedback";
import { showPilotEndOfReviewFeedback } from "@/lib/pilot-feedback";

type NiagaraPilotDealScreenProps = {
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

const HOA_CONFLICT_NOTE =
  "Listing figures conflict (about $499 vs about $376 per month). Do not use either figure for underwriting until confirmed with the association or estoppel.";

const FLOODPLAIN_NOTE =
  "Preliminary map reference only. Confirm current flood-zone, insurance, and disclosure requirements through appropriate sources.";

/**
 * Inputs an investor must verify before underwriting. These stay unverified in
 * the seed on purpose — the pilot screen surfaces them so no one treats listing
 * data or a blank pro forma as fact.
 */
const UNVERIFIED_INPUTS: { label: string; detail: string }[] = [
  {
    label: "Monthly HOA dues",
    detail: HOA_CONFLICT_NOTE,
  },
  {
    label: "Market rent",
    detail:
      "No verified rent comp for this unit yet. Pro forma rent is left null until a supportable figure exists.",
  },
  {
    label: "Insurance posture",
    detail:
      "Association and unit insurance premiums are not researched; no annual figure is usable for carrying costs.",
  },
  {
    label: "Reserves / SIRS",
    detail:
      "Approved budget, reserve schedule, and Structural Integrity Reserve Study status are not in hand.",
  },
  {
    label: "Special assessments",
    detail:
      "Current or recently approved special assessments and major capital projects are not yet confirmed.",
  },
];

/**
 * Ordered diligence checklist for the pilot. Each row maps to a gate the
 * reviewer clears before a buy/pass call.
 */
const DILIGENCE_CHECKLIST: {
  label: string;
  state: "done" | "in-progress" | "open";
  note: string;
}[] = [
  {
    label: "Initial public-record screen",
    state: "done",
    note: "Identity, ownership, parcel, and tax history reconciled from county records.",
  },
  {
    label: "Estoppel / condo questionnaire review",
    state: "in-progress",
    note: "Estoppel received for Unit 1921; delinquencies, rental caps, and litigation still being read.",
  },
  {
    label: "Approved budget & reserve schedule",
    state: "open",
    note: "Request the latest approved budget and reserve schedule from the association or manager.",
  },
  {
    label: "SIRS & milestone inspection status",
    state: "open",
    note: "Confirm whether a SIRS and any milestone/structural inspection apply to this building or phase.",
  },
  {
    label: "Verified HOA dues & operating inputs",
    state: "open",
    note: "Confirm monthly dues and build working rent, insurance, vacancy, and repair assumptions.",
  },
  {
    label: "Buy / pass decision",
    state: "open",
    note: "Make the call only after association diligence closes — not a hard close date.",
  },
];

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

function checklistTone(
  state: "done" | "in-progress" | "open"
): StatusTone {
  if (state === "done") return "good";
  if (state === "in-progress") return "warn";
  return "neutral";
}

function checklistLabel(state: "done" | "in-progress" | "open"): string {
  if (state === "done") return "Done";
  if (state === "in-progress") return "In progress";
  return "Open";
}

function countDocsByState(
  property: PropertyScreen,
  state: MissingDocumentState
): number {
  return (property.missingDocuments?.items ?? []).filter(
    (item) => item.state === state
  ).length;
}

function sourceNoteFor(label: string, notes?: string): string | undefined {
  if (/floodplain/i.test(label)) return FLOODPLAIN_NOTE;
  return notes;
}

type PilotAccordionProps = {
  title: string;
  summary: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

function PilotAccordion({
  title,
  summary,
  defaultOpen = false,
  children,
}: PilotAccordionProps) {
  return (
    <details className="pilot-accordion" open={defaultOpen}>
      <summary className="pilot-accordion__summary">
        <span className="pilot-accordion__title">{title}</span>
        <span className="pilot-accordion__hint">{summary}</span>
      </summary>
      <div className="pilot-accordion__body">{children}</div>
    </details>
  );
}

/**
 * Dense, pilot-facing Florida condo deal screen for Niagara (Unit 1921).
 * Blue intro banner, investor summary, unverified inputs, a diligence
 * checklist, seven detail accordions, and the end-of-review feedback survey.
 */
export function NiagaraPilotDealScreen({
  property,
  backHref = "/properties",
  backLabel = "← Properties",
}: NiagaraPilotDealScreenProps) {
  const recommendation = property.status?.currentRecommendation ?? "Track";
  const openRisks = countOpenRiskFlags(property.condoRiskFlags);
  const openChecklist = DILIGENCE_CHECKLIST.filter(
    (item) => item.state !== "done"
  ).length;
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

  return (
    <main className="page-stack niagara-pilot">
      <Link href={backHref} className="back-link">
        {backLabel}
      </Link>

      {/* 1. Blue intro banner */}
      <section
        className="pilot-intro-banner"
        aria-labelledby="pilot-intro-heading"
      >
        <p className="pilot-intro-banner__eyebrow">
          Florida condo screening · Pilot review
        </p>
        <div className="pilot-intro-banner__row">
          <div>
            <h1 id="pilot-intro-heading">{property.address}</h1>
            <p className="pilot-intro-banner__location">
              {property.city}, {property.state} {property.zip}
              {property.community ? ` · ${property.community}` : ""}
            </p>
          </div>
          <StatusPill label={recommendation} tone="warn" />
        </div>
        <p className="pilot-intro-banner__body">
          This is a read-only screening view for solo investors — not a CRM.
          Public record and tax status support continued review, but association
          diligence still gates a buy/pass call. Skim the investor summary and
          unverified inputs first, expand the accordions for detail, then leave
          feedback at the bottom.
        </p>
      </section>

      {/* 2. Investor summary */}
      <section className="section-card niagara-pilot__summary">
        <div>
          <h2>Investor summary</h2>
          <p className="section-card__subtitle">
            At-a-glance screen outcome and the numbers that shape a preliminary
            decision.
          </p>
        </div>
        <div className="section-card__body">
          <DetailList
            items={[
              { label: "Recommendation", value: recommendation },
              {
                label: "Listing price",
                value: formatMoney(property.pricing?.listingPrice),
              },
              {
                label: "County market value",
                value: formatMoney(property.pricing?.countyMarketValue),
              },
              { label: "Configuration", value: property.unitConfiguration },
              { label: "Year built", value: property.yearBuilt },
              {
                label: "Heated sq ft",
                value: property.size?.heatedSqFt,
              },
              { label: "Open risk flags", value: openRisks },
              { label: "Open checklist items", value: openChecklist },
              {
                label: "Documents",
                value: `${received} received · ${requested} requested · ${missing} missing`,
              },
            ]}
          />
          <p className="niagara-pilot__next-gate">
            <strong>Next gate:</strong> review the association budget, reserve
            schedule, SIRS/inspection status, verified HOA dues, insurance
            posture, assessments, and litigation context before a buy/pass
            decision.
          </p>
        </div>
      </section>

      {/* 3. Unverified inputs */}
      <section
        className="pilot-unverified"
        aria-labelledby="pilot-unverified-heading"
      >
        <div className="pilot-unverified__head">
          <h2 id="pilot-unverified-heading">Unverified inputs</h2>
          <StatusPill label="Do not underwrite yet" tone="warn" />
        </div>
        <p className="pilot-unverified__lede">
          These inputs are not confirmed. Leave them out of any pro forma until
          verified with the association, estoppel, or a supportable comp.
        </p>
        <ul className="pilot-unverified__list">
          {UNVERIFIED_INPUTS.map((input) => (
            <li key={input.label} className="pilot-unverified__item">
              <span className="pilot-unverified__label">{input.label}</span>
              <span className="pilot-unverified__detail">{input.detail}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. Diligence checklist */}
      <section className="section-card">
        <div>
          <h2>Diligence checklist</h2>
          <p className="section-card__subtitle">
            {openChecklist} of {DILIGENCE_CHECKLIST.length} steps still open
            between this Track screen and a buy/pass call.
          </p>
        </div>
        <div className="section-card__body">
          <ol className="pilot-checklist">
            {DILIGENCE_CHECKLIST.map((item) => (
              <li key={item.label} className="pilot-checklist__item">
                <div className="pilot-checklist__row">
                  <span className="pilot-checklist__label">{item.label}</span>
                  <StatusPill
                    label={checklistLabel(item.state)}
                    tone={checklistTone(item.state)}
                  />
                </div>
                <p className="pilot-checklist__note">{item.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Seven detail accordions */}
      <div className="pilot-accordions">
        <PilotAccordion
          title="Property snapshot"
          summary="Public-record identity, pricing, and ownership"
          defaultOpen
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
        </PilotAccordion>

        <PilotAccordion
          title="Florida condo risk flags"
          summary={`${openRisks} open · unknown means not yet researched`}
        >
          {property.condoRiskFlags ? (
            <ul className="risk-flag-list">
              {RISK_FLAG_ORDER.map((key) => {
                const flag = property.condoRiskFlags?.[key];
                if (!flag) return null;
                const note = key === "hoaDues" ? HOA_CONFLICT_NOTE : flag.note;
                const label = key === "hoaDues" ? "HOA dues" : flag.label;
                const statusLabel =
                  key === "hoaDues" && flag.status === "open"
                    ? "Unverified / Open"
                    : riskLabel(flag.status);
                return (
                  <li key={key} className="risk-flag-row">
                    <div className="risk-flag-row__main niagara-pilot__row">
                      <span className="risk-flag-row__label niagara-pilot__row-title">
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
        </PilotAccordion>

        <PilotAccordion
          title="Missing documents"
          summary={`${received} received · ${requested} requested · ${missing} missing`}
        >
          {docs.length ? (
            <ul className="risk-flag-list">
              {docs.map((item) => (
                <li key={item.id} className="risk-flag-row">
                  <div className="risk-flag-row__main niagara-pilot__row">
                    <span className="risk-flag-row__label niagara-pilot__row-title">
                      {item.label}
                    </span>
                    <StatusPill
                      label={docLabel(item.state)}
                      tone={docTone(item.state)}
                    />
                  </div>
                  {item.note ? (
                    <p className="risk-flag-row__note">{item.note}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted-note">No document checklist on this screen.</p>
          )}
        </PilotAccordion>

        <PilotAccordion
          title="Known facts and remaining diligence"
          summary="What the record supports versus what still blocks a call"
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
          {(property.missingDiligence ?? []).length > 0 ? (
            <>
              <h3 className="subsection-title">Still missing</h3>
              {(property.missingDiligence ?? []).map((group) => (
                <div key={group.title}>
                  <h4
                    className="subsection-title"
                    style={{ fontSize: "0.95rem" }}
                  >
                    {group.title}
                  </h4>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          ) : null}
        </PilotAccordion>

        <PilotAccordion
          title="Tax summary and history"
          summary={property.status?.taxStatus ?? "County tax status"}
        >
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
            <div style={{ overflowX: "auto", marginTop: "0.75rem" }}>
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
                        {formatMoney(row.amount, { maximumFractionDigits: 2 })}
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
          ) : null}
        </PilotAccordion>

        <PilotAccordion
          title="Association summary"
          summary={property.association?.legalName ?? "Association entity"}
        >
          <dl className="niagara-pilot__facts">
            {property.association?.corporateStatus ? (
              <div className="niagara-pilot__fact">
                <dt>Entity status</dt>
                <dd>
                  Active Florida not-for-profit entity —{" "}
                  {property.association.corporateStatus}
                </dd>
              </div>
            ) : null}
            {(property.association?.dbprStatus?.length ?? 0) > 0 ? (
              <div className="niagara-pilot__fact">
                <dt>Entity / DBPR context</dt>
                <dd>{property.association?.dbprStatus?.[0]}</dd>
              </div>
            ) : null}
            {property.association?.managerNote ? (
              <div className="niagara-pilot__fact">
                <dt>Manager confirmation</dt>
                <dd>{property.association.managerNote}</dd>
              </div>
            ) : null}
            <div className="niagara-pilot__fact">
              <dt>HOA dues</dt>
              <dd>Remain unverified. {HOA_CONFLICT_NOTE}</dd>
            </div>
            <div className="niagara-pilot__fact">
              <dt>Official-record signal</dt>
              <dd>
                Collection activity across the association is a medium-risk
                signal. Verify current delinquencies, reserves, financial
                posture, litigation, and governing documents before a buy/pass
                decision.
              </dd>
            </div>
          </dl>
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
        </PilotAccordion>

        <PilotAccordion
          title="Sources and references"
          summary={`${linkedSources.length} linked references`}
        >
          {linkedSources.length > 0 ? (
            <ul className="source-list">
              {linkedSources.map((source) => {
                const notes = sourceNoteFor(source.label, source.notes);
                return (
                  <li key={source.label} className="source-item">
                    <div className="source-item__top niagara-pilot__row">
                      <span className="source-item__label niagara-pilot__row-title">
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
          <p className="muted-note" style={{ marginTop: "0.75rem" }}>
            Additional public-record references (county appraiser, tax
            collector, official records, Florida DBPR, and brokerage listings)
            are pending verification.
          </p>
        </PilotAccordion>
      </div>

      {/* 6. Pilot feedback + survey iframe */}
      {showPilotEndOfReviewFeedback(property) ? (
        <PilotEndOfReviewFeedback />
      ) : null}
    </main>
  );
}
