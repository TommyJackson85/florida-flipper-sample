import type { PropertyScreen } from "@/types/property";
import { formatUnknownLabel } from "@/lib/format";
import { DetailList } from "./DetailList";
import { SectionCard } from "./SectionCard";

type ScreeningCardProps = {
  property: PropertyScreen;
};

export function ScreeningCard({ property }: ScreeningCardProps) {
  return (
    <SectionCard
      title="Underwriting checklist"
      subtitle="Gate questions for the next diligence pass. Unknown means not yet decided."
    >
      <DetailList
        items={[
          {
            label: "Target cash-on-cash",
            value: property.screening?.targetCashOnCash ?? "Not set",
          },
          {
            label: "Hard no red flag",
            value: formatUnknownLabel(property.screening?.hardNoRedFlag),
          },
          {
            label: "Rent supportable",
            value: formatUnknownLabel(property.screening?.rentSupportable),
          },
          {
            label: "Association risk normal",
            value: formatUnknownLabel(property.screening?.associationRiskNormal),
          },
          {
            label: "Verified HOA (monthly)",
            value:
              property.proForma?.hoaMonthly === null ||
              property.proForma?.hoaMonthly === undefined
                ? "Unverified"
                : property.proForma.hoaMonthly,
          },
          {
            label: "Expected rent (monthly)",
            value:
              property.proForma?.expectedMarketRentMonthly === null ||
              property.proForma?.expectedMarketRentMonthly === undefined
                ? "Not set"
                : property.proForma.expectedMarketRentMonthly,
          },
        ]}
      />
      {property.association?.hoaReportedNotes ? (
        <p className="muted-note" style={{ marginTop: 14 }}>
          {property.association.hoaReportedNotes}
        </p>
      ) : null}
    </SectionCard>
  );
}
