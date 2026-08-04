import Link from "next/link";
import { PilotEvaluationPanel } from "@/components/PilotEvaluationPanel";
import { TRIAL_BUILD } from "@/lib/trial-build";

export default function HomePage() {
  return (
    <main className="page-stack">
      <section className="page-intro">
        <h1>Florida condo deal screening</h1>
        <p>
          Structured screening for a small number of opportunities — not a CRM
          or collaboration platform. Facts live in TypeScript data files; memos
          and notes stay as reference.
        </p>
        <p className="muted-note" style={{ marginTop: "0.65rem" }}>
          Pilot build — file-based screens only.
        </p>
      </section>

      <section className="home-cta">
        <h2>Start here</h2>
        <p>
          Open the seeded Niagara deal to review risk flags, missing diligence,
          and the Track screening outcome.
        </p>
        <div className="home-cta__actions">
          <Link href="/properties" className="button-primary">
            View properties
          </Link>
          <Link href="/intake" className="button-secondary">
            Generate property stub (developer)
          </Link>
        </div>
      </section>

      {TRIAL_BUILD ? <PilotEvaluationPanel /> : null}
    </main>
  );
}
