"use client";

import { useEffect, useState } from "react";
import type { PropertyScreen } from "@/types/property";
import { isPropertyArchived } from "@/lib/property-archive";
import { StatusPill } from "./StatusPill";

type ArchivedStatusPillProps = {
  property: PropertyScreen;
};

export function ArchivedStatusPill({ property }: ArchivedStatusPillProps) {
  const [archived, setArchived] = useState(false);

  useEffect(() => {
    setArchived(isPropertyArchived(property));
  }, [property]);

  if (!archived) return null;
  return <StatusPill label="Archived" tone="neutral" />;
}
