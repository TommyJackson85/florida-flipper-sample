"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { PropertyScreen } from "@/types/property";
import { isPropertyArchived } from "@/lib/property-archive";
import {
  deriveProgressSummary,
  labelForProgressSummary,
  milestoneUrgencyLabel,
  nextMilestone,
} from "@/lib/property-metrics";
import { isPropertyPinned } from "@/lib/property-pinning";
import { SectionCard } from "./SectionCard";
import { StatusPill } from "./StatusPill";

type PortfolioOverviewProps = {
  properties: PropertyScreen[];
  /** Bump when session pin/archive overlays change. */
  tick?: number;
};

function countOpenPostClose(property: PropertyScreen): number {
  return (property.postCloseItems?.items ?? []).filter(
    (item) => item.state === "open"
  ).length;
}

export function PortfolioOverview({
  properties,
  tick = 0,
}: PortfolioOverviewProps) {
  const snapshot = useMemo(() => {
    void tick;
    const active: PropertyScreen[] = [];
    const archived: PropertyScreen[] = [];
    for (const property of properties) {
      if (isPropertyArchived(property)) {
        archived.push(property);
      } else {
        active.push(property);
      }
    }

    const liveActive = active.filter((property) => !property.isSample);
    const samples = properties.filter((property) => property.isSample).length;
    const pinned = active.filter((property) => isPropertyPinned(property)).length;

    const needsAttention = liveActive.filter((property) => {
      const progress = deriveProgressSummary(property);
      return (
        progress?.status === "needs-attention" ||
        progress?.status === "blocked"
      );
    });

    const datesDue = liveActive.filter((property) => {
      const milestone = nextMilestone(property.milestones);
      const urgency = milestone ? milestoneUrgencyLabel(milestone) : null;
      return urgency === "Overdue" || urgency === "Due today";
    });

    const postCloseOutstanding = liveActive.filter(
      (property) => countOpenPostClose(property) > 0
    );

    return {
      activeCount: active.length,
      archivedCount: archived.length,
      pinned,
      samples,
      needsAttention,
      datesDue,
      postCloseOutstanding,
      needsAttentionCount: needsAttention.length,
      datesDueCount: datesDue.length,
      postCloseOpenTotal: postCloseOutstanding.reduce(
        (total, property) => total + countOpenPostClose(property),
        0
      ),
    };
  }, [properties, tick]);

  return (
    <SectionCard
      title="Workspace overview"
      subtitle="Seed + this-tab pin/archive signals — not a BI dashboard."
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: "0.85rem",
        }}
      >
        <StatusPill
          label={`Active ${snapshot.activeCount}`}
          tone="neutral"
        />
        <StatusPill
          label={`Archived ${snapshot.archivedCount}`}
          tone="neutral"
        />
        <StatusPill label={`Pinned ${snapshot.pinned}`} tone="warn" />
        <StatusPill
          label={`Needs attention ${snapshot.needsAttentionCount}`}
          tone={snapshot.needsAttentionCount > 0 ? "warn" : "good"}
        />
        <StatusPill
          label={`Dates due ${snapshot.datesDueCount}`}
          tone={snapshot.datesDueCount > 0 ? "bad" : "neutral"}
        />
        <StatusPill
          label={`Post-close open ${snapshot.postCloseOpenTotal}`}
          tone={snapshot.postCloseOpenTotal > 0 ? "warn" : "neutral"}
        />
        <StatusPill label={`Samples ${snapshot.samples}`} tone="neutral" />
      </div>

      <OverviewGroup
        title="Needs attention"
        empty="None right now."
        properties={snapshot.needsAttention}
        detailFor={(property) => {
          const progress = deriveProgressSummary(property);
          return progress
            ? `${labelForProgressSummary(progress.status)} · ${progress.reason}`
            : null;
        }}
      />
      <OverviewGroup
        title="Dates due"
        empty="None right now."
        properties={snapshot.datesDue}
        detailFor={(property) => {
          const milestone = nextMilestone(property.milestones);
          if (!milestone) return null;
          const urgency = milestoneUrgencyLabel(milestone);
          return `${milestone.label}${urgency ? ` · ${urgency}` : ""}`;
        }}
      />
      <OverviewGroup
        title="Post-close outstanding"
        empty="None right now."
        properties={snapshot.postCloseOutstanding}
        detailFor={(property) => {
          const open = countOpenPostClose(property);
          return `${open} open item${open === 1 ? "" : "s"}`;
        }}
      />
    </SectionCard>
  );
}

function OverviewGroup({
  title,
  empty,
  properties,
  detailFor,
}: {
  title: string;
  empty: string;
  properties: PropertyScreen[];
  detailFor: (property: PropertyScreen) => string | null;
}) {
  return (
    <div style={{ marginTop: "0.85rem" }}>
      <p className="muted-note" style={{ marginBottom: "0.35rem" }}>
        {title}
      </p>
      {properties.length === 0 ? (
        <p className="muted-note" style={{ margin: 0 }}>
          {empty}
        </p>
      ) : (
        <ul className="risk-flag-list">
          {properties.map((property) => {
            const detail = detailFor(property);
            return (
              <li key={property.id} className="risk-flag-row">
                <div className="risk-flag-row__main">
                  <Link href={`/properties/${property.id}`}>
                    {property.address}
                  </Link>
                </div>
                {detail ? (
                  <p className="risk-flag-row__note">{detail}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
