export type TaxYear = {
  year: number;
  amount: number;
  status: "paid" | "due" | "unknown";
  paidDate?: string;
  notes?: string;
};

export type AssociationRecordNote = {
  title: string;
  summary: string;
  riskLevel?: "low" | "medium" | "high";
};

export type MissingItemGroup = {
  title: string;
  items: string[];
};

export type SourceEntry = {
  label: string;
  url?: string;
  status: "filled" | "missing" | "note";
  notes?: string;
};

export type ProvisionalStatus =
  | "buy-candidate"
  | "track"
  | "pass"
  | "need-more-information";

export type TriState = "yes" | "no" | "unknown";

export type PropertyScreen = {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;

  community?: string;
  county?: string;
  propertyType?: string;
  unitConfiguration?: string;
  zoning?: string;
  yearBuilt?: number;

  size?: {
    heatedSqFt?: number;
    grossSqFt?: number;
  };

  pricing?: {
    listingPrice?: number;
    countyMarketValue?: number;
    countyAssessedValue?: number;
    taxableValueNote?: string;
    mlsId?: string;
  };

  identifiers?: {
    pin?: string;
    folio?: string;
    taxAccount?: string;
    subdivision?: string;
    platBookPage?: string;
  };

  ownership?: {
    ownerOnTaxRoll?: string;
    ownershipInterest?: string;
  };

  status?: {
    /** Human-readable screen outcome shown in the UI */
    currentRecommendation?: string;
    provisionalStatus?: ProvisionalStatus;
    taxStatus?: string;
    lastReviewedAt?: string;
  };

  summary?: {
    purpose?: string;
    whatIsKnown?: string[];
    publicRiskSignals?: string[];
    strengths?: string[];
    risks?: string[];
  };

  taxes?: {
    mostRecentPaymentAmount?: number;
    mostRecentPaymentDate?: string;
    annualHistory: TaxYear[];
  };

  association?: {
    legalName?: string;
    entityType?: string;
    documentNumber?: string;
    fein?: string;
    dateFiled?: string;
    corporateStatus?: string;
    principalAddress?: string;
    registeredAgent?: string;
    officers?: string[];
    annualReports?: string[];
    dbprStatus?: string[];
    officialRecordsNotes?: AssociationRecordNote[];
    /** Listing-reported HOA figures that are not yet verified */
    hoaReportedNotes?: string;
    managerNote?: string;
  };

  missingDiligence?: MissingItemGroup[];

  screening?: {
    targetCashOnCash?: string | null;
    hardNoRedFlag?: TriState;
    rentSupportable?: TriState;
    associationRiskNormal?: TriState;
  };

  proForma?: {
    expectedMarketRentMonthly?: number | null;
    /** Verified HOA only — leave null until confirmed */
    hoaMonthly?: number | null;
    insuranceAnnual?: number | null;
    repairsAnnual?: number | null;
    vacancyRate?: number | null;
  };

  sources?: SourceEntry[];

  /** Paths to local memo / notes / sources files for this property */
  referencePaths?: string[];
};
