import type { PropertyScreen } from "@/types/property";

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
  const id = slugify(`${form.address}-${form.zip}`);
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
