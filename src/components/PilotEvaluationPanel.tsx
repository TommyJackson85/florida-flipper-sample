import { CopyPilotNotesTemplateButton } from "@/components/CopyPilotNotesTemplateButton";
import { SectionCard } from "@/components/property/SectionCard";

const FEEDBACK_MAILTO =
  "mailto:?subject=Deal%20Screen%20pilot%20feedback&body=" +
  encodeURIComponent(
    [
      "Deal Screen pilot feedback",
      "",
      "1. Was the screening format clear and trustworthy?",
      "",
      "2. If you could enter one of your own deals and receive a screen like this, what minimum information would you be willing to provide?",
      "",
      "3. What was missing, confusing, or hard to trust?",
      "",
    ].join("\n")
  );

export function PilotEvaluationPanel() {
  return (
    <SectionCard title="What to do">
      <p className="muted-note" style={{ marginTop: 0 }}>
        Open the sample deal screen and review it as if you were deciding
        whether to continue diligence. Check the recommendation, risk flags,
        missing documents, tax, association information, and sources.
      </p>
      <p className="muted-note">
        <strong>Afterwards, tell us:</strong>
      </p>
      <ul className="pilot-eval__feedback">
        <li>Was the screening format clear and trustworthy?</li>
        <li>
          If you could enter one of your own deals and receive a screen like
          this, what minimum information would you be willing to provide?
        </li>
        <li>What was missing, confusing, or hard to trust?</li>
      </ul>
      <div
        className="doc-state-actions"
        style={{ marginTop: "0.75rem" }}
        role="group"
        aria-label="Pilot feedback actions"
      >
        <a href={FEEDBACK_MAILTO} className="button-secondary">
          Draft feedback email
        </a>
        <CopyPilotNotesTemplateButton />
      </div>
    </SectionCard>
  );
}
