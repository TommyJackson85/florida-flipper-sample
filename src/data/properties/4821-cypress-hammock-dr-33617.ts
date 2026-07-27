import type { PropertyScreen } from "@/types/property";

/**
 * Identity-only SAMPLE shell for workflow practice.
 * Do not add tax/HOA/association/pro forma values unless converting to a real screen.
 */
export const property4821CypressHammockDr33617: PropertyScreen = {
  id: "4821-cypress-hammock-dr-33617",
  title: "SAMPLE — 4821 Cypress Hammock Dr",
  address: "4821 Cypress Hammock Dr",
  city: "Tampa",
  state: "FL",
  zip: "33617",

  isSample: true,
  sampleNote:
    "Workflow-practice sample only. Not a live underwriting file — identity fields only; do not treat as a buy/pass decision.",

  community: undefined,
  county: undefined,
  propertyType: undefined,
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
    purpose:
      "Sample identity shell for practicing the second-property workflow. Public-record, association, and underwriting inputs are intentionally unset.",
    whatIsKnown: [
      "Address provided: 4821 Cypress Hammock Dr, Tampa, FL 33617.",
    ],
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

  missingDiligence: [
    {
      title: "Identity and public records",
      items: [
        "Confirm property type, parcel/folio, and tax account from county records.",
        "Confirm ownership on tax roll.",
      ],
    },
    {
      title: "Association and condo risk (if applicable)",
      items: [
        "Confirm whether the asset is a condo / HOA community and identify the association.",
        "Obtain HOA dues, budget/reserves, SIRS/milestone, assessments, and litigation posture once entity is known.",
      ],
    },
    {
      title: "Operating assumptions",
      items: [
        "Collect verified rent, insurance, repairs, and vacancy inputs before underwriting returns.",
      ],
    },
  ],

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

  referencePaths: [],
};
