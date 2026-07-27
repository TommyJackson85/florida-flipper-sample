import type { PropertyScreen } from "@/types/property";

/**
 * Copy this file to `<kebab-case-id>.ts`, fill verified facts only,
 * then register the export in `index.ts`.
 * Leave underwriting values null / unknown until confirmed.
 */
export const propertyTemplate: PropertyScreen = {
  id: "property-id",
  title: "Deal Screen — Address",
  address: "Street address",
  city: "City",
  state: "FL",
  zip: "00000",

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
