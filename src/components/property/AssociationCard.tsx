import type { PropertyScreen } from "@/types/property";
import { DetailList } from "./DetailList";
import { SectionCard } from "./SectionCard";

type AssociationCardProps = {
  property: PropertyScreen;
};

export function AssociationCard({ property }: AssociationCardProps) {
  const association = property.association;

  return (
    <SectionCard title="Association" subtitle={association?.legalName}>
      <DetailList
        items={[
          { label: "Entity type", value: association?.entityType },
          { label: "Document number", value: association?.documentNumber },
          { label: "FEI / EIN", value: association?.fein },
          { label: "Date filed", value: association?.dateFiled },
          { label: "Corporate status", value: association?.corporateStatus },
          { label: "Registered agent", value: association?.registeredAgent },
          { label: "Principal address", value: association?.principalAddress },
          { label: "Manager note", value: association?.managerNote },
        ]}
      />

      {association?.officers?.length ? (
        <>
          <h3 className="subsection-title">Officers</h3>
          <ul>
            {association.officers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      ) : null}

      {association?.dbprStatus?.length ? (
        <>
          <h3 className="subsection-title">DBPR</h3>
          <ul>
            {association.dbprStatus.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      ) : null}

      {association?.officialRecordsNotes?.length ? (
        <>
          <h3 className="subsection-title">Official records</h3>
          <ul>
            {association.officialRecordsNotes.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                {item.riskLevel ? ` (${item.riskLevel} risk)` : ""}:{" "}
                {item.summary}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {association?.hoaReportedNotes ? (
        <>
          <h3 className="subsection-title">HOA dues (unverified)</h3>
          <p className="muted-note">{association.hoaReportedNotes}</p>
        </>
      ) : null}
    </SectionCard>
  );
}
