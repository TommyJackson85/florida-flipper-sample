"use client";

import { useState } from "react";
import type { MissingItemGroup, PropertyScreen } from "@/types/property";
import type { StatusTone } from "@/lib/property-metrics";
import { SectionCard } from "./SectionCard";
import { StatusPill } from "./StatusPill";

type KnownMissingCardProps = {
  property: PropertyScreen;
};

type ActionStatus = "open" | "done";

type ActionItem = {
  id: string;
  title: string;
  groupTitle: string;
  status: ActionStatus;
};

const STATUS_ORDER: ActionStatus[] = ["open", "done"];

function statusTone(status: ActionStatus): StatusTone {
  return status === "done" ? "good" : "warn";
}

function statusLabel(status: ActionStatus): string {
  return status === "done" ? "Done" : "Open";
}

function flattenMissingDiligence(groups: MissingItemGroup[]): ActionItem[] {
  return groups.flatMap((group) =>
    group.items.map((title) => ({
      id: `${group.title}::${title}`,
      title,
      groupTitle: group.title,
      status: "open" as const,
    }))
  );
}

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
          {property.isSample ? (
            <StaticMissingQueue groups={missingGroups} />
          ) : (
            <ActionItemsQueue seedGroups={missingGroups} />
          )}
        </div>
      </div>
    </SectionCard>
  );
}

function StaticMissingQueue({ groups }: { groups: MissingItemGroup[] }) {
  if (!groups.length) {
    return <p className="muted-note">No open diligence items listed.</p>;
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {groups.map((group) => (
        <div key={group.title}>
          <p style={{ margin: "0 0 6px", fontWeight: 600 }}>{group.title}</p>
          <ul>
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ActionItemsQueue({
  seedGroups,
}: {
  seedGroups: MissingItemGroup[];
}) {
  const seedItems = flattenMissingDiligence(seedGroups);
  const [items, setItems] = useState<ActionItem[]>(seedItems);

  if (seedItems.length === 0) {
    return <p className="muted-note">No open diligence items listed.</p>;
  }

  const openCount = items.filter((item) => item.status === "open").length;
  const doneCount = items.filter((item) => item.status === "done").length;

  function setItemStatus(id: string, next: ActionStatus) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.status !== next
          ? { ...item, status: next }
          : item
      )
    );
  }

  function resetStatuses() {
    setItems(seedItems.map((item) => ({ ...item, status: "open" as const })));
  }

  return (
    <>
      <p className="muted-note" style={{ marginBottom: "0.5rem" }}>
        {openCount} open · {doneCount} done
      </p>
      <div
        className="doc-state-actions"
        style={{ marginBottom: "0.5rem" }}
        role="group"
        aria-label="Demo action-item controls"
      >
        <button
          type="button"
          className="doc-state-actions__btn"
          onClick={resetStatuses}
        >
          Reset statuses
        </button>
      </div>
      <p className="muted-note" style={{ marginBottom: "0.75rem" }}>
        Demo only — statuses stay on this screen until refresh; not saved.
      </p>
      <ul className="risk-flag-list">
        {items.map((item) => (
          <li key={item.id} className="risk-flag-row">
            <div className="risk-flag-row__main">
              <span className="risk-flag-row__label">{item.title}</span>
              <StatusPill
                label={statusLabel(item.status)}
                tone={statusTone(item.status)}
              />
            </div>
            <p className="risk-flag-row__note">{item.groupTitle}</p>
            <div
              className="doc-state-actions"
              role="group"
              aria-label={`${item.title} status`}
            >
              {STATUS_ORDER.map((status) => {
                const pressed = item.status === status;
                return (
                  <button
                    key={status}
                    type="button"
                    className={
                      pressed
                        ? "doc-state-actions__btn doc-state-actions__btn--active"
                        : "doc-state-actions__btn"
                    }
                    aria-pressed={pressed}
                    onClick={() => setItemStatus(item.id, status)}
                  >
                    {statusLabel(status)}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
