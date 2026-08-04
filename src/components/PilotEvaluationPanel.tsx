import Link from "next/link";
import { CopyPilotNotesTemplateButton } from "@/components/CopyPilotNotesTemplateButton";
import { SectionCard } from "@/components/property/SectionCard";

const FEEDBACK_MAILTO =
  "mailto:?subject=Deal%20Screen%20pilot%20feedback&body=" +
  encodeURIComponent(
    [
      "Deal Screen pilot feedback",
      "",
      "1. Would this screen change how you track condo diligence?",
      "",
      "2. What was clearest / most confusing?",
      "",
      "3. What’s missing before you’d use this on a live deal?",
      "",
    ].join("\n")
  );

export function PilotEvaluationPanel() {
  return (
    <SectionCard
      title="How to evaluate this pilot"
      subtitle="Short script for early users — learning about screening usefulness, not product polish."
    >
      <p className="muted-note" style={{ marginTop: 0 }}>
        <strong>Who:</strong> Operators screening a few Florida condo deals —
        not CRM or team workflows.
      </p>
      <p className="muted-note">
        <strong>Task (about 15–20 min):</strong> work one live Track screen —
        Niagara — and decide whether the deal screen is useful for diligence.
      </p>
      <ol className="pilot-eval__steps">
        <li>
          Open{" "}
          <Link href="/properties">View properties</Link>, then{" "}
          <Link href="/properties/7863-niagara-1921">
            7863 Niagara Ave #1921
          </Link>{" "}
          <strong>Track</strong> — public facts usable; association packet still
          blocks buy/pass.
        </li>
        <li>
          Read screen outcome, overview, condo risk flags, missing documents /
          known missing; skim tax, association, and screening checklist (pro
          forma stays unset where unknown).
        </li>
        <li>
          Optional:{" "}
          <Link href="/intake">Stub generator</Link> — creates TypeScript for
          the repo; it does not save a deal in the app.
        </li>
      </ol>
      <p className="muted-note">
        <strong>Real vs session:</strong> Seed / file-backed facts are the
        product. Document toggles and sample stubs stay in this browser tab
        only.
      </p>
      <p className="muted-note">
        <strong>Feedback that matters</strong> (reply by email or notes — nothing
        is captured in-app):
      </p>
      <ul className="pilot-eval__feedback">
        <li>Would this screen change how you track condo diligence?</li>
        <li>Was the Track outcome and open diligence clear?</li>
        <li>What’s missing before you’d use this on a live deal?</li>
      </ul>
      <p className="muted-note">
        <strong>Operator log:</strong> After the session, paste the template into{" "}
        <code>notes/pilot/sessions/</code> so outcomes stay in the repo. Operators:
        follow <code>notes/pilot/RUNBOOK.md</code>.
      </p>
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
