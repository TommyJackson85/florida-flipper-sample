import type { ReactNode } from "react";

type SectionCardProps = {
  id?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function SectionCard({
  id,
  title,
  subtitle,
  children,
}: SectionCardProps) {
  return (
    <section id={id} className="section-card">
      <div>
        <h2>{title}</h2>
        {subtitle ? <p className="section-card__subtitle">{subtitle}</p> : null}
      </div>
      <div className="section-card__body">{children}</div>
    </section>
  );
}
