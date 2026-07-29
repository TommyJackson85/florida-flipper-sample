"use client";

import { useEffect, useMemo, useState } from "react";
import type { PropertyScreen } from "@/types/property";
import { isPropertyArchived } from "@/lib/property-archive";
import { PropertyListCard } from "./PropertyListCard";

type PropertyListProps = {
  properties: PropertyScreen[];
};

export function PropertyList({ properties }: PropertyListProps) {
  const [showArchived, setShowArchived] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setTick((n) => n + 1);
  }, []);

  const { active, archived } = useMemo(() => {
    void tick;
    const activeList: PropertyScreen[] = [];
    const archivedList: PropertyScreen[] = [];
    for (const property of properties) {
      if (isPropertyArchived(property)) {
        archivedList.push(property);
      } else {
        activeList.push(property);
      }
    }
    return { active: activeList, archived: archivedList };
  }, [properties, tick]);

  const visible = showArchived ? [...active, ...archived] : active;

  function toggleShowArchived() {
    setShowArchived((prev) => !prev);
    setTick((n) => n + 1);
  }

  return (
    <>
      <section className="page-intro" style={{ marginBottom: 0 }}>
        <p className="muted-note">
          {active.length} active
          {archived.length > 0
            ? ` · ${archived.length} archived`
            : ""}
          {" · "}
          session archive toggles clear on refresh.
        </p>
        {archived.length > 0 ? (
          <div
            className="doc-state-actions"
            style={{ marginTop: "0.5rem" }}
            role="group"
            aria-label="Archived list visibility"
          >
            <button
              type="button"
              className={
                showArchived
                  ? "doc-state-actions__btn doc-state-actions__btn--active"
                  : "doc-state-actions__btn"
              }
              aria-pressed={showArchived}
              onClick={toggleShowArchived}
            >
              {showArchived
                ? "Hide archived"
                : `Show archived (${archived.length})`}
            </button>
          </div>
        ) : null}
      </section>

      {visible.length === 0 ? (
        <p className="muted-note">
          No active properties. Show archived to reveal hidden records.
        </p>
      ) : (
        <section className="property-grid">
          {visible.map((property) => (
            <PropertyListCard
              key={property.id}
              property={property}
              archived={isPropertyArchived(property)}
            />
          ))}
        </section>
      )}
    </>
  );
}
