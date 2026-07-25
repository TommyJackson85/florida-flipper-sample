export function formatMoney(
  value?: number | null,
  options?: { maximumFractionDigits?: number }
): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  }).format(value);
}

export function formatDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatPercent(
  value?: number | null,
  options?: { maximumFractionDigits?: number }
): string {
  if (value === null || value === undefined) return "—";
  return `${(value * 100).toFixed(options?.maximumFractionDigits ?? 0)}%`;
}

export function formatUnknownLabel(value?: string | null): string {
  if (!value || value === "unknown") return "Unknown";
  return value;
}
