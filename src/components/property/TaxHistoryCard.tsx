import type { PropertyScreen } from "@/types/property";
import { formatDate, formatMoney } from "@/lib/format";
import { summarizeTaxTrend } from "@/lib/property-metrics";
import { SectionCard } from "./SectionCard";

type TaxHistoryCardProps = {
  property: PropertyScreen;
};

export function TaxHistoryCard({ property }: TaxHistoryCardProps) {
  const rows = [...(property.taxes?.annualHistory ?? [])].sort(
    (a, b) => b.year - a.year
  );
  const trend = summarizeTaxTrend(property);

  return (
    <SectionCard
      title="Tax history"
      subtitle={`Status: ${property.status?.taxStatus ?? "—"} · Most recent payment: ${formatMoney(property.taxes?.mostRecentPaymentAmount, { maximumFractionDigits: 2 })} on ${formatDate(property.taxes?.mostRecentPaymentDate)}`}
    >
      {trend ? <p className="tax-trend">{trend}</p> : null}

      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Paid date</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.year}>
                <td>{row.year}</td>
                <td>
                  {formatMoney(row.amount, { maximumFractionDigits: 2 })}
                </td>
                <td style={{ textTransform: "capitalize" }}>{row.status}</td>
                <td>{formatDate(row.paidDate)}</td>
                <td style={{ color: "#6b7280" }}>{row.notes ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}
