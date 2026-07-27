import type { CondoRiskFlags, PropertyScreen, RiskFlagStatus } from "@/types/property";
import type { StatusTone } from "@/lib/property-metrics";
import { SectionCard } from "./SectionCard";
import { StatusPill } from "./StatusPill";

type RiskFlagsCardProps = {
  property: PropertyScreen;
};

const FLAG_ORDER: (keyof CondoRiskFlags)[] = [
  "milestoneInspection",
  "sirsReserves",
  "specialAssessments",
  "hoaDues",
  "insurance",
  "litigationOrRecords",
];

function toneForRiskStatus(status: RiskFlagStatus): StatusTone {
  if (status === "clear") return "good";
  if (status === "open") return "warn";
  return "neutral";
}

function labelForRiskStatus(status: RiskFlagStatus): string {
  if (status === "clear") return "Clear";
  if (status === "open") return "Open";
  return "Unknown";
}

export function RiskFlagsCard({ property }: RiskFlagsCardProps) {
  const flags = property.condoRiskFlags;
  if (!flags) return null;

  return (
    <SectionCard
      title="Florida condo risk flags"
      subtitle="Unknown = not researched yet · Open = researched enough to know it’s still unresolved · Clear = verified for this screen (not a final buy signal)."
    >
      <ul className="risk-flag-list">
        {FLAG_ORDER.map((key) => {
          const flag = flags[key];
          return (
            <li key={key} className="risk-flag-row">
              <div className="risk-flag-row__main">
                <span className="risk-flag-row__label">{flag.label}</span>
                <StatusPill
                  label={labelForRiskStatus(flag.status)}
                  tone={toneForRiskStatus(flag.status)}
                />
              </div>
              {flag.note ? (
                <p className="risk-flag-row__note">{flag.note}</p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}
