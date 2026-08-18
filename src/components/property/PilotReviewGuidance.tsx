import type { PropertyScreen } from "@/types/property";
import { showPilotReviewGuidance } from "@/lib/pilot-feedback";

type PilotReviewGuidanceProps = {
  property: PropertyScreen;
};

/**
 * Brief pilot orientation — Niagara and Fowler only. Sits below the property
 * header and above the screening recommendation.
 */
export function PilotReviewGuidance({ property }: PilotReviewGuidanceProps) {
  if (!showPilotReviewGuidance(property)) {
    return null;
  }

  return (
    <section className="pilot-review-guidance">
      <h2>Review this Florida condo opportunity</h2>
      <p>
        Review the recommendation, risk flags, and missing diligence for this
        sample property. Condo Clear offers a quick screening view for solo
        investors — not a CRM. When you finish, the short review questionnaire
        is at the bottom of this page.
      </p>
    </section>
  );
}
