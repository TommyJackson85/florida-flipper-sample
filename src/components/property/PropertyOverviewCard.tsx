import type { PropertyScreen } from "@/types/property";
import { formatDate } from "@/lib/format";
import {
  countMissingDiligenceItems,
  countOpenRiskFlags,
  deriveClosingReadinessStatus,
  labelForClosingReadiness,
  labelForPropertyStage,
  labelForProvisionalStatus,
  milestoneUrgencyLabel,
  nextMilestone,
  toneForClosingReadiness,
  toneForPropertyStage,
  toneForProvisionalStatus,
} from "@/lib/property-metrics";
import { DetailList } from "./DetailList";
import { SectionCard } from "./SectionCard";
import { StatusPill } from "./StatusPill";

type PropertyOverviewCardProps = {
  property: PropertyScreen;
};

export function PropertyOverviewCard({ property }: PropertyOverviewCardProps) {
  if (property.isSample) {
    return (
      <SectionCard
        title="Overview"
        subtitle="At-a-glance for this screen — not a live dashboard."
      >
        <p className="muted-note">
          Practice shell — identity only; underwriting panels unset.
        </p>
      </SectionCard>
    );
  }

  const recommendation =
    property.status?.currentRecommendation ??
    labelForProvisionalStatus(property.status?.provisionalStatus);
  const closingStatus = deriveClosingReadinessStatus(
    property.closingReadiness
  );
  const diligenceCount = countMissingDiligenceItems(property);
  const openRisks = countOpenRiskFlags(property.condoRiskFlags);
  const milestone = nextMilestone(property.milestones);
  const milestoneUrgency = milestone
    ? milestoneUrgencyLabel(milestone)
    : null;

  return (
    <SectionCard
      title="Overview"
      subtitle="At-a-glance from this screen’s seed data — not a live dashboard."
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: "0.75rem",
        }}
      >
        {property.stage ? (
          <StatusPill
            label={labelForPropertyStage(property.stage)}
            tone={toneForPropertyStage(property.stage)}
          />
        ) : null}
        <StatusPill
          label={recommendation}
          tone={toneForProvisionalStatus(property.status?.provisionalStatus)}
        />
        <StatusPill
          label={`Closing: ${labelForClosingReadiness(closingStatus)}`}
          tone={toneForClosingReadiness(closingStatus)}
        />
      </div>
      <DetailList
        items={[
          {
            label: "Open diligence items",
            value: diligenceCount,
          },
          {
            label: "Open risk flags",
            value: property.condoRiskFlags ? openRisks : null,
          },
          {
            label: "Next milestone",
            value: milestone
              ? `${milestone.label} · ${formatDate(milestone.date)}${
                  milestoneUrgency ? ` · ${milestoneUrgency}` : ""
                }`
              : null,
          },
        ]}
      />
    </SectionCard>
  );
}
