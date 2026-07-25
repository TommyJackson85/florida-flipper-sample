import type { PropertyScreen } from "@/types/property";
import { formatDate } from "@/lib/format";
import {
  countUnsetProFormaFields,
  labelForProvisionalStatus,
  toneForProvisionalStatus,
} from "@/lib/property-metrics";
import { DetailList } from "./DetailList";
import { StatusPill } from "./StatusPill";

type RecommendationBannerProps = {
  property: PropertyScreen;
};

function framingForStatus(property: PropertyScreen): string {
  switch (property.status?.provisionalStatus) {
    case "buy-candidate":
      return "Current screen leans positive, pending confirmation that open diligence items do not change the thesis.";
    case "pass":
      return "Current screen leans pass. Keep the record for comparison, but do not advance underwriting unless facts change.";
    case "track":
      return "Keep in the pipeline. Core public facts are usable, but association and operating inputs still gate a decision.";
    case "need-more-information":
      return "Not enough verified inputs for a buy / pass call. Use the missing-diligence list as the next work queue.";
    default:
      return "Screen outcome not set. Fill provisional status after the next diligence pass.";
  }
}

export function RecommendationBanner({ property }: RecommendationBannerProps) {
  const recommendation =
    property.status?.currentRecommendation ??
    labelForProvisionalStatus(property.status?.provisionalStatus);
  const tone = toneForProvisionalStatus(property.status?.provisionalStatus);
  const unsetProForma = countUnsetProFormaFields(property);

  return (
    <section className="recommendation-banner">
      <div className="recommendation-banner__top">
        <div>
          <h2>Screen outcome</h2>
          <p className="recommendation-banner__lede">
            {framingForStatus(property)}
          </p>
        </div>
        <StatusPill label={recommendation} tone={tone} />
      </div>

      <DetailList
        items={[
          {
            label: "Provisional status",
            value: labelForProvisionalStatus(
              property.status?.provisionalStatus
            ),
          },
          {
            label: "Hard no red flag",
            value: property.screening?.hardNoRedFlag ?? "unknown",
          },
          {
            label: "Rent supportable",
            value: property.screening?.rentSupportable ?? "unknown",
          },
          {
            label: "Association risk normal",
            value: property.screening?.associationRiskNormal ?? "unknown",
          },
          {
            label: "Target cash-on-cash",
            value: property.screening?.targetCashOnCash ?? "Not set",
          },
          {
            label: "Pro forma fields unset",
            value: `${unsetProForma} of 5`,
          },
        ]}
      />

      <div className="recommendation-banner__meta">
        <span>Tax status: {property.status?.taxStatus ?? "—"}</span>
        <span>
          Last reviewed: {formatDate(property.status?.lastReviewedAt)}
        </span>
      </div>
    </section>
  );
}
