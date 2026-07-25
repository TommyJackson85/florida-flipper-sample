import type { PropertyScreen } from "@/types/property";
import { countMissingDiligenceItems } from "@/lib/property-metrics";
import { SectionCard } from "./SectionCard";

type MissingDiligenceCardProps = {
  property: PropertyScreen;
};

export function MissingDiligenceCard({ property }: MissingDiligenceCardProps) {
  const groups = property.missingDiligence ?? [];
  const count = countMissingDiligenceItems(property);

  return (
    <SectionCard
      title="Missing diligence"
      subtitle={`${count} open item${count === 1 ? "" : "s"} before a confident buy / pass call.`}
    >
      <div style={{ display: "grid", gap: 16 }}>
        {groups.map((group) => (
          <div key={group.title}>
            <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
