"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PropertyScreen } from "@/types/property";
import { PropertyDealScreen } from "@/components/property/PropertyDealScreen";
import { loadIntakeStubFromSession } from "@/lib/intake-property-stub";

export default function IntakeStubPropertyPage() {
  const [property, setProperty] = useState<PropertyScreen | null | undefined>(
    undefined
  );

  useEffect(() => {
    setProperty(loadIntakeStubFromSession());
  }, []);

  if (property === undefined) {
    return (
      <main className="page-stack">
        <p className="muted-note">Loading intake stub…</p>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="page-stack">
        <Link href="/intake" className="back-link">
          ← Intake
        </Link>
        <section className="section-card">
          <h2>No intake stub in this session</h2>
          <div className="section-card__body">
            <p className="muted-note">
              Create one on Intake with <strong>Open demo stub</strong>. Session
              stubs are not saved to the repo and clear when this browser tab
              closes.
            </p>
            <p style={{ marginTop: "0.75rem" }}>
              <Link href="/intake">Go to Intake</Link>
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <PropertyDealScreen
      property={property}
      backHref="/intake"
      backLabel="← Intake"
      bannerNote={
        property.id.endsWith("-demo-copy")
          ? "Cloned demo stub · session only · Sample — not saved to the repo."
          : "Intake demo stub · session only · Sample — not saved to the repo."
      }
    />
  );
}
