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
import { PILOT_FEEDBACK_COPY, showPilotEndOfReviewFeedback } from "@/lib/pilot-feedback";
import { DetailList } from "./DetailList";
import { SectionCard } from "./SectionCard";
import { StatusPill } from "./StatusPill";
import { TrialPilotIntro } from "./TrialPilotIntro";
import { InvestorDealSummary } from "./InvestorDealSummary";
import { UnverifiedUnderwritingInputs } from "./UnverifiedUnderwritingInputs";
import { BeforeYouUnderwriteChecklist } from "./BeforeYouUnderwriteChecklist";
import {
  PilotEndOfReviewFeedback,
  PilotFeedbackCallout,
} from "./PilotEndOfReviewFeedback";
import { ReportAccordion } from "./ReportAccordion";

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

const HOA_CONFLICT_NOTE =
  "Unverified: listing sources conflict (about $376 vs about $499 per month). Treat both figures as unconfirmed until verified with the association or estoppel.";

const SCREENING_PILL = "Hold — association diligence required";

function riskTone(status: RiskFlagStatus): StatusTone {
  if (status === "clear") return "good";
  if (status === "open") return "warn";
  return "neutral";
}

function riskStatusLabel(
  key: keyof CondoRiskFlags,
  status: RiskFlagStatus
): string {
  if (status === "clear") return "Clear";
  if (status === "open") return "Open item";
  if (key === "hoaDues") return "Unverified";
  if (key === "insurance") return "Unknown";
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
 * Trial-facing, read-only Florida condo screening report with investor-first layout.
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
  const nextMissingDoc = docs.find((item) => item.state === "missing");

  return (
    <main className="page-stack trial-deal-screen">
      <Link href={backHref} className="back-link">
        {backLabel}
      </Link>

      <TrialPilotIntro address={property.address} />
      <InvestorDealSummary property={property} />
      <UnverifiedUnderwritingInputs />

      <BeforeYouUnderwriteChecklist property={property} />

      {showPilotEndOfReviewFeedback(property) ? (
        <PilotFeedbackCallout id="pilot-feedback-callout-pre-accordion" />
      ) : null}

      <ReportAccordion
        panels={[
          {
            id: "evidence-risk-flags",
            title: "Risk flags and rationale",
            hashTargets: [
              "evidence-risk-flags",
              "evidence-missing-documents",
            ],
            children: (
              <>
                <p className="report-panel__lede">
                  Preliminary screening status: {SCREENING_PILL}. Public facts
                  are present, but association diligence still gates a buy/pass
                  call.
                </p>
                <p className="report-panel__lede">
                  Public-record identity and tax payment history are usable for
                  triage. Association budget, reserves, SIRS, inspection
                  status, verified HOA dues, insurance posture, assessments, and
                  litigation context remain open.
                </p>

                <SectionCard
                  title="Florida condo risk flags"
                  subtitle="Unknown = not researched yet. Open item = research started but not finished. Unverified = conflicting listing data."
                >
                  {property.condoRiskFlags ? (
                    <ul className="risk-flag-list">
                      {RISK_FLAG_ORDER.map((key) => {
                        const flag = property.condoRiskFlags?.[key];
                        if (!flag) return null;
                        const note =
                          key === "hoaDues" ? HOA_CONFLICT_NOTE : flag.note;
                        const label =
                          key === "hoaDues" ? "HOA dues" : flag.label;
                        return (
                          <li key={key} className="risk-flag-row">
                            <div className="risk-flag-row__main trial-status-row">
                              <span className="risk-flag-row__label trial-status-row__title">
                                {label}
                              </span>
                              <StatusPill
                                label={riskStatusLabel(key, flag.status)}
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

                <div id="evidence-missing-documents">
                  <h3 className="subsection-title">Document evidence detail</h3>
                  <p className="muted-note">
                    Action checklist lives above. This list preserves the same
                    artifact statuses for evidence review — Received: {received}{" "}
                    · Requested: {requested} · Missing: {missing}.
                  </p>
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
                          {item.note ? (
                            <p className="risk-flag-row__note">{item.note}</p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="muted-note">
                      No document checklist on this screen.
                    </p>
                  )}
                  {nextMissingDoc ? (
                    <p className="muted-note" style={{ marginTop: "0.75rem" }}>
                      Next request: {nextMissingDoc.label.toLowerCase()}.
                    </p>
                  ) : null}
                </div>

                {(property.summary?.publicRiskSignals?.length ?? 0) > 0 ? (
                  <>
                    <h3 className="subsection-title">Public-risk signals</h3>
                    <ul>
                      {(property.summary?.publicRiskSignals ?? []).map(
                        (item) => (
                          <li key={item}>{item}</li>
                        )
                      )}
                    </ul>
                  </>
                ) : null}

                {(property.summary?.risks?.length ?? 0) > 0 ? (
                  <>
                    <h3 className="subsection-title">Additional risk notes</h3>
                    <ul>
                      {(property.summary?.risks ?? []).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </>
            ),
          },
          {
            id: "evidence-property-facts",
            title: "Property and listing facts",
            hashTargets: ["evidence-property-facts"],
            children: (
              <>
                <header className="property-header">
                  <p className="property-header__eyebrow">
                    {property.county} · {property.propertyType}
                    {property.status?.lastReviewedAt
                      ? ` · Reviewed ${formatDate(property.status.lastReviewedAt)}`
                      : ""}
                    {property.community ? ` · ${property.community}` : ""}
                  </p>
                </header>

                <SectionCard title="Property snapshot">
                  <DetailList
                    items={[
                      { label: "Community", value: property.community },
                      { label: "County", value: property.county },
                      { label: "Property type", value: property.propertyType },
                      {
                        label: "Configuration",
                        value: property.unitConfiguration,
                      },
                      { label: "Year built", value: property.yearBuilt },
                      {
                        label: "Heated square feet",
                        value: property.size?.heatedSqFt,
                      },
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
                      {
                        label: "Tax account",
                        value: property.identifiers?.taxAccount,
                      },
                      {
                        label: "Owner on tax roll",
                        value: property.ownership?.ownerOnTaxRoll,
                      },
                      { label: "PIN", value: property.identifiers?.pin },
                      { label: "Zoning", value: property.zoning },
                      {
                        label: "Gross square feet",
                        value: property.size?.grossSqFt,
                      },
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
                </SectionCard>

                {(property.summary?.whatIsKnown?.length ?? 0) > 0 ? (
                  <SectionCard title="Known from listing / record">
                    <ul>
                      {(property.summary?.whatIsKnown ?? []).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </SectionCard>
                ) : null}

                {(property.summary?.strengths?.length ?? 0) > 0 ? (
                  <SectionCard title="Strengths on file">
                    <ul>
                      {(property.summary?.strengths ?? []).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </SectionCard>
                ) : null}
              </>
            ),
          },
          {
            id: "evidence-association",
            title: "Association and management context",
            hashTargets: ["evidence-association"],
            children: (
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
                      <dt className="trial-fact-row__label">
                        Entity / DBPR context
                      </dt>
                      <dd className="trial-fact-row__value">
                        {property.association?.dbprStatus?.[0]}
                      </dd>
                    </div>
                  ) : null}
                  {property.association?.managerNote ? (
                    <div className="trial-fact-row">
                      <dt className="trial-fact-row__label">
                        Manager confirmation
                      </dt>
                      <dd className="trial-fact-row__value">
                        {property.association.managerNote}
                      </dd>
                    </div>
                  ) : null}
                  <div className="trial-fact-row">
                    <dt className="trial-fact-row__label">HOA dues</dt>
                    <dd className="trial-fact-row__value">
                      Remain unverified. {HOA_CONFLICT_NOTE}
                    </dd>
                  </div>
                  <div className="trial-fact-row">
                    <dt className="trial-fact-row__label">
                      Official-record signal
                    </dt>
                    <dd className="trial-fact-row__value">
                      Collection activity across the association is a
                      public-record signal only. Confirm current delinquencies,
                      reserves, financial posture, litigation, and governing
                      documents before a buy/pass decision.
                    </dd>
                  </div>
                </dl>

                {(property.association?.officialRecordsNotes?.length ?? 0) >
                0 ? (
                  <>
                    <h3 className="subsection-title">Official-record notes</h3>
                    <ul>
                      {(property.association?.officialRecordsNotes ?? []).map(
                        (item) => (
                          <li key={item.title}>
                            <strong>{item.title}</strong>. {item.summary}{" "}
                            <span className="muted-note">
                              ({item.riskLevel} risk)
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </>
                ) : null}

                <p className="muted-note" style={{ marginTop: "0.75rem" }}>
                  Filing numbers, officers, and full DBPR notes are in{" "}
                  <a href="#evidence-corporate">
                    Corporate, DBPR, and licensing details
                  </a>
                  .
                </p>
              </SectionCard>
            ),
          },
          {
            id: "evidence-taxes",
            title: "Taxes and public records",
            hashTargets: ["evidence-taxes"],
            children: (
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
                    {formatMoney(oldestTax.amount, {
                      maximumFractionDigits: 2,
                    })}{" "}
                    in {oldestTax.year} to{" "}
                    {formatMoney(newestTax.amount, {
                      maximumFractionDigits: 2,
                    })}{" "}
                    in {newestTax.year}.
                  </p>
                ) : null}

                {taxRows.length > 0 ? (
                  <>
                    <h3 className="subsection-title">Multi-year tax history</h3>
                    <ul className="tax-year-cards" aria-label="Tax history by year">
                      {taxRows.map((row) => (
                        <li key={row.year} className="tax-year-card">
                          <div className="tax-year-card__top">
                            <span className="tax-year-card__year">
                              {row.year}
                            </span>
                            <StatusPill
                              label={row.status}
                              tone={row.status === "paid" ? "good" : "warn"}
                            />
                          </div>
                          <p className="tax-year-card__amount">
                            {formatMoney(row.amount, {
                              maximumFractionDigits: 2,
                            })}
                          </p>
                          <p className="tax-year-card__meta muted-note">
                            Paid {formatDate(row.paidDate)}
                            {row.notes ? ` · ${row.notes}` : ""}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <div className="tax-year-table-wrap">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Year</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Paid date</th>
                            <th>Notes</th>
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
                              <td>{row.notes ?? "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : null}
              </SectionCard>
            ),
          },
          {
            id: "evidence-corporate",
            title: "Corporate, DBPR, and licensing details",
            hashTargets: ["evidence-corporate", "evidence-corporate-dbpr"],
            children: (
              <SectionCard
                title="Corporate and DBPR details"
                subtitle={property.association?.legalName}
              >
                <DetailList
                  items={[
                    {
                      label: "Legal name",
                      value: property.association?.legalName,
                    },
                    {
                      label: "Entity type",
                      value: property.association?.entityType,
                    },
                    {
                      label: "Document number",
                      value: property.association?.documentNumber,
                    },
                    { label: "FEI / EIN", value: property.association?.fein },
                    {
                      label: "Date filed",
                      value: property.association?.dateFiled,
                    },
                    {
                      label: "Corporate status",
                      value: property.association?.corporateStatus,
                    },
                    {
                      label: "Registered agent",
                      value: property.association?.registeredAgent,
                    },
                    {
                      label: "Principal address",
                      value: property.association?.principalAddress,
                    },
                    {
                      label: "Annual reports on file",
                      value: (property.association?.annualReports ?? []).join(
                        " · "
                      ),
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
                {(property.association?.dbprStatus?.length ?? 0) > 0 ? (
                  <>
                    <h3 className="subsection-title">DBPR notes</h3>
                    <ul>
                      {(property.association?.dbprStatus ?? []).map(
                        (item) => (
                          <li key={item}>{item}</li>
                        )
                      )}
                    </ul>
                  </>
                ) : null}
              </SectionCard>
            ),
          },
          {
            id: "evidence-sources",
            title: "Sources and references",
            hashTargets: ["evidence-sources"],
            children: (
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
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
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
                    Additional public-record references:{" "}
                    {pendingSourceLabels.join(", ")}. Links pending
                    verification.
                  </p>
                ) : null}
              </SectionCard>
            ),
          },
          {
            id: "evidence-methodology",
            title: "Screening methodology and limitations",
            hashTargets: ["evidence-methodology"],
            children: (
              <>
                <section className="pilot-highlight">
                  <h2>{PILOT_FEEDBACK_COPY.guidance.heading}</h2>
                  <p>{PILOT_FEEDBACK_COPY.guidance.body}</p>
                </section>

                <SectionCard title="What this screen is">
                  <p style={{ marginTop: 0 }}>
                    Initial public-record and listing screen that consolidates
                    property, ownership, tax, and association information,
                    highlights public-risk signals, and outlines additional
                    diligence required before a buy / pass decision.
                  </p>
                  <p>
                    Preliminary screening status: <strong>{SCREENING_PILL}</strong>
                    . Internal file label remains “{recommendation}” for pilot
                    notes only — it is not a property quality rating.
                  </p>
                  <p className="muted-note">
                    Preliminary public-record screen only. This is not legal,
                    engineering, insurance, or investment advice.
                  </p>
                </SectionCard>

                <SectionCard title="Screening snapshot">
                  <DetailList
                    items={[
                      { label: "Open risk flags", value: openRisks },
                      { label: "Open items", value: openDiligence },
                      {
                        label: "Next gate",
                        value:
                          "Association budget, reserves, SIRS status, inspection status, and estoppel package",
                      },
                    ]}
                  />
                </SectionCard>

                <SectionCard
                  title="Diligence timeline"
                  subtitle="Progress from this preliminary public-record screen toward an association packet complete enough to underwrite."
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
                          <StatusPill label="Open item" tone="warn" />
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
                            Underwriting-ready packet
                          </p>
                          <StatusPill label="Pending" tone="neutral" />
                        </div>
                      </div>
                    </li>
                  </ol>
                </SectionCard>

                <SectionCard title="Still missing for underwriting">
                  {TRIAL_STILL_MISSING.map((group) => (
                    <div key={group.title}>
                      <h3 className="subsection-title">{group.title}</h3>
                      <ul>
                        {group.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </SectionCard>

                <SectionCard title="Limitations">
                  <ul>
                    <li>
                      This page consolidates public-record and listing signals
                      for a preliminary screen only.
                    </li>
                    <li>
                      Association financials, structural reports, insurance, and
                      assessment exposure are not verified here.
                    </li>
                    <li>
                      Verified facts, unverified conflicts, open items,
                      unknowns, and missing documents are labeled separately.
                    </li>
                  </ul>
                  <p className="muted-note">
                    Preliminary public-record screen only. This is not legal,
                    engineering, insurance, or investment advice.
                  </p>
                </SectionCard>

                {showPilotEndOfReviewFeedback(property) ? (
                  <PilotFeedbackCallout id="pilot-feedback-callout-methodology" />
                ) : null}
              </>
            ),
          },
        ]}
      />

      {showPilotEndOfReviewFeedback(property) ? (
        <PilotEndOfReviewFeedback />
      ) : null}
    </main>
  );
}
