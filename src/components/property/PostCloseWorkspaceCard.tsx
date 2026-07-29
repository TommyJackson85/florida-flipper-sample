"use client";

import { useState } from "react";
import type {
  PostCloseItem,
  PostCloseItemState,
  PropertyScreen,
} from "@/types/property";
import { SectionCard } from "./SectionCard";
import { StatusPill } from "./StatusPill";

type PostCloseWorkspaceCardProps = {
  property: PropertyScreen;
};

function stateTone(state: PostCloseItemState) {
  return state === "done" ? ("good" as const) : ("warn" as const);
}

function stateLabel(state: PostCloseItemState) {
  return state === "done" ? "Done" : "Open";
}

export function PostCloseWorkspaceCard({
  property,
}: PostCloseWorkspaceCardProps) {
  if (property.isSample) {
    return null;
  }

  const seedItems = property.postCloseItems?.items ?? [];
  if (seedItems.length === 0) {
    return null;
  }

  return <PostCloseWorkspaceInteractive property={property} seedItems={seedItems} />;
}

function PostCloseWorkspaceInteractive({
  property,
  seedItems,
}: {
  property: PropertyScreen;
  seedItems: PostCloseItem[];
}) {
  const stageIsPostClose = property.stage === "post-close";
  const [forceShow, setForceShow] = useState(false);
  const [items, setItems] = useState<PostCloseItem[]>(() =>
    seedItems.map((item) => ({ ...item }))
  );

  const visible = stageIsPostClose || forceShow;
  const openCount = items.filter((item) => item.state === "open").length;
  const doneCount = items.filter((item) => item.state === "done").length;

  function setItemState(id: string, next: PostCloseItemState) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              state: next,
              note:
                next === "done"
                  ? "Marked done on this screen — demo only, not saved."
                  : "Marked open on this screen — demo only, not saved.",
            }
          : item
      )
    );
  }

  function resetToSeed() {
    setItems(seedItems.map((item) => ({ ...item })));
  }

  return (
    <SectionCard
      title="Post-close"
      subtitle="Outstanding wrap-up only — not closing readiness or accounting."
    >
      {!stageIsPostClose ? (
        <div
          className="doc-state-actions"
          style={{ marginBottom: "0.65rem" }}
          role="group"
          aria-label="Post-close workspace visibility"
        >
          <button
            type="button"
            className={
              forceShow
                ? "doc-state-actions__btn doc-state-actions__btn--active"
                : "doc-state-actions__btn"
            }
            aria-pressed={forceShow}
            onClick={() => setForceShow((prev) => !prev)}
          >
            {forceShow
              ? "Hide post-close workspace"
              : "Show post-close workspace (demo)"}
          </button>
        </div>
      ) : null}

      {!visible ? (
        <p className="muted-note">
          Hidden while stage is not Post-close. Use the demo toggle above, or set
          stage to Post-close on the board (list only — does not change this
          screen’s seed stage).
        </p>
      ) : (
        <>
          <p className="muted-note" style={{ marginTop: 0 }}>
            {doneCount} done · {openCount} open
            {openCount === 0
              ? " · No open post-close items on this screen."
              : ""}
            {" · "}
            Completing items does not archive this deal.
          </p>
          <div
            className="doc-state-actions"
            style={{ marginBottom: "0.65rem" }}
            role="group"
            aria-label="Post-close demo controls"
          >
            <button
              type="button"
              className="doc-state-actions__btn"
              onClick={resetToSeed}
            >
              Reset to seed
            </button>
          </div>
          <ul className="risk-flag-list">
            {items.map((item) => (
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
                <div
                  className="doc-state-actions"
                  style={{ marginTop: "0.45rem" }}
                  role="group"
                  aria-label={`State for ${item.label}`}
                >
                  {(["open", "done"] as PostCloseItemState[]).map((state) => {
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
        </>
      )}
    </SectionCard>
  );
}
