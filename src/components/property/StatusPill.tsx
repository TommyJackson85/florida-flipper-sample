import type { StatusTone } from "@/lib/property-metrics";

type StatusPillProps = {
  label: string;
  tone?: StatusTone;
};

export function StatusPill({ label, tone = "neutral" }: StatusPillProps) {
  return (
    <span className={`status-pill status-pill--${tone}`}>{label}</span>
  );
}
