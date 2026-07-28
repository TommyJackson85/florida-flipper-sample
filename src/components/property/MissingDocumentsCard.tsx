import type {
  MissingDocumentState,
  PropertyScreen,
} from "@/types/property";
import type { StatusTone } from "@/lib/property-metrics";
import { SectionCard } from "./SectionCard";
import { StatusPill } from "./StatusPill";

type MissingDocumentsCardProps = {
  property: PropertyScreen;
};

function stateTone(state: MissingDocumentState): StatusTone {
  switch (state) {
    case "received":
      return "good";
    case "requested":
      return "warn";
    case "missing":
    default:
      return "bad";
  }
}

function stateLabel(state: MissingDocumentState): string {
  switch (state) {
    case "received":
      return "Received";
    case "requested":
      return "Requested";
    case "missing":
    default:
      return "Missing";
  }
}

export function MissingDocumentsCard({ property }: MissingDocumentsCardProps) {
  if (property.isSample) {
    return (
      <SectionCard
        title="Missing documents"
        subtitle="Concrete diligence artifacts — not risk themes or closing go/no-go."
      >
        <p className="muted-note">
          Not started — sample identity shell only. Not a live document file.
        </p>
      </SectionCard>
    );
  }

  const docs = property.missingDocuments;
  if (!docs || docs.items.length === 0) {
    return null;
  }

  const missingCount = docs.items.filter((i) => i.state === "missing").length;
  const requestedCount = docs.items.filter(
    (i) => i.state === "requested"
  ).length;
  const receivedCount = docs.items.filter((i) => i.state === "received").length;

  return (
    <SectionCard
      title="Missing documents"
      subtitle="Artifact status only: missing = not yet asked for on this screen · requested = ask noted here, package not in hand · received = in hand. Not closing readiness."
    >
      <p className="muted-note" style={{ marginBottom: "0.75rem" }}>
        {missingCount} missing · {requestedCount} requested · {receivedCount}{" "}
        received
      </p>
      <ul className="risk-flag-list">
        {docs.items.map((item) => (
          <li key={item.id} className="risk-flag-row">
            <div className="risk-flag-row__main">
              <span className="risk-flag-row__label">{item.label}</span>
              <StatusPill
                label={stateLabel(item.state)}
                tone={stateTone(item.state)}
              />
            </div>
            {item.note ? (
              <p className="risk-flag-row__note">{item.note}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
