import { PilotFeedbackActions } from "@/components/PilotFeedbackActions";
import { SectionCard } from "@/components/property/SectionCard";
import { getPilotFeedbackFormUrl } from "@/lib/pilot-feedback";

export function PilotEvaluationPanel() {
  const formUrl = getPilotFeedbackFormUrl();

  return (
    <SectionCard title="Share feedback">
      <p className="muted-note" style={{ marginTop: 0 }}>
        Takes about 2 minutes. Tell us what was useful, what was unclear, and
        what you would need before using this on a real deal.
      </p>
      <PilotFeedbackActions formUrl={formUrl} />
    </SectionCard>
  );
}
