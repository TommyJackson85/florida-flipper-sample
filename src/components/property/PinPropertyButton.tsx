"use client";

import { useEffect, useState } from "react";
import type { PropertyScreen } from "@/types/property";
import {
  isPropertyPinned,
  setPropertyPinnedInSession,
} from "@/lib/property-pinning";

type PinPropertyButtonProps = {
  property: PropertyScreen;
  onToggle?: () => void;
};

export function PinPropertyButton({
  property,
  onToggle,
}: PinPropertyButtonProps) {
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    setPinned(isPropertyPinned(property));
  }, [property]);

  function toggle() {
    const next = !pinned;
    setPropertyPinnedInSession(property.id, next);
    setPinned(next);
    onToggle?.();
  }

  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <div
        className="doc-state-actions"
        role="group"
        aria-label="Pin actions"
      >
        <button
          type="button"
          className={
            pinned
              ? "doc-state-actions__btn doc-state-actions__btn--active"
              : "doc-state-actions__btn"
          }
          aria-pressed={pinned}
          onClick={toggle}
        >
          {pinned ? "Unpin" : "Pin"}
        </button>
      </div>
      <p className="muted-note" style={{ marginTop: "0.35rem" }}>
        Keeps this deal at the top of the list in this tab. Does not change
        archive or stage.
      </p>
    </div>
  );
}
