import type { PropertyScreen } from "@/types/property";
import {
  PILOT_FEEDBACK_COPY,
  showPilotReviewGuidance,
} from "@/lib/pilot-feedback";

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
    <section className="pilot-highlight">
      <h2>{PILOT_FEEDBACK_COPY.guidance.heading}</h2>
      <p>{PILOT_FEEDBACK_COPY.guidance.body}</p>
    </section>
  );
}
