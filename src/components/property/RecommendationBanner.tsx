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

const HISTORY_CAP = 3;

function framingForStatus(property: PropertyScreen): string {
  if (property.isSample) {
    return "Sample / workflow-practice record. This is not a live underwriting decision — use it to practice intake and registration only.";
  }

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
  const isSample = Boolean(property.isSample);
  const recommendation = isSample
    ? "Sample — not underwritten"
    : property.status?.currentRecommendation ??
      labelForProvisionalStatus(property.status?.provisionalStatus);
  const tone = isSample
    ? "warn"
    : toneForProvisionalStatus(property.status?.provisionalStatus);
  const history = isSample
    ? []
    : (property.status?.recommendationHistory ?? []).slice(0, HISTORY_CAP);

  return (
    <section className="recommendation-banner">
      <div className="recommendation-banner__top">
        <div>
          <h2>{isSample ? "Sample status" : "Screen outcome"}</h2>
          <p className="recommendation-banner__lede">
            {framingForStatus(property)}
          </p>
        </div>
        <StatusPill label={recommendation} tone={tone} />
      </div>

      <div className="recommendation-banner__meta">
        {isSample ? (
          <span>Underwriting sections intentionally unset</span>
        ) : (
          <span>Tax: {property.status?.taxStatus ?? "—"}</span>
        )}
        <span>
          Last reviewed: {formatDate(property.status?.lastReviewedAt)}
        </span>
      </div>

      {history.length > 0 ? (
        <div style={{ marginTop: "0.85rem" }}>
          <p
            className="muted-note"
            style={{ marginBottom: "0.4rem", fontWeight: 600 }}
          >
            Recent recommendations
          </p>
          <ul className="risk-flag-list">
            {history.map((entry) => (
              <li key={`${entry.at}-${entry.label}`} className="risk-flag-row">
                <div className="risk-flag-row__main">
                  <span className="risk-flag-row__label">{entry.label}</span>
                  <span className="muted-note">{formatDate(entry.at)}</span>
                </div>
                {entry.note ? (
                  <p className="risk-flag-row__note">{entry.note}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
