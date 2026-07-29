"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import type { PropertyScreen } from "@/types/property";
import {
  getRecentPropertyIds,
  subscribeRecentPropertyIds,
} from "@/lib/property-recents";
import { SectionCard } from "./SectionCard";

type RecentlyViewedPropertiesProps = {
  properties: PropertyScreen[];
};

function getServerSnapshot(): string[] {
  return [];
}

export function RecentlyViewedProperties({
  properties,
}: RecentlyViewedPropertiesProps) {
  const recentIds = useSyncExternalStore(
    subscribeRecentPropertyIds,
    getRecentPropertyIds,
    getServerSnapshot
  );

  const byId = new Map(properties.map((property) => [property.id, property]));
  const recent = recentIds
    .map((id) => byId.get(id))
    .filter((property): property is PropertyScreen => Boolean(property));

  return (
    <SectionCard
      title="Recently viewed"
      subtitle="This browsing session only — clears on refresh. Not pins."
    >
      {recent.length === 0 ? (
        <p className="muted-note" style={{ margin: 0 }}>
          Open a property to start a short recents list.
        </p>
      ) : (
        <ul className="risk-flag-list">
          {recent.map((property) => (
            <li key={property.id} className="risk-flag-row">
              <div className="risk-flag-row__main">
                <Link href={`/properties/${property.id}`}>
                  {property.address}
                </Link>
              </div>
              <p className="risk-flag-row__note">
                {property.city}, {property.state} {property.zip}
                {property.isSample ? " · Sample" : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
