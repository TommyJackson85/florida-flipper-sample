import type { PropertyScreen } from "@/types/property";
import { SectionCard } from "./SectionCard";

type KnownMissingCardProps = {
  property: PropertyScreen;
};

export function KnownMissingCard({ property }: KnownMissingCardProps) {
  const known = property.summary?.whatIsKnown ?? [];
  const risks = property.summary?.publicRiskSignals ?? [];
  const missingGroups = property.missingDiligence ?? [];

  return (
    <SectionCard
      title="Known vs missing"
      subtitle="What the public record and listing already support, versus what still blocks underwriting."
    >
      <div className="split-panel">
        <div className="split-panel__col">
          <h3>Known</h3>
          {known.length ? (
            <ul>
              {known.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="muted-note">No known items recorded yet.</p>
          )}

          {risks.length ? (
            <>
              <h3 className="subsection-title">Public-risk signals</h3>
              <ul>
                {risks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        <div className="split-panel__col">
          <h3>Still missing (work queue)</h3>
          {missingGroups.length ? (
            <div style={{ display: "grid", gap: 14 }}>
              {missingGroups.map((group) => (
                <div key={group.title}>
                  <p style={{ margin: "0 0 6px", fontWeight: 600 }}>
                    {group.title}
                  </p>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted-note">No open diligence items listed.</p>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
