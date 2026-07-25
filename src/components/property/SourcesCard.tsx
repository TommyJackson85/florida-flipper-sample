import type { PropertyScreen } from "@/types/property";
import { summarizeSources } from "@/lib/property-metrics";
import { StatusPill } from "./StatusPill";
import { SectionCard } from "./SectionCard";

type SourcesCardProps = {
  property: PropertyScreen;
};

function sourceTone(status: "filled" | "missing" | "note") {
  if (status === "filled") return "good" as const;
  if (status === "missing") return "bad" as const;
  return "warn" as const;
}

function sourceLabel(status: "filled" | "missing" | "note") {
  if (status === "filled") return "Linked";
  if (status === "missing") return "Missing URL";
  return "Note only";
}

export function SourcesCard({ property }: SourcesCardProps) {
  const sources = property.sources ?? [];
  const summary = summarizeSources(sources);

  return (
    <SectionCard
      title="Sources & references"
      subtitle={summary.completenessLabel}
    >
      {sources.length ? (
        <ul className="source-list">
          {sources.map((source) => (
            <li key={source.label} className="source-item">
              <div className="source-item__top">
                <span className="source-item__label">
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.label}
                    </a>
                  ) : (
                    source.label
                  )}
                </span>
                <StatusPill
                  label={sourceLabel(source.status)}
                  tone={sourceTone(source.status)}
                />
              </div>
              {source.notes ? (
                <p className="source-item__notes">{source.notes}</p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted-note">No sources recorded in structured data yet.</p>
      )}

      {(property.referencePaths?.length ?? 0) > 0 ? (
        <>
          <h3 className="subsection-title">Local research files</h3>
          <ul className="reference-list">
            {property.referencePaths?.map((path) => (
              <li key={path}>
                <code>{path}</code>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </SectionCard>
  );
}
