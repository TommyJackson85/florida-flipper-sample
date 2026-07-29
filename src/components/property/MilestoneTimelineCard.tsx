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

function markerModifier(
  status: PropertyMilestoneStatus,
  overdue: boolean,
  dueToday: boolean
): string {
  if (overdue) return "deal-timeline__marker--overdue";
  if (dueToday) return "deal-timeline__marker--due-today";
  if (status === "done") return "deal-timeline__marker--done";
  if (status === "upcoming") return "deal-timeline__marker--upcoming";
  return "deal-timeline__marker--planned";
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
      title="Deal timeline"
      subtitle="Read-only checkpoint sequence — not a calendar or schedule editor."
    >
      <ol className="deal-timeline" aria-label="Deal milestone timeline">
        {milestones.map((milestone) => {
          const overdue = isMilestoneOverdue(milestone, today);
          const dueToday = isMilestoneDueToday(milestone, today);
          return (
            <li key={milestone.id} className="deal-timeline__item">
              <div
                className={`deal-timeline__marker ${markerModifier(
                  milestone.status,
                  overdue,
                  dueToday
                )}`}
                aria-hidden="true"
              />
              <div className="deal-timeline__content">
                <div className="deal-timeline__header">
                  <time
                    className="deal-timeline__date"
                    dateTime={milestone.date}
                  >
                    {formatDate(milestone.date)}
                  </time>
                  <div className="deal-timeline__pills">
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
                <p className="deal-timeline__label">{milestone.label}</p>
                {milestone.note ? (
                  <p className="deal-timeline__note">{milestone.note}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </SectionCard>
  );
}
