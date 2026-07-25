import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <section className="section-card">
      <div>
        <h2>{title}</h2>
        {subtitle ? <p className="section-card__subtitle">{subtitle}</p> : null}
      </div>
      <div className="section-card__body">{children}</div>
    </section>
  );
}
