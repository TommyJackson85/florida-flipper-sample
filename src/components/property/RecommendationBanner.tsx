import type { PropertyScreen } from "@/types/property";
import { formatDate } from "@/lib/format";
import {
  labelForProvisionalStatus,
  toneForProvisionalStatus,
} from "@/lib/property-metrics";
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
      return "Not enough verified inputs for a buy / pass call. Use the risk flags and missing-diligence list as the next work queue.";
    default:
      return "Screen outcome not set. Fill provisional status after the next diligence pass.";
  }
}

export function RecommendationBanner({ property }: RecommendationBannerProps) {
  const recommendation =
    property.status?.currentRecommendation ??
    labelForProvisionalStatus(property.status?.provisionalStatus);
  const tone = toneForProvisionalStatus(property.status?.provisionalStatus);

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

      <div className="recommendation-banner__meta">
        <span>
          Status:{" "}
          {labelForProvisionalStatus(property.status?.provisionalStatus)}
        </span>
        <span>Tax: {property.status?.taxStatus ?? "—"}</span>
        <span>
          Last reviewed: {formatDate(property.status?.lastReviewedAt)}
        </span>
      </div>
    </section>
  );
}
