"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { PropertyScreen } from "@/types/property";
import {
  isPropertyArchived,
  setPropertyArchivedInSession,
} from "@/lib/property-archive";

type ArchivePropertyButtonProps = {
  property: PropertyScreen;
};

export function ArchivePropertyButton({
  property,
}: ArchivePropertyButtonProps) {
  const router = useRouter();
  const [archived, setArchived] = useState(false);

  useEffect(() => {
    setArchived(isPropertyArchived(property));
  }, [property]);

  function toggle() {
    const next = !archived;
    setPropertyArchivedInSession(property.id, next);
    setArchived(next);
    router.refresh();
  }

  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <div
        className="doc-state-actions"
        role="group"
        aria-label="Archive actions"
      >
        <button
          type="button"
          className="doc-state-actions__btn"
          onClick={toggle}
        >
          {archived ? "Unarchive" : "Archive"}
        </button>
      </div>
      <p className="muted-note" style={{ marginTop: "0.35rem" }}>
        {archived
          ? "Archived for this tab — hidden from the main list unless shown. Does not delete the record."
          : "Hides this property from the main list in this tab. Does not delete the record."}
      </p>
    </div>
  );
}
