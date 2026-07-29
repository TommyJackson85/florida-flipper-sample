"use client";

import { useState } from "react";
import type {
  MissingDocumentItem,
  MissingDocumentState,
  PropertyScreen,
} from "@/types/property";
import { formatDate } from "@/lib/format";
import type { StatusTone } from "@/lib/property-metrics";
import { SectionCard } from "./SectionCard";
import { StatusPill } from "./StatusPill";

type MissingDocumentsCardProps = {
  property: PropertyScreen;
};

type DocumentFilter = "all" | MissingDocumentState;

type ActivityEntry = {
  id: string;
  at: number;
  message: string;
};

const ACTIVITY_CAP = 12;

/** Demo preset — add-if-missing only; includes extras beyond Niagara seed. */
const CONDO_DILIGENCE_PACK: Omit<MissingDocumentItem, "state" | "note">[] = [
  { id: "estoppel-questionnaire", label: "Estoppel / condo questionnaire" },
  { id: "budget", label: "Current approved budget" },
  { id: "reserve-schedule", label: "Reserve schedule" },
  { id: "sirs", label: "Structural Integrity Reserve Study (SIRS)" },
  {
    id: "milestone-report",
    label: "Milestone / structural inspection report",
  },
  { id: "insurance-docs", label: "Master / unit insurance declarations" },
  {
    id: "special-assessment-docs",
    label: "Special assessment disclosures / related minutes",
  },
  { id: "litigation-disclosure", label: "Litigation / claims disclosure" },
  {
    id: "declaration-bylaws",
    label: "Declaration / bylaws / rules and regulations",
  },
  {
    id: "year-end-financials",
    label: "Most recent year-end financial statements",
  },
];

const STATE_ORDER: MissingDocumentState[] = [
  "missing",
  "requested",
  "received",
];

const FILTER_ORDER: DocumentFilter[] = [
  "all",
  "missing",
  "requested",
  "received",
];

function stateTone(state: MissingDocumentState): StatusTone {
  switch (state) {
    case "received":
      return "good";
    case "requested":
      return "warn";
    case "missing":
    default:
      return "bad";
  }
}

function stateLabel(state: MissingDocumentState): string {
  switch (state) {
    case "received":
      return "Received";
    case "requested":
      return "Requested";
    case "missing":
    default:
      return "Missing";
  }
}

function filterLabel(filter: DocumentFilter): string {
  return filter === "all" ? "All" : stateLabel(filter);
}

function demoNoteForState(state: MissingDocumentState): string {
  switch (state) {
    case "received":
      return "Marked received on this screen — demo only, not saved.";
    case "requested":
      return "Marked requested on this screen — demo only, not saved.";
    case "missing":
    default:
      return "Marked missing on this screen — demo only, not saved.";
  }
}

function attentionSummary(
  missingCount: number,
  requestedCount: number
): string {
  if (missingCount === 0 && requestedCount === 0) {
    return "Attention: no document follow-up on this screen.";
  }
  if (missingCount === 0) {
    return `Attention: wait on ${requestedCount} requested package${
      requestedCount === 1 ? "" : "s"
    }.`;
  }
  if (requestedCount === 0) {
    return `Attention: ask for ${missingCount} still missing.`;
  }
  return `Attention: ask for ${missingCount} still missing · wait on ${requestedCount} requested.`;
}

function focusNextSummary(items: MissingDocumentItem[]): string {
  const nextMissing = items.find((item) => item.state === "missing");
  if (nextMissing) {
    return `Focus next: ask for ${nextMissing.label}`;
  }
  const nextRequested = items.find((item) => item.state === "requested");
  if (nextRequested) {
    return `Focus next: wait on ${nextRequested.label}`;
  }
  return "Focus next: no document follow-up on this screen.";
}

function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isOverdue(item: MissingDocumentItem, today: string): boolean {
  if (!item.dueDate || item.state === "received") return false;
  return item.dueDate < today;
}

function formatActivityTime(at: number): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(at));
}

export function MissingDocumentsCard({ property }: MissingDocumentsCardProps) {
  if (property.isSample) {
    return (
      <SectionCard
        title="Missing documents"
        subtitle="Concrete diligence artifacts — not risk themes or closing go/no-go."
      >
        <p className="muted-note">
          Not started — sample identity shell only. Not a live document file.
        </p>
      </SectionCard>
    );
  }

  const seedItems = property.missingDocuments?.items ?? [];
  if (seedItems.length === 0) {
    return null;
  }

  return <MissingDocumentsInteractive seedItems={seedItems} />;
}

function MissingDocumentsInteractive({
  seedItems,
}: {
  seedItems: MissingDocumentItem[];
}) {
  const [items, setItems] = useState<MissingDocumentItem[]>(seedItems);
  const [filter, setFilter] = useState<DocumentFilter>("all");
  const [operatorNote, setOperatorNote] = useState("");
  const [activity, setActivity] = useState<ActivityEntry[]>([]);

  const today = todayIsoDate();
  const missingCount = items.filter((i) => i.state === "missing").length;
  const requestedCount = items.filter((i) => i.state === "requested").length;
  const receivedCount = items.filter((i) => i.state === "received").length;
  const overdueCount = items.filter((i) => isOverdue(i, today)).length;

  const visibleItems =
    filter === "all" ? items : items.filter((item) => item.state === filter);

  const packAdditions = CONDO_DILIGENCE_PACK.filter(
    (packItem) => !items.some((item) => item.id === packItem.id)
  );

  function appendActivity(message: string) {
    setActivity((prev) =>
      [
        {
          id: `${Date.now()}-${prev.length}`,
          at: Date.now(),
          message,
        },
        ...prev,
      ].slice(0, ACTIVITY_CAP)
    );
  }

  function setItemState(id: string, next: MissingDocumentState) {
    const current = items.find((item) => item.id === id);
    if (!current || current.state === next) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, state: next, note: demoNoteForState(next) }
          : item
      )
    );
    appendActivity(`Marked ${current.label} as ${stateLabel(next)}`);
  }

  function resetToSeed() {
    setItems(seedItems.map((item) => ({ ...item })));
    setFilter("all");
    setOperatorNote("");
    appendActivity("Reset documents to seed");
  }

  function applyCondoPack() {
    if (packAdditions.length === 0) {
      appendActivity("Applied Condo diligence pack · nothing new");
      return;
    }

    const added = packAdditions.map((packItem) => ({
      ...packItem,
      state: "missing" as const,
      note: "Added from condo diligence pack (demo).",
    }));

    setItems((prev) => [...prev, ...added]);
    appendActivity(
      `Applied Condo diligence pack · added ${added.length}`
    );
  }

  function clearOperatorNote() {
    if (!operatorNote) return;
    setOperatorNote("");
    appendActivity("Cleared operator note");
  }

  return (
    <>
    <SectionCard
      title="Missing documents"
      subtitle="Artifact status only: missing = not yet asked for on this screen · requested = ask noted here, package not in hand · received = in hand. Not closing readiness."
    >
      <p className="muted-note" style={{ marginBottom: "0.35rem" }}>
        <strong>{attentionSummary(missingCount, requestedCount)}</strong>
      </p>
      <p className="muted-note" style={{ marginBottom: "0.5rem" }}>
        {focusNextSummary(items)}
      </p>
      <p className="muted-note" style={{ marginBottom: "0.5rem" }}>
        {missingCount} missing · {requestedCount} requested · {receivedCount}{" "}
        received
        {overdueCount > 0 ? ` · ${overdueCount} overdue` : ""}
      </p>
      <div
        className="doc-state-actions"
        style={{ marginBottom: "0.5rem" }}
        role="group"
        aria-label="Demo document controls"
      >
        <button
          type="button"
          className="doc-state-actions__btn"
          onClick={applyCondoPack}
          disabled={packAdditions.length === 0}
        >
          Apply condo pack
        </button>
        <button
          type="button"
          className="doc-state-actions__btn"
          onClick={resetToSeed}
        >
          Reset to seed
        </button>
      </div>
      <p className="muted-note" style={{ marginBottom: "0.5rem" }}>
        Apply condo pack adds missing pack items only — does not change existing
        rows. Demo only — changes stay on this screen until refresh; not saved.
      </p>
      <div className="doc-operator-note">
        <div className="doc-operator-note__header">
          <span>Operator note</span>
          <button
            type="button"
            className="doc-state-actions__btn"
            onClick={clearOperatorNote}
            disabled={!operatorNote}
          >
            Clear note
          </button>
        </div>
        <textarea
          rows={2}
          value={operatorNote}
          onChange={(event) => setOperatorNote(event.target.value)}
          placeholder="Short follow-up for this screen (demo only — not saved)."
          aria-label="Operator note"
        />
      </div>
      <div
        className="doc-state-actions"
        role="group"
        aria-label="Filter documents by status"
        style={{ marginBottom: "0.75rem" }}
      >
        {FILTER_ORDER.map((option) => {
          const pressed = filter === option;
          return (
            <button
              key={option}
              type="button"
              className={
                pressed
                  ? "doc-state-actions__btn doc-state-actions__btn--active"
                  : "doc-state-actions__btn"
              }
              aria-pressed={pressed}
              onClick={() => setFilter(option)}
            >
              {filterLabel(option)}
            </button>
          );
        })}
      </div>
      {visibleItems.length === 0 ? (
        <div>
          <p className="muted-note" style={{ margin: 0 }}>
            No documents in this status filter.
          </p>
          {filter !== "all" ? (
            <div
              className="doc-state-actions"
              style={{ marginTop: "0.5rem" }}
              role="group"
              aria-label="Clear document status filter"
            >
              <button
                type="button"
                className="doc-state-actions__btn"
                onClick={() => setFilter("all")}
              >
                Show all documents
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <ul className="risk-flag-list">
          {visibleItems.map((item) => (
            <li key={item.id} className="risk-flag-row">
              <div className="risk-flag-row__main">
                <span className="risk-flag-row__label">{item.label}</span>
                <StatusPill
                  label={stateLabel(item.state)}
                  tone={stateTone(item.state)}
                />
                {isOverdue(item, today) ? (
                  <StatusPill label="Overdue" tone="bad" />
                ) : null}
              </div>
              {item.dueDate && item.state !== "received" ? (
                <p className="risk-flag-row__note">
                  Due {formatDate(item.dueDate)}
                </p>
              ) : null}
              {item.note ? (
                <p className="risk-flag-row__note">{item.note}</p>
              ) : null}
              <div
                className="doc-state-actions"
                role="group"
                aria-label={`${item.label} status`}
              >
                {STATE_ORDER.map((state) => {
                  const pressed = item.state === state;
                  return (
                    <button
                      key={state}
                      type="button"
                      className={
                        pressed
                          ? "doc-state-actions__btn doc-state-actions__btn--active"
                          : "doc-state-actions__btn"
                      }
                      aria-pressed={pressed}
                      onClick={() => setItemState(item.id, state)}
                    >
                      {stateLabel(state)}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
    <SectionCard
      title="Activity"
      subtitle="Demo only — this session on this screen; not saved."
    >
      {activity.length === 0 ? (
        <p className="muted-note">
          No activity yet this session. Status changes here will appear below.
        </p>
      ) : (
        <ul className="risk-flag-list">
          {activity.map((entry) => (
            <li key={entry.id} className="risk-flag-row">
              <div className="risk-flag-row__main">
                <span className="risk-flag-row__label">{entry.message}</span>
                <span className="muted-note">{formatActivityTime(entry.at)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
    </>
  );
}
