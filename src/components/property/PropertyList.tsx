"use client";

import { useEffect, useMemo, useState } from "react";
import type { PropertyScreen, PropertyStage } from "@/types/property";
import {
  isPropertyArchived,
  setPropertyArchivedInSession,
} from "@/lib/property-archive";
import {
  countMissingDiligenceItems,
  deriveProgressSummary,
  labelForPropertyStage,
  milestoneUrgencyLabel,
  nextMilestone,
} from "@/lib/property-metrics";
import {
  collectUniqueTags,
  getPropertyTags,
} from "@/lib/property-tags";
import {
  countPinnedAmong,
  isPropertyPinned,
  setPropertyPinnedInSession,
} from "@/lib/property-pinning";
import {
  type StageOverrides,
  withEffectiveStage,
} from "@/lib/property-stage";
import { PropertyBoard } from "./PropertyBoard";
import { PropertyBulkActions } from "./PropertyBulkActions";
import { PropertyListCard } from "./PropertyListCard";
import { PortfolioOverview } from "./PortfolioOverview";
import {
  PropertyViewPresets,
  type ViewPresetId,
} from "./PropertyViewPresets";
import { WorkspaceQuickActions } from "./WorkspaceQuickActions";

type PropertyListProps = {
  properties: PropertyScreen[];
};

type ViewMode = "list" | "board";
type StageFilter = "all" | PropertyStage;
type KindFilter = "all" | "live" | "sample";
type SortOption = "address" | "stage" | "diligence";
type TagFilter = "all" | string;
type PinFilter = "all" | "pinned";

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

const SORT_OPTIONS: SortOption[] = ["address", "stage", "diligence"];

const STAGE_RANK: Record<PropertyStage, number> = {
  lead: 0,
  screening: 1,
  diligence: 2,
  "under-contract": 3,
  closing: 4,
  "post-close": 5,
};

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

function matchesTag(property: PropertyScreen, tag: TagFilter): boolean {
  if (tag === "all") return true;
  return getPropertyTags(property).some(
    (entry) => entry.toLowerCase() === tag.toLowerCase()
  );
}

function matchesPin(property: PropertyScreen, pin: PinFilter): boolean {
  if (pin === "all") return true;
  return isPropertyPinned(property);
}

function hasOpenPostClose(property: PropertyScreen): boolean {
  return (property.postCloseItems?.items ?? []).some(
    (item) => item.state === "open"
  );
}

function matchesViewPreset(
  property: PropertyScreen,
  preset: ViewPresetId | null
): boolean {
  if (!preset || preset === "all-active" || preset === "pinned") {
    return true;
  }

  if (property.isSample) return false;

  if (preset === "needs-attention") {
    const progress = deriveProgressSummary(property);
    return (
      progress?.status === "needs-attention" ||
      progress?.status === "blocked"
    );
  }

  if (preset === "dates-due") {
    const milestone = nextMilestone(property.milestones);
    const urgency = milestone ? milestoneUrgencyLabel(milestone) : null;
    return urgency === "Overdue" || urgency === "Due today";
  }

  if (preset === "post-close") {
    return property.stage === "post-close" || hasOpenPostClose(property);
  }

  return true;
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

function sortOptionLabel(sort: SortOption): string {
  switch (sort) {
    case "stage":
      return "Stage";
    case "diligence":
      return "Open diligence";
    case "address":
    default:
      return "Address";
  }
}

function addressKey(property: PropertyScreen): string {
  return property.address.toLowerCase();
}

function stageRank(property: PropertyScreen): number {
  if (!property.stage) return STAGE_RANK["post-close"] + 1;
  return STAGE_RANK[property.stage];
}

function compareProperties(
  a: PropertyScreen,
  b: PropertyScreen,
  sort: SortOption
): number {
  const pinnedDiff =
    Number(isPropertyPinned(b)) - Number(isPropertyPinned(a));
  if (pinnedDiff !== 0) return pinnedDiff;

  if (sort === "stage") {
    const byStage = stageRank(a) - stageRank(b);
    if (byStage !== 0) return byStage;
  } else if (sort === "diligence") {
    const byDiligence =
      countMissingDiligenceItems(b) - countMissingDiligenceItems(a);
    if (byDiligence !== 0) return byDiligence;
  }

  return addressKey(a).localeCompare(addressKey(b));
}

export function PropertyList({ properties }: PropertyListProps) {
  const [showArchived, setShowArchived] = useState(false);
  const [tick, setTick] = useState(0);
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<StageFilter>("all");
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [tagFilter, setTagFilter] = useState<TagFilter>("all");
  const [pinFilter, setPinFilter] = useState<PinFilter>("all");
  const [sort, setSort] = useState<SortOption>("address");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [stageOverrides, setStageOverrides] = useState<StageOverrides>({});
  const [activePreset, setActivePreset] = useState<ViewPresetId | null>(
    "all-active"
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setTick((n) => n + 1);
  }, []);

  function clearPresetHighlight() {
    setActivePreset(null);
  }

  function applyViewPreset(preset: ViewPresetId) {
    setQuery("");
    setTagFilter("all");
    setStageFilter("all");
    setShowArchived(false);
    setActivePreset(preset);
    setSelectedIds([]);

    if (preset === "all-active") {
      setKindFilter("all");
      setPinFilter("all");
      setSort("address");
      return;
    }

    if (preset === "pinned") {
      setKindFilter("all");
      setPinFilter("pinned");
      setSort("address");
      return;
    }

    // Soft signal presets: live deals only
    setKindFilter("live");
    setPinFilter("all");
    setSort("address");
  }

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

  const availableTags = useMemo(() => {
    void tick;
    return collectUniqueTags(pool);
  }, [pool, tick]);

  const pinnedCount = useMemo(() => {
    void tick;
    return countPinnedAmong(pool);
  }, [pool, tick]);

  const needsAttentionHref = useMemo(() => {
    void tick;
    const target = properties.find((property) => {
      if (property.isSample || isPropertyArchived(property)) return false;
      const progress = deriveProgressSummary(property);
      return (
        progress?.status === "needs-attention" ||
        progress?.status === "blocked"
      );
    });
    return target ? `/properties/${target.id}` : null;
  }, [properties, tick]);

  const visible = useMemo(() => {
    const filtered = pool
      .map((property) => withEffectiveStage(property, stageOverrides))
      .filter(
        (property) =>
          matchesSearch(property, query) &&
          matchesStage(property, stageFilter) &&
          matchesKind(property, kindFilter) &&
          matchesTag(property, tagFilter) &&
          matchesPin(property, pinFilter) &&
          matchesViewPreset(property, activePreset)
      );
    return [...filtered].sort((a, b) => compareProperties(a, b, sort));
  }, [
    pool,
    query,
    stageFilter,
    kindFilter,
    tagFilter,
    pinFilter,
    sort,
    tick,
    stageOverrides,
    activePreset,
  ]);

  const selectedVisible = useMemo(() => {
    const visibleIds = new Set(visible.map((property) => property.id));
    return selectedIds.filter((id) => visibleIds.has(id));
  }, [selectedIds, visible]);

  const selectedProperties = useMemo(
    () =>
      visible.filter((property) => selectedVisible.includes(property.id)),
    [visible, selectedVisible]
  );

  const canArchiveSelected = selectedProperties.some(
    (property) => !isPropertyArchived(property)
  );
  const canRestoreSelected = selectedProperties.some((property) =>
    isPropertyArchived(property)
  );
  const allVisibleSelected =
    visible.length > 0 && selectedVisible.length === visible.length;

  const filtersActive =
    query.trim().length > 0 ||
    stageFilter !== "all" ||
    kindFilter !== "all" ||
    tagFilter !== "all" ||
    pinFilter !== "all" ||
    (activePreset !== null && activePreset !== "all-active");

  function toggleShowArchived() {
    clearPresetHighlight();
    setShowArchived((prev) => !prev);
    setTick((n) => n + 1);
  }

  function unarchiveProperty(propertyId: string) {
    setPropertyArchivedInSession(propertyId, false);
    setTick((n) => n + 1);
  }

  function togglePin(_propertyId: string) {
    setTick((n) => n + 1);
  }

  function setStage(propertyId: string, stage: PropertyStage | null) {
    setStageOverrides((prev) => ({ ...prev, [propertyId]: stage }));
  }

  function clearFilters() {
    setQuery("");
    setStageFilter("all");
    setKindFilter("all");
    setTagFilter("all");
    setPinFilter("all");
    setActivePreset("all-active");
    setShowArchived(false);
    setSelectedIds([]);
  }

  function toggleSelect(propertyId: string) {
    setSelectedIds((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  }

  function selectAllVisible() {
    setSelectedIds(visible.map((property) => property.id));
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  function bulkPin(pinned: boolean) {
    for (const id of selectedVisible) {
      setPropertyPinnedInSession(id, pinned);
    }
    setTick((n) => n + 1);
  }

  function bulkArchive(archived: boolean) {
    for (const id of selectedVisible) {
      setPropertyArchivedInSession(id, archived);
    }
    setSelectedIds([]);
    setTick((n) => n + 1);
  }

  return (
    <>
      <PortfolioOverview properties={properties} tick={tick} />

      <WorkspaceQuickActions
        viewMode={viewMode}
        pinFilterActive={pinFilter === "pinned"}
        showArchived={showArchived}
        archivedCount={archived.length}
        needsAttentionHref={needsAttentionHref}
        onShowBoard={() => setViewMode("board")}
        onShowPinned={() => applyViewPreset("pinned")}
        onToggleArchived={toggleShowArchived}
      />

      <PropertyViewPresets
        activePreset={activePreset}
        onSelect={applyViewPreset}
      />

      {viewMode === "list" ? (
        <PropertyBulkActions
          selectedCount={selectedVisible.length}
          canArchive={canArchiveSelected}
          canRestore={canRestoreSelected}
          allVisibleSelected={allVisibleSelected}
          onSelectAllVisible={selectAllVisible}
          onClear={clearSelection}
          onPin={() => bulkPin(true)}
          onUnpin={() => bulkPin(false)}
          onArchive={() => bulkArchive(true)}
          onRestore={() => bulkArchive(false)}
        />
      ) : null}

      <section className="page-intro" style={{ marginBottom: 0 }}>
        <p className="muted-note">
          {active.length} active
          {archived.length > 0 ? ` · ${archived.length} archived` : ""}
          {pinnedCount > 0 ? ` · ${pinnedCount} pinned` : ""}
          {" · "}
          session pin/archive toggles stay in this tab
          {viewMode === "board"
            ? "; board stage moves reset on refresh."
            : "."}
        </p>

        <p className="muted-note" style={{ marginTop: "0.65rem" }}>
          View
        </p>
        <div
          className="doc-state-actions"
          role="group"
          aria-label="Property view mode"
        >
          <button
            type="button"
            className={
              viewMode === "list"
                ? "doc-state-actions__btn doc-state-actions__btn--active"
                : "doc-state-actions__btn"
            }
            aria-pressed={viewMode === "list"}
            onClick={() => setViewMode("list")}
          >
            List
          </button>
          <button
            type="button"
            className={
              viewMode === "board"
                ? "doc-state-actions__btn doc-state-actions__btn--active"
                : "doc-state-actions__btn"
            }
            aria-pressed={viewMode === "board"}
            onClick={() => setViewMode("board")}
          >
            Board
          </button>
        </div>

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
              onChange={(event) => {
                clearPresetHighlight();
                setQuery(event.target.value);
              }}
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
                onClick={() => {
                  clearPresetHighlight();
                  setKindFilter(option);
                }}
              >
                {kindFilterLabel(option)}
              </button>
            );
          })}
        </div>

        <p className="muted-note" style={{ marginTop: "0.65rem" }}>
          Pinned
        </p>
        <div
          className="doc-state-actions"
          role="group"
          aria-label="Filter by pinned"
        >
          <button
            type="button"
            className={
              pinFilter === "all"
                ? "doc-state-actions__btn doc-state-actions__btn--active"
                : "doc-state-actions__btn"
            }
            aria-pressed={pinFilter === "all"}
            onClick={() => {
              clearPresetHighlight();
              setPinFilter("all");
            }}
          >
            All
          </button>
          <button
            type="button"
            className={
              pinFilter === "pinned"
                ? "doc-state-actions__btn doc-state-actions__btn--active"
                : "doc-state-actions__btn"
            }
            aria-pressed={pinFilter === "pinned"}
            onClick={() => {
              clearPresetHighlight();
              setPinFilter("pinned");
            }}
          >
            Pinned{pinnedCount > 0 ? ` (${pinnedCount})` : ""}
          </button>
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
                onClick={() => {
                  clearPresetHighlight();
                  setStageFilter(option);
                }}
              >
                {stageFilterLabel(option)}
              </button>
            );
          })}
        </div>

        {availableTags.length > 0 ? (
          <>
            <p className="muted-note" style={{ marginTop: "0.65rem" }}>
              Tag
            </p>
            <div
              className="doc-state-actions"
              role="group"
              aria-label="Filter by tag"
            >
              <button
                type="button"
                className={
                  tagFilter === "all"
                    ? "doc-state-actions__btn doc-state-actions__btn--active"
                    : "doc-state-actions__btn"
                }
                aria-pressed={tagFilter === "all"}
                onClick={() => {
                  clearPresetHighlight();
                  setTagFilter("all");
                }}
              >
                All
              </button>
              {availableTags.map((tag) => {
                const pressed = tagFilter.toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={tag}
                    type="button"
                    className={
                      pressed
                        ? "doc-state-actions__btn doc-state-actions__btn--active"
                        : "doc-state-actions__btn"
                    }
                    aria-pressed={pressed}
                    onClick={() => {
                      clearPresetHighlight();
                      setTagFilter(tag);
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </>
        ) : null}

        {viewMode === "list" ? (
          <>
            <p className="muted-note" style={{ marginTop: "0.65rem" }}>
              Sort
            </p>
            <div
              className="doc-state-actions"
              role="group"
              aria-label="Sort properties"
            >
              {SORT_OPTIONS.map((option) => {
                const pressed = sort === option;
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
                    onClick={() => {
                      clearPresetHighlight();
                      setSort(option);
                    }}
                  >
                    {sortOptionLabel(option)}
                  </button>
                );
              })}
            </div>
          </>
        ) : null}

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
      ) : viewMode === "board" ? (
        <PropertyBoard
          properties={visible}
          isArchived={isPropertyArchived}
          onStageChange={setStage}
        />
      ) : (
        <section className="property-grid">
          {visible.map((property) => {
            const archivedCard = isPropertyArchived(property);
            const pinnedCard = isPropertyPinned(property);
            return (
              <PropertyListCard
                key={property.id}
                property={property}
                archived={archivedCard}
                pinned={pinnedCard}
                selected={selectedVisible.includes(property.id)}
                onUnarchive={archivedCard ? unarchiveProperty : undefined}
                onTogglePin={togglePin}
                onToggleSelect={toggleSelect}
              />
            );
          })}
        </section>
      )}
    </>
  );
}
