"use client";

import { useEffect, useState } from "react";
import type { PropertyScreen } from "@/types/property";
import {
  TAG_CAP,
  addPropertyTag,
  getPropertyTags,
  removePropertyTag,
} from "@/lib/property-tags";
import { SectionCard } from "./SectionCard";
import { StatusPill } from "./StatusPill";

type PropertyTagsCardProps = {
  property: PropertyScreen;
};

export function PropertyTagsCard({ property }: PropertyTagsCardProps) {
  if (property.isSample) {
    return (
      <SectionCard
        title="Tags"
        subtitle="Demo labels for grouping deals — not a taxonomy system."
      >
        <p className="muted-note">
          Practice shell — tags not used on samples.
        </p>
      </SectionCard>
    );
  }

  return <TagsInteractive property={property} />;
}

function TagsInteractive({ property }: { property: PropertyScreen }) {
  const [tags, setTags] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setTags(getPropertyTags(property));
  }, [property]);

  function addTag() {
    const next = addPropertyTag(property, draft);
    setTags(next);
    setDraft("");
  }

  function removeTag(tag: string) {
    setTags(removePropertyTag(property, tag));
  }

  const atCap = tags.length >= TAG_CAP;

  return (
    <SectionCard
      title="Tags"
      subtitle="Demo labels for this deal — this tab only; not a taxonomy system."
    >
      <div className="intake-form" style={{ marginBottom: "0.65rem" }}>
        <label>
          Add tag
          <div className="intake-form__actions" style={{ marginTop: 6 }}>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add a tag (e.g. condo, cash-only)"
              disabled={atCap}
              aria-label="New tag"
            />
            <button
              type="button"
              className="doc-state-actions__btn"
              onClick={addTag}
              disabled={atCap || !draft.trim()}
            >
              Add
            </button>
          </div>
        </label>
      </div>
      {atCap ? (
        <p className="muted-note" style={{ marginBottom: "0.5rem" }}>
          Tag limit reached ({TAG_CAP}).
        </p>
      ) : null}
      {tags.length === 0 ? (
        <p className="muted-note">No tags yet.</p>
      ) : (
        <ul className="risk-flag-list">
          {tags.map((tag) => (
            <li key={tag} className="risk-flag-row">
              <div className="risk-flag-row__main">
                <StatusPill label={tag} tone="neutral" />
                <button
                  type="button"
                  className="doc-state-actions__btn"
                  onClick={() => removeTag(tag)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
