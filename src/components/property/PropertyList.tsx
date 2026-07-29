"use client";

import { useEffect, useMemo, useState } from "react";
import type { PropertyScreen, PropertyStage } from "@/types/property";
import {
  isPropertyArchived,
  setPropertyArchivedInSession,
} from "@/lib/property-archive";
import { labelForPropertyStage } from "@/lib/property-metrics";
import { PropertyListCard } from "./PropertyListCard";

type PropertyListProps = {
  properties: PropertyScreen[];
};

type StageFilter = "all" | PropertyStage;
type KindFilter = "all" | "live" | "sample";

const STAGE_FILTERS: StageFilter[] = [
  "all",
  "lead",
  "screening",
  "diligence",
  "under-contract",
  "closing",
  "post-close",
];

const KIND_FILTERS: KindFilter[] = ["all", "live", "sample"];

function matchesSearch(property: PropertyScreen, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    property.id,
    property.address,
    property.city,
    property.zip,
    property.community,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

function matchesStage(property: PropertyScreen, stage: StageFilter): boolean {
  if (stage === "all") return true;
  return property.stage === stage;
}

function matchesKind(property: PropertyScreen, kind: KindFilter): boolean {
  if (kind === "all") return true;
  if (kind === "sample") return Boolean(property.isSample);
  return !property.isSample;
}

function stageFilterLabel(stage: StageFilter): string {
  return stage === "all" ? "All" : labelForPropertyStage(stage);
}

function kindFilterLabel(kind: KindFilter): string {
  switch (kind) {
    case "live":
      return "Live";
    case "sample":
      return "Sample";
    case "all":
    default:
      return "All";
  }
}

export function PropertyList({ properties }: PropertyListProps) {
  const [showArchived, setShowArchived] = useState(false);
  const [tick, setTick] = useState(0);
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<StageFilter>("all");
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");

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

  const pool = showArchived ? [...active, ...archived] : active;

  const visible = useMemo(
    () =>
      pool.filter(
        (property) =>
          matchesSearch(property, query) &&
          matchesStage(property, stageFilter) &&
          matchesKind(property, kindFilter)
      ),
    [pool, query, stageFilter, kindFilter]
  );

  const filtersActive =
    query.trim().length > 0 || stageFilter !== "all" || kindFilter !== "all";

  function toggleShowArchived() {
    setShowArchived((prev) => !prev);
    setTick((n) => n + 1);
  }

  function unarchiveProperty(propertyId: string) {
    setPropertyArchivedInSession(propertyId, false);
    setTick((n) => n + 1);
  }

  function clearFilters() {
    setQuery("");
    setStageFilter("all");
    setKindFilter("all");
  }

  return (
    <>
      <section className="page-intro" style={{ marginBottom: 0 }}>
        <p className="muted-note">
          {active.length} active
          {archived.length > 0 ? ` · ${archived.length} archived` : ""}
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

        <div className="intake-form" style={{ marginTop: "0.85rem" }}>
          <label>
            Search
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search address, city, ZIP, community…"
              aria-label="Search properties"
            />
          </label>
        </div>

        <p className="muted-note" style={{ marginTop: "0.65rem" }}>
          Kind
        </p>
        <div
          className="doc-state-actions"
          role="group"
          aria-label="Filter by kind"
        >
          {KIND_FILTERS.map((option) => {
            const pressed = kindFilter === option;
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
                onClick={() => setKindFilter(option)}
              >
                {kindFilterLabel(option)}
              </button>
            );
          })}
        </div>

        <p className="muted-note" style={{ marginTop: "0.65rem" }}>
          Stage
        </p>
        <div
          className="doc-state-actions"
          role="group"
          aria-label="Filter by stage"
        >
          {STAGE_FILTERS.map((option) => {
            const pressed = stageFilter === option;
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
                onClick={() => setStageFilter(option)}
              >
                {stageFilterLabel(option)}
              </button>
            );
          })}
        </div>

        <p className="muted-note" style={{ marginTop: "0.65rem" }}>
          Showing {visible.length} of {pool.length}
          {filtersActive ? (
            <>
              {" · "}
              <button
                type="button"
                className="doc-state-actions__btn"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            </>
          ) : null}
        </p>
      </section>

      {visible.length === 0 ? (
        <p className="muted-note">
          {pool.length === 0
            ? "No active properties. Show archived to reveal hidden records."
            : "No properties match these filters."}
        </p>
      ) : (
        <section className="property-grid">
          {visible.map((property) => {
            const archivedCard = isPropertyArchived(property);
            return (
              <PropertyListCard
                key={property.id}
                property={property}
                archived={archivedCard}
                onUnarchive={archivedCard ? unarchiveProperty : undefined}
              />
            );
          })}
        </section>
      )}
    </>
  );
}
