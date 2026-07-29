import type { PropertyScreen } from "@/types/property";

/**
 * Full blank PropertyScreen for a new deal.
 *
 * Steps:
 * 1. Copy this file to `<kebab-case-id>.ts` (example: `123-main-st-33617.ts`).
 * 2. Rename `propertyTemplate` → `property123MainSt33617` (match your id).
 * 3. Replace the identity fields marked REQUIRED below with verified facts only.
 * 4. Leave proForma null and condoRiskFlags "unknown" until you have evidence.
 * 5. Optional closingReadiness: short go/no-go items (open/done/blocked). Status is
 *    derived from item states — do not mark done/ready without evidence.
 * 6. Optional missingDocuments: named artifacts (missing/requested/received). Use
 *    requested only when an ask is noted on this screen; use received only when the
 *    package is marked in hand on this screen (status only — no file storage); optional
 *    dueDate (YYYY-MM-DD) for display urgency only; do not auto-sync from other sections.
 * 7. Optional stage: lead | screening | diligence | under-contract | closing |
 *    post-close. Display only — distinct from provisional screen outcome. Omit on
 *    sample shells.
 * 8. Optional status.recommendationHistory: prior screen outcomes (at/label/note)
 *    for display only — keep newest first; omit on sample shells.
 * 9. Optional milestones: a few deal checkpoints (label/date/status). Display only —
 *    not a calendar; omit on sample shells.
 * 10. Demo/workflow-practice records: set isSample: true and a short sampleNote.
 * 11. Register the export in `index.ts` (do not import this `_template.ts` file).
 *
 * Tip: use `/intake` to generate identity + default flags, then merge into this shape
 * when you need association / tax / identifiers / closing readiness / documents.
 */
export const propertyTemplate: PropertyScreen = {
  // REQUIRED — must match filename and URL /properties/<id>
  id: "property-id",
  title: "Deal Screen — Address",
  address: "Street address",
  city: "City",
  state: "FL",
  zip: "00000",

  // Demo records only — leave false/undefined for real underwriting files
  isSample: false,
  sampleNote: undefined,
  stage: "screening",

  // Optional identity / listing
  community: undefined,
  county: undefined,
  propertyType: "Condominium",
  unitConfiguration: undefined,
  zoning: undefined,
  yearBuilt: undefined,

  size: {
    heatedSqFt: undefined,
    grossSqFt: undefined,
  },

  pricing: {
    listingPrice: undefined,
    countyMarketValue: undefined,
    countyAssessedValue: undefined,
    taxableValueNote: undefined,
    mlsId: undefined,
  },

  identifiers: {
    pin: undefined,
    folio: undefined,
    taxAccount: undefined,
    subdivision: undefined,
    platBookPage: undefined,
  },

  ownership: {
    ownerOnTaxRoll: undefined,
    ownershipInterest: undefined,
  },

  status: {
    currentRecommendation: "Need More Information",
    provisionalStatus: "need-more-information",
    taxStatus: undefined,
    lastReviewedAt: undefined,
    recommendationHistory: undefined,
  },

  summary: {
    purpose: undefined,
    whatIsKnown: [],
    publicRiskSignals: [],
    strengths: [],
    risks: [],
  },

  taxes: {
    mostRecentPaymentAmount: undefined,
    mostRecentPaymentDate: undefined,
    annualHistory: [],
  },

  association: {
    legalName: undefined,
    entityType: undefined,
    documentNumber: undefined,
    fein: undefined,
    dateFiled: undefined,
    corporateStatus: undefined,
    principalAddress: undefined,
    registeredAgent: undefined,
    officers: [],
    annualReports: [],
    dbprStatus: [],
    officialRecordsNotes: [],
    hoaReportedNotes: undefined,
    managerNote: undefined,
  },

  missingDiligence: [],

  // Keep all unknown until researched. Use "open" only when a known gap exists.
  condoRiskFlags: {
    milestoneInspection: {
      status: "unknown",
      label: "Milestone inspection",
      note: "Not yet reviewed.",
    },
    sirsReserves: {
      status: "unknown",
      label: "SIRS / reserves",
      note: "Not yet reviewed.",
    },
    specialAssessments: {
      status: "unknown",
      label: "Special assessments",
      note: "Not yet reviewed.",
    },
    hoaDues: {
      status: "unknown",
      label: "HOA dues",
      note: "Not yet verified. Keep proForma.hoaMonthly null until confirmed.",
    },
    insurance: {
      status: "unknown",
      label: "Insurance",
      note: "Not yet researched.",
    },
    litigationOrRecords: {
      status: "unknown",
      label: "Litigation / records",
      note: "Not yet reviewed.",
    },
  },

  // Optional — omit until you have closing blockers to track; status derives from items
  closingReadiness: undefined,

  // Optional — a few deal checkpoints (label / date / done|upcoming|planned)
  milestones: undefined,

  // Optional — named diligence artifacts only (missing / requested / received)
  missingDocuments: undefined,

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

  // Example: "notes/property-02-notes.md"
  referencePaths: [],
};
