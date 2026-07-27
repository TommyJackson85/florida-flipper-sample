import type { PropertyScreen } from "@/types/property";

/**
 * Full blank PropertyScreen for a new deal.
 *
 * Steps:
 * 1. Copy this file to `<kebab-case-id>.ts` (example: `123-main-st-33617.ts`).
 * 2. Rename `propertyTemplate` → `property123MainSt33617` (match your id).
 * 3. Replace the identity fields marked REQUIRED below with verified facts only.
 * 4. Leave proForma null and condoRiskFlags "unknown" until you have evidence.
 * 5. Register the export in `index.ts` (do not import this `_template.ts` file).
 *
 * Tip: use `/intake` to generate identity + default flags, then merge into this shape
 * when you need association / tax / identifier sections.
 */
export const propertyTemplate: PropertyScreen = {
  // REQUIRED — must match filename and URL /properties/<id>
  id: "property-id",
  title: "Deal Screen — Address",
  address: "Street address",
  city: "City",
  state: "FL",
  zip: "00000",

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
