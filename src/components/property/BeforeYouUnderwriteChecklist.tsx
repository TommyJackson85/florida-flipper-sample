import type { PropertyScreen } from "@/types/property";
import { SectionCard } from "./SectionCard";
import type { StatusTone } from "@/lib/property-metrics";
import { StatusPill } from "./StatusPill";

type BeforeYouUnderwriteChecklistProps = {
  property: PropertyScreen;
};

type ChecklistItem = {
  label: string;
  status: string;
  tone: StatusTone;
  note: string;
  evidenceLabel: string;
  evidenceHref: string;
};

function buildChecklistItems(property: PropertyScreen): ChecklistItem[] {
  const docs = property.missingDocuments?.items ?? [];
  const budget = docs.find((item) => item.id === "budget");
  const reserve = docs.find((item) => item.id === "reserve-schedule");
  const sirs = docs.find((item) => item.id === "sirs");
  const milestone = docs.find((item) => item.id === "milestone-report");
  const estoppel = docs.find((item) => item.id === "estoppel-questionnaire");
  const specialAssessment = docs.find(
    (item) => item.id === "special-assessment-docs"
  );
  const insurance = property.condoRiskFlags?.insurance;
  const hoaDues = property.condoRiskFlags?.hoaDues;
  const litigation = property.condoRiskFlags?.litigationOrRecords;

  return [
    {
      label: "Current approved association budget",
      status: budget?.state === "requested" ? "Requested" : "Missing",
      tone: budget?.state === "requested" ? "warn" : "bad",
      note: budget?.note ?? "Open item: requested, packet not in hand.",
      evidenceLabel: "Document evidence",
      evidenceHref: "#evidence-missing-documents",
    },
    {
      label:
        "Reserve schedule and Structural Integrity Reserve Study (SIRS), if applicable",
      status: "Missing",
      tone: "bad",
      note:
        reserve?.note && sirs?.note
          ? "Missing on this screen — both remain required before underwriting."
          : "Missing on this screen — both remain required before underwriting.",
      evidenceLabel: "Document evidence",
      evidenceHref: "#evidence-missing-documents",
    },
    {
      label: "Milestone or structural inspection report, if applicable",
      status: "Missing",
      tone: "bad",
      note:
        milestone?.note ??
        "Missing: no building/phase inspection report on this screen.",
      evidenceLabel: "Risk flags",
      evidenceHref: "#evidence-risk-flags",
    },
    {
      label: "Current estoppel or condominium questionnaire",
      status: estoppel?.state === "received" ? "Received" : "Missing",
      tone: estoppel?.state === "received" ? "good" : "bad",
      note:
        estoppel?.note ??
        "Received on this screen — still review for restrictions and claims.",
      evidenceLabel: "Document evidence",
      evidenceHref: "#evidence-missing-documents",
    },
    {
      label: "Special-assessment disclosures and recent board-meeting minutes",
      status: "Missing",
      tone: "bad",
      note: specialAssessment?.note ?? "Missing on this screen.",
      evidenceLabel: "Document evidence",
      evidenceHref: "#evidence-missing-documents",
    },
    {
      label: "Master insurance declarations and deductible information",
      status: insurance?.status === "unknown" ? "Unknown" : "Open item",
      tone: "neutral",
      note:
        insurance?.note ??
        "Unknown: insurance posture has not been researched on this screen.",
      evidenceLabel: "Risk flags",
      evidenceHref: "#evidence-risk-flags",
    },
    {
      label: "Written confirmation of monthly HOA dues and inclusions",
      status: "Unverified",
      tone: "warn",
      note:
        hoaDues?.note ??
        "Unverified: listing sources conflict (~$376 vs ~$499). Do not rely on either figure yet.",
      evidenceLabel: "Association context",
      evidenceHref: "#evidence-association",
    },
    {
      label:
        "Material litigation, claims, and major capital-project disclosures",
      status: "Missing",
      tone: "bad",
      note:
        litigation?.note ??
        "Open item / missing disclosure: collection-activity signal exists; material claims remain unconfirmed.",
      evidenceLabel: "Association context",
      evidenceHref: "#evidence-association",
    },
  ];
}

/**
 * Pre-underwriting checklist mapped to missing documents and risk flags.
 */
export function BeforeYouUnderwriteChecklist({
  property,
}: BeforeYouUnderwriteChecklistProps) {
  const items = buildChecklistItems(property);

  return (
    <SectionCard
      id="before-you-underwrite"
      title="Before you underwrite"
      subtitle="Request and review these association records before treating listing or public figures as underwriting inputs."
    >
      <ul className="underwrite-checklist">
        {items.map((item) => (
          <li key={item.label} className="underwrite-checklist__item">
            <div className="underwrite-checklist__main trial-status-row">
              <span className="underwrite-checklist__label">{item.label}</span>
              <StatusPill label={item.status} tone={item.tone} />
            </div>
            <p className="underwrite-checklist__note">{item.note}</p>
            <p className="underwrite-checklist__evidence">
              <a href={item.evidenceHref}>{item.evidenceLabel}</a>
            </p>
          </li>
        ))}
      </ul>
      <p className="underwrite-checklist__disclaimer muted-note">
        Confirm association details with the association, manager, estoppel, and
        qualified professionals. Preliminary public-record screen only. This is
        not legal, engineering, insurance, or investment advice.
      </p>
    </SectionCard>
  );
}
