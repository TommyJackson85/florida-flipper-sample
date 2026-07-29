import type {
  PropertyMilestone,
  PropertyMilestoneStatus,
  PropertyScreen,
} from "@/types/property";
import { formatDate } from "@/lib/format";
import type { StatusTone } from "@/lib/property-metrics";
import { SectionCard } from "./SectionCard";
import { StatusPill } from "./StatusPill";

type MilestoneTimelineCardProps = {
  property: PropertyScreen;
};

function statusTone(status: PropertyMilestoneStatus): StatusTone {
  switch (status) {
    case "done":
      return "good";
    case "upcoming":
      return "warn";
    case "planned":
    default:
      return "neutral";
  }
}

function statusLabel(status: PropertyMilestoneStatus): string {
  switch (status) {
    case "done":
      return "Done";
    case "upcoming":
      return "Upcoming";
    case "planned":
    default:
      return "Planned";
  }
}

function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isOverdue(milestone: PropertyMilestone, today: string): boolean {
  return milestone.status === "upcoming" && milestone.date < today;
}

export function MilestoneTimelineCard({
  property,
}: MilestoneTimelineCardProps) {
  if (property.isSample) {
    return null;
  }

  const milestones = [...(property.milestones ?? [])].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  if (milestones.length === 0) {
    return null;
  }

  const today = todayIsoDate();

  return (
    <SectionCard
      title="Milestones"
      subtitle="Deal checkpoints only — not a calendar or task board."
    >
      <ul className="risk-flag-list">
        {milestones.map((milestone) => (
          <li key={milestone.id} className="risk-flag-row">
            <div className="risk-flag-row__main">
              <span className="risk-flag-row__label">{milestone.label}</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <StatusPill
                  label={statusLabel(milestone.status)}
                  tone={statusTone(milestone.status)}
                />
                {isOverdue(milestone, today) ? (
                  <StatusPill label="Overdue" tone="bad" />
                ) : null}
              </div>
            </div>
            <p className="risk-flag-row__note">
              {formatDate(milestone.date)}
            </p>
            {milestone.note ? (
              <p className="risk-flag-row__note">{milestone.note}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
