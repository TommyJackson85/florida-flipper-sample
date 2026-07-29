"use client";

import type { PropertyScreen, PropertyStage } from "@/types/property";
import {
  labelForPropertyStage,
} from "@/lib/property-metrics";
import { isPropertyPinned } from "@/lib/property-pinning";
import { PROPERTY_STAGES } from "@/lib/property-stage";
import { PropertyBoardCard } from "./PropertyBoardCard";

type PropertyBoardProps = {
  properties: PropertyScreen[];
  isArchived: (property: PropertyScreen) => boolean;
  onStageChange: (propertyId: string, stage: PropertyStage | null) => void;
};

type BoardColumnId = PropertyStage | "unstaged";

const BOARD_COLUMNS: BoardColumnId[] = [...PROPERTY_STAGES, "unstaged"];

function columnLabel(column: BoardColumnId): string {
  return column === "unstaged" ? "Unstaged" : labelForPropertyStage(column);
}

function columnIdFor(property: PropertyScreen): BoardColumnId {
  return property.stage ?? "unstaged";
}

function compareBoardCards(a: PropertyScreen, b: PropertyScreen): number {
  const pinnedDiff =
    Number(isPropertyPinned(b)) - Number(isPropertyPinned(a));
  if (pinnedDiff !== 0) return pinnedDiff;
  return a.address.toLowerCase().localeCompare(b.address.toLowerCase());
}

export function PropertyBoard({
  properties,
  isArchived,
  onStageChange,
}: PropertyBoardProps) {
  return (
    <section className="property-board" aria-label="Property stage board">
      <p className="muted-note" style={{ marginBottom: "0.75rem" }}>
        Demo board — stage moves reset on refresh. Not a shared pipeline.
      </p>
      <div className="property-board__columns">
        {BOARD_COLUMNS.map((column) => {
          const cards = properties
            .filter((property) => columnIdFor(property) === column)
            .sort(compareBoardCards);
          return (
            <div key={column} className="property-board__column">
              <div className="property-board__column-header">
                <h2>{columnLabel(column)}</h2>
                <span className="muted-note">{cards.length}</span>
              </div>
              {cards.length === 0 ? (
                <p className="muted-note property-board__empty">
                  No deals in this stage.
                </p>
              ) : (
                <div className="property-board__cards">
                  {cards.map((property) => (
                    <PropertyBoardCard
                      key={property.id}
                      property={property}
                      archived={isArchived(property)}
                      onStageChange={onStageChange}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
