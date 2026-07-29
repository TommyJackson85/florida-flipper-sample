"use client";

import { useEffect } from "react";
import { recordPropertyView } from "@/lib/property-recents";

type RecordPropertyViewProps = {
  propertyId: string;
};

/** Records a detail open into the in-memory recents list. */
export function RecordPropertyView({ propertyId }: RecordPropertyViewProps) {
  useEffect(() => {
    recordPropertyView(propertyId);
  }, [propertyId]);

  return null;
}
