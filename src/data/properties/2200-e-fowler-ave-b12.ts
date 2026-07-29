import type { PropertyScreen } from "@/types/property";

/**
 * Pilot contrast screen — Pass.
 * Walk-away driven by association disclosure signals (litigation + special assessment).
 * Pro forma / verified HOA $ intentionally null. Identity is a coherent demo file for
 * screening comparison, not a claim of a live off-market mandate.
 */
export const property2200EFowlerAveB12: PropertyScreen = {
  id: "2200-e-fowler-ave-b12",
  title: "Florida Deal Screen — 2200 E Fowler Ave #B12",
  address: "2200 E Fowler Ave #B12",
  city: "Tampa",
  state: "FL",
  zip: "33612",

  stage: "screening",
  tags: ["condo", "hillsborough", "pass"],

  milestones: [
    {
      id: "intake-complete",
      label: "Intake complete",
      date: "2026-07-08",
      status: "done",
      note: "Identity and listing pass registered.",
    },
    {
      id: "association-disclosure-review",
      label: "Association disclosure review",
      date: "2026-07-18",
      status: "done",
      note: "Litigation summary and special-assessment notice reviewed on this screen.",
    },
    {
      id: "pass-decision",
      label: "Pass decision",
      date: "2026-07-22",
      status: "done",
      note: "Hard-no association risk — stop before underwriting returns.",
    },
  ],

  community: "Fowler Court Condominium — Building B, Unit 12",
  county: "Hillsborough County",
  propertyType: "Condominium",
  unitConfiguration: "1 bed / 1 bath",
  zoning: "Multifamily (county use code condo)",
  yearBuilt: 1979,

  size: {
    heatedSqFt: 780,
    grossSqFt: 820,
  },

  pricing: {
    listingPrice: 129000,
    countyMarketValue: 118500,
    countyAssessedValue: 118500,
    taxableValueNote: "Homestead not claimed on tax roll snapshot used for this screen.",
    mlsId: undefined,
  },

  identifiers: {
    pin: undefined,
    folio: "demo-fowler-b12",
    taxAccount: undefined,
    subdivision: "Fowler Court Condominium",
    platBookPage: undefined,
  },

  ownership: {
    ownerOnTaxRoll: "Recorded owner on tax roll (redacted on this demo screen)",
    ownershipInterest: "Condo unit + undivided interest in common elements (exact % not pulled)",
  },

  status: {
    currentRecommendation: "Pass",
    provisionalStatus: "pass",
    taxStatus: "Paid — no delinquency flagged on the tax snapshot used for this screen",
    lastReviewedAt: "2026-07-22",
    recommendationHistory: [
      {
        at: "2026-07-22",
        label: "Pass",
        note: "Association disclosures showed material litigation exposure and a large approved special assessment.",
      },
      {
        at: "2026-07-12",
        label: "Need more information",
        note: "Held for association packet after public identity looked usable.",
      },
    ],
  },

  summary: {
    purpose:
      "Pilot contrast screen: Pass after association disclosures — not a returns underwrite. Compare with Niagara (Track). Folio/PIN left incomplete where not verified; HOA $ and rent stay null.",
    whatIsKnown: [
      "Older low-rise condo inventory near the USF / Fowler corridor.",
      "Public tax snapshot used for this screen showed no current delinquency.",
      "Association disclosure packet (on this screen) described active material litigation and an approved special assessment for building envelope / concrete work.",
      "No verified HOA dues, rent, or insurance premium — pro forma left null.",
    ],
    publicRiskSignals: [
      "1979 vintage elevates association structural / reserve diligence.",
      "Material association litigation is a hard-no for this operator screen until cleared — not cleared here.",
      "Approved special assessment creates near-term cash call risk independent of unit condition marketing.",
      "Returns were not modeled; Pass is governance/risk driven, not a CoC calculation.",
    ],
    strengths: [
      "Tax snapshot used for this screen did not show current delinquency.",
      "Decision can be made without inventing rent or HOA dollars.",
      "Clear stop-gate documented for pilot comparison against Track deals.",
    ],
    risks: [
      "Association litigation exposure summarized in disclosure notes — not a full docket review.",
      "Special assessment amount/schedule only partially described in the packet notes on this screen.",
      "SIRS / milestone posture still incomplete; not required to Pass once hard-no flags fired.",
      "Listing condition claims were not used as underwriting evidence.",
    ],
  },

  taxes: {
    mostRecentPaymentAmount: 1420,
    mostRecentPaymentDate: "2025-11-12",
    annualHistory: [
      {
        year: 2025,
        amount: 1420,
        status: "paid",
        paidDate: "2025-11-12",
        notes: "From tax snapshot used for this screen — verify before live underwriting.",
      },
      {
        year: 2024,
        amount: 1310,
        status: "paid",
        paidDate: "2024-11-08",
      },
      {
        year: 2023,
        amount: 1188,
        status: "paid",
        paidDate: "2023-11-20",
      },
    ],
  },

  association: {
    legalName: "Fowler Court Condominium Association, Inc.",
    entityType: "Florida not-for-profit corporation (condo association)",
    documentNumber: undefined,
    fein: undefined,
    dateFiled: undefined,
    corporateStatus: "Active (per association packet cover sheet on this screen)",
    principalAddress: undefined,
    registeredAgent: undefined,
    officers: [],
    annualReports: [],
    dbprStatus: [
      "Managing entity named in disclosure packet — DBPR deep-link not pasted on this screen.",
    ],
    officialRecordsNotes: [
      {
        title: "Special assessment — building envelope / concrete",
        summary:
          "Association notice describes an approved special assessment for building envelope and concrete restoration. Exact owner share and payment schedule only partially stated in the packet notes used here.",
        riskLevel: "high",
      },
      {
        title: "Material litigation disclosure",
        summary:
          "Disclosure summary references active association litigation related to construction / warranty claims. Treated as a hard-no on this operator screen until cleared with counsel — not cleared.",
        riskLevel: "high",
      },
    ],
    hoaReportedNotes:
      "Listing HOA figure seen during selection was not verified. Leave proForma.hoaMonthly null.",
    managerNote: "Management company named in packet — contact not verified for this demo screen.",
  },

  missingDiligence: [
    {
      title: "Association / governance (hard-no triggered)",
      items: [
        "Material litigation disclosure reviewed — Pass without full docket pull.",
        "Special assessment notice reviewed — Pass without full payment schedule confirmation.",
        "SIRS / milestone not obtained; not required once hard-no fired.",
      ],
    },
    {
      title: "Operating assumptions (intentionally stopped)",
      items: [
        "Verified HOA dues, rent, insurance, and vacancy were not collected after Pass.",
        "No pro forma built — returns not the decision basis.",
      ],
    },
  ],

  condoRiskFlags: {
    milestoneInspection: {
      status: "open",
      label: "Milestone inspection",
      note: "No milestone / structural report on file for this building. Not pursued after Pass.",
    },
    sirsReserves: {
      status: "open",
      label: "SIRS / reserves",
      note: "Budget / SIRS packet not obtained. Not pursued after Pass.",
    },
    specialAssessments: {
      status: "open",
      label: "Special assessments",
      note: "Approved special assessment disclosed — hard-no contributor on this screen.",
    },
    hoaDues: {
      status: "unknown",
      label: "HOA dues (unverified)",
      note: "Listing figure unverified. Leave proForma.hoaMonthly null.",
    },
    insurance: {
      status: "unknown",
      label: "Insurance",
      note: "Not researched after Pass decision.",
    },
    litigationOrRecords: {
      status: "open",
      label: "Litigation / records",
      note: "Material association litigation disclosed — hard-no on this operator screen.",
    },
  },

  closingReadiness: {
    items: [
      {
        id: "litigation-clear",
        label: "Litigation clear",
        state: "blocked",
        note: "Material litigation disclosure — blocked for this operator.",
      },
      {
        id: "special-assessment-clear",
        label: "Special assessment acceptable",
        state: "blocked",
        note: "Approved assessment disclosed — blocked pending amount/schedule clarity; Pass chosen instead.",
      },
      {
        id: "hoa-estoppel",
        label: "HOA / estoppel",
        state: "open",
        note: "Not pursued after Pass.",
      },
      {
        id: "sirs-reserves",
        label: "SIRS / reserves",
        state: "open",
        note: "Not pursued after Pass.",
      },
    ],
  },

  missingDocuments: {
    items: [
      {
        id: "litigation-disclosure",
        label: "Litigation / claims disclosure",
        state: "received",
        note: "Reviewed on this screen — basis for Pass.",
      },
      {
        id: "special-assessment-docs",
        label: "Special assessment notice / related minutes",
        state: "received",
        note: "Reviewed on this screen — basis for Pass.",
      },
      {
        id: "estoppel-questionnaire",
        label: "Estoppel / condo questionnaire",
        state: "missing",
        note: "Not requested after Pass.",
      },
      {
        id: "budget",
        label: "Current approved budget",
        state: "missing",
        note: "Not requested after Pass.",
      },
      {
        id: "sirs",
        label: "Structural Integrity Reserve Study (SIRS)",
        state: "missing",
        note: "Not requested after Pass.",
      },
      {
        id: "milestone-report",
        label: "Milestone / structural inspection report",
        state: "missing",
        note: "Not requested after Pass.",
      },
    ],
  },

  screening: {
    targetCashOnCash: null,
    hardNoRedFlag: "yes",
    rentSupportable: "unknown",
    associationRiskNormal: "no",
  },

  proForma: {
    expectedMarketRentMonthly: null,
    hoaMonthly: null,
    insuranceAnnual: null,
    repairsAnnual: null,
    vacancyRate: null,
  },

  sources: [
    {
      label: "Association disclosure packet (local file)",
      status: "note",
      notes:
        "Litigation summary + special assessment notice reviewed for this screen. Path not published in-app.",
    },
    {
      label: "Hillsborough County Property Appraiser",
      status: "note",
      notes: "Tax snapshot used for paid status / assessed value — re-verify before any live file.",
    },
    {
      label: "Listing / brokerage materials",
      status: "note",
      notes: "Used for selection only; not treated as verified HOA or condition evidence.",
    },
  ],

  referencePaths: [
    "memos/property-02-fowler-pass-memo.md",
    "notes/property-02-fowler-pass-notes.md",
    "sources/property-02-fowler-pass-sources.md",
  ],
};
