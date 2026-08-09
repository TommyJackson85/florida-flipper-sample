import type { PropertyScreen } from "@/types/property";
import { getCatalogProperties } from "@/data/properties";

export const INTAKE_STUB_SESSION_KEY = "flippers.intakePropertyStub.v1";

export const INTAKE_SAMPLE_NOTE =
  "Workflow practice only — identity shell, not a live underwriting decision.";

export type IntakeFormInput = {
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  notes: string;
  isSample: boolean;
};

export function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "new-property";
}

/** Session stubs must never reuse a catalog property id (e.g. Niagara). */
function ensureNonCatalogId(id: string): string {
  const catalogIds = new Set(
    getCatalogProperties().map((property) => property.id)
  );
  if (!catalogIds.has(id)) {
    return id;
  }
  return `${id}-session-stub`;
}

const unknownRiskFlags = {
  milestoneInspection: {
    status: "unknown" as const,
    label: "Milestone inspection",
    note: "Not yet reviewed.",
  },
  sirsReserves: {
    status: "unknown" as const,
    label: "SIRS / reserves",
    note: "Not yet reviewed.",
  },
  specialAssessments: {
    status: "unknown" as const,
    label: "Special assessments",
    note: "Not yet reviewed.",
  },
  hoaDues: {
    status: "unknown" as const,
    label: "HOA dues",
    note: "Not yet verified. Keep proForma.hoaMonthly null until confirmed.",
  },
  insurance: {
    status: "unknown" as const,
    label: "Insurance",
    note: "Not yet researched.",
  },
  litigationOrRecords: {
    status: "unknown" as const,
    label: "Litigation / records",
    note: "Not yet reviewed.",
  },
};

/** Build a PropertyScreen from intake fields. Demo open-stub path should force sample. */
export function buildPropertyFromIntake(
  form: IntakeFormInput,
  options?: { forceSample?: boolean }
): PropertyScreen {
  const isSample = options?.forceSample ? true : form.isSample;
  const id = ensureNonCatalogId(slugify(`${form.address}-${form.zip}`));
  let title =
    form.title.trim() ||
    `Deal Screen — ${form.address.trim() || "Address"}`;
  if (isSample && !title.toUpperCase().includes("SAMPLE")) {
    title = `SAMPLE — ${title}`;
  }

  const notes = form.notes.trim();

  return {
    id,
    title,
    address: form.address.trim() || "Street address",
    city: form.city.trim() || "City",
    state: form.state.trim() || "FL",
    zip: form.zip.trim() || "00000",
    county: form.county.trim() || undefined,
    isSample: isSample ? true : undefined,
    sampleNote: isSample ? INTAKE_SAMPLE_NOTE : undefined,
    propertyType: isSample ? undefined : "Condominium",
    stage: isSample ? undefined : "screening",
    status: {
      currentRecommendation: "Need More Information",
      provisionalStatus: "need-more-information",
    },
    summary: {
      purpose: isSample
        ? "Sample identity shell for workflow practice. Underwriting inputs are intentionally unset."
        : undefined,
      whatIsKnown: notes ? [notes] : [],
      publicRiskSignals: [],
      strengths: [],
      risks: [],
    },
    taxes: {
      annualHistory: [],
    },
    missingDiligence: [],
    condoRiskFlags: unknownRiskFlags,
    screening: {
      targetCashOnCash: null,
      hardNoRedFlag: "unknown",
      rentSupportable: "unknown",
      associationRiskNormal: "unknown",
    },
    proForma: {
      expectedMarketRentMonthly: null,
      hoaMonthly: null,
      insuranceAnnual: null,
      repairsAnnual: null,
      vacancyRate: null,
    },
    sources: [],
    referencePaths: [],
  };
}

export function saveIntakeStubToSession(property: PropertyScreen): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(
    INTAKE_STUB_SESSION_KEY,
    JSON.stringify(property)
  );
}

export function loadIntakeStubFromSession(): PropertyScreen | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(INTAKE_STUB_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PropertyScreen;
  } catch {
    return null;
  }
}

/**
 * Clone a property into a Sample session stub for another workflow pass.
 * Carries identity / public-record facts; resets decision and workflow state.
 */
export function duplicatePropertyAsDemoStub(
  source: PropertyScreen
): PropertyScreen {
  const baseId = source.id.replace(/-demo-copy(-\d+)?$/, "");
  const id = ensureNonCatalogId(`${baseId}-demo-copy`);
  const addressLabel = source.address || baseId;
  let title = `SAMPLE — Copy of ${addressLabel}`;
  if (source.title && !source.title.toUpperCase().includes("SAMPLE")) {
    title = `SAMPLE — Copy of ${source.title}`;
  } else if (source.title?.toUpperCase().includes("SAMPLE")) {
    title = source.title.includes("Copy of")
      ? source.title
      : `SAMPLE — Copy of ${addressLabel}`;
  }

  return {
    id,
    title,
    address: source.address,
    city: source.city,
    state: source.state,
    zip: source.zip,
    community: source.community,
    county: source.county,
    propertyType: source.propertyType,
    unitConfiguration: source.unitConfiguration,
    zoning: source.zoning,
    yearBuilt: source.yearBuilt,
    size: source.size ? { ...source.size } : undefined,
    pricing: source.pricing ? { ...source.pricing } : undefined,
    identifiers: source.identifiers ? { ...source.identifiers } : undefined,
    ownership: source.ownership ? { ...source.ownership } : undefined,
    isSample: true,
    sampleNote: `Cloned demo stub from ${source.id} · session only — not a live underwriting file.`,
    stage: undefined,
    tags: undefined,
    status: {
      currentRecommendation: "Need More Information",
      provisionalStatus: "need-more-information",
    },
    summary: {
      purpose:
        "Cloned Sample shell for another workflow pass. Decision fields reset; re-verify before underwriting.",
      whatIsKnown: [...(source.summary?.whatIsKnown ?? [])],
      publicRiskSignals: [...(source.summary?.publicRiskSignals ?? [])],
      strengths: [],
      risks: [],
    },
    taxes: source.taxes
      ? {
          mostRecentPaymentAmount: source.taxes.mostRecentPaymentAmount,
          mostRecentPaymentDate: source.taxes.mostRecentPaymentDate,
          annualHistory: source.taxes.annualHistory.map((row) => ({ ...row })),
        }
      : { annualHistory: [] },
    association: source.association
      ? {
          ...source.association,
          officers: [...(source.association.officers ?? [])],
          annualReports: [...(source.association.annualReports ?? [])],
          dbprStatus: [...(source.association.dbprStatus ?? [])],
          officialRecordsNotes: (
            source.association.officialRecordsNotes ?? []
          ).map((note) => ({ ...note })),
        }
      : undefined,
    missingDiligence: (source.missingDiligence ?? []).map((group) => ({
      title: group.title,
      items: [...group.items],
    })),
    condoRiskFlags: {
      milestoneInspection: { ...unknownRiskFlags.milestoneInspection },
      sirsReserves: { ...unknownRiskFlags.sirsReserves },
      specialAssessments: { ...unknownRiskFlags.specialAssessments },
      hoaDues: { ...unknownRiskFlags.hoaDues },
      insurance: { ...unknownRiskFlags.insurance },
      litigationOrRecords: { ...unknownRiskFlags.litigationOrRecords },
    },
    closingReadiness: undefined,
    milestones: undefined,
    missingDocuments: undefined,
    postCloseItems: undefined,
    screening: {
      targetCashOnCash: null,
      hardNoRedFlag: "unknown",
      rentSupportable: "unknown",
      associationRiskNormal: "unknown",
    },
    proForma: {
      expectedMarketRentMonthly: null,
      hoaMonthly: null,
      insuranceAnnual: null,
      repairsAnnual: null,
      vacancyRate: null,
    },
    sources: (source.sources ?? []).map((entry) => ({ ...entry })),
    referencePaths: [...(source.referencePaths ?? [])],
  };
}
