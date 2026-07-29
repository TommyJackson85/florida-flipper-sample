"use client";

import { useEffect, useState } from "react";
import type { PropertyScreen } from "@/types/property";
import { isPropertyPinned } from "@/lib/property-pinning";
import { StatusPill } from "./StatusPill";

type PinnedStatusPillProps = {
  property: PropertyScreen;
};

export function PinnedStatusPill({ property }: PinnedStatusPillProps) {
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    setPinned(isPropertyPinned(property));
  }, [property]);

  if (!pinned) return null;
  return <StatusPill label="Pinned" tone="warn" />;
}
