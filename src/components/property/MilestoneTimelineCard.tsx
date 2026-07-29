import type {
  PropertyMilestoneStatus,
  PropertyScreen,
} from "@/types/property";
import { formatDate } from "@/lib/format";
import type { StatusTone } from "@/lib/property-metrics";
import {
  isMilestoneDueToday,
  isMilestoneOverdue,
  todayIsoDate,
} from "@/lib/property-metrics";
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
        {milestones.map((milestone) => {
          const overdue = isMilestoneOverdue(milestone, today);
          const dueToday = isMilestoneDueToday(milestone, today);
          return (
            <li key={milestone.id} className="risk-flag-row">
              <div className="risk-flag-row__main">
                <span className="risk-flag-row__label">{milestone.label}</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  <StatusPill
                    label={statusLabel(milestone.status)}
                    tone={statusTone(milestone.status)}
                  />
                  {overdue ? (
                    <StatusPill label="Overdue" tone="bad" />
                  ) : dueToday ? (
                    <StatusPill label="Due today" tone="warn" />
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
          );
        })}
      </ul>
    </SectionCard>
  );
}
