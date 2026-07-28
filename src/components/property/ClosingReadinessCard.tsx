import type { PropertyScreen } from "@/types/property";
import {
  deriveClosingReadinessStatus,
  labelForClosingReadiness,
  toneForClosingReadiness,
} from "@/lib/property-metrics";
import { SectionCard } from "./SectionCard";
import { StatusPill } from "./StatusPill";

type ClosingReadinessCardProps = {
  property: PropertyScreen;
};

function stateTone(state: "open" | "done" | "blocked") {
  switch (state) {
    case "done":
      return "good" as const;
    case "blocked":
      return "bad" as const;
    case "open":
    default:
      return "warn" as const;
  }
}

function stateLabel(state: "open" | "done" | "blocked") {
  switch (state) {
    case "done":
      return "Done";
    case "blocked":
      return "Blocked";
    case "open":
    default:
      return "Open";
  }
}

export function ClosingReadinessCard({ property }: ClosingReadinessCardProps) {
  if (property.isSample) {
    return (
      <SectionCard
        title="Closing readiness"
        subtitle="Go / no-go for closing — not the screen outcome."
      >
        <p className="muted-note">
          Not started — sample identity shell only. Not a live closing file.
        </p>
      </SectionCard>
    );
  }

  const readiness = property.closingReadiness;
  if (!readiness || readiness.items.length === 0) {
    return null;
  }

  const status = deriveClosingReadinessStatus(readiness);
  const openCount = readiness.items.filter((i) => i.state === "open").length;
  const blockedCount = readiness.items.filter(
    (i) => i.state === "blocked"
  ).length;
  const doneCount = readiness.items.filter((i) => i.state === "done").length;

  return (
    <SectionCard
      title="Closing readiness"
      subtitle="Go / no-go checklist for closing blockers. Separate from screen outcome, risk flags, and known missing."
    >
      <div className="risk-flag-row__main" style={{ marginBottom: "0.75rem" }}>
        <span className="muted-note">
          {doneCount} done · {openCount} open
          {blockedCount > 0 ? ` · ${blockedCount} blocked` : ""}
        </span>
        <StatusPill
          label={labelForClosingReadiness(status)}
          tone={toneForClosingReadiness(status)}
        />
      </div>
      <ul className="risk-flag-list">
        {readiness.items.map((item) => (
          <li key={item.id} className="risk-flag-row">
            <div className="risk-flag-row__main">
              <span className="risk-flag-row__label">{item.label}</span>
              <StatusPill
                label={stateLabel(item.state)}
                tone={stateTone(item.state)}
              />
            </div>
            {item.note ? (
              <p className="risk-flag-row__note">{item.note}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
