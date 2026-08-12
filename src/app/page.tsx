import Link from "next/link";
import { TRIAL_BUILD } from "@/lib/trial-build";

/** Seeded sample deal shown in trial — example output, not the product itself. */
const SAMPLE_DEAL_HREF = "/properties/7863-niagara-1921";

export default function HomePage() {
  return (
    <main className="page-stack">
      <section className="page-intro">
        <h1>Condo Clear: Florida Condo Due Diligence, Simplified.</h1>
        <p>
          Review your next Florida condo opportunity in minutes. We highlight
          risk flags, catch missing diligence, and recommend your next step.
          Built for solo investors who need quick answers, not a CRM.
        </p>
        {TRIAL_BUILD ? (
          <p
            className="muted-note"
            style={{ marginTop: "0.65rem", fontStyle: "italic" }}
          >
            This pilot features a completed sample deal. Take a look and let us
            know if this format would help you close safer, faster deals.
          </p>
        ) : (
          <p className="muted-note" style={{ marginTop: "0.65rem" }}>
            Demo workspace — full screening shell.
          </p>
        )}
      </section>

      <section className="home-cta">
        <h2>Start here</h2>
        <p>
          Explore a completed Florida condo screening example, including risk
          flags, missing diligence, tax, association information, sources, and a
          recommended next step.
        </p>
        <div className="home-cta__actions">
          <Link href={SAMPLE_DEAL_HREF} className="button-primary">
            View sample deal screen
          </Link>
          <Link href="/properties" className="home-cta__secondary-link">
            View properties
          </Link>
          {TRIAL_BUILD ? null : (
            <Link href="/intake" className="button-secondary">
              Generate property stub (developer)
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
