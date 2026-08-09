"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PropertyScreen } from "@/types/property";
import { PropertyDealScreen } from "@/components/property/PropertyDealScreen";
import { loadIntakeStubFromSession } from "@/lib/intake-property-stub";
import { TRIAL_BUILD } from "@/lib/trial-build";

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
        <p className="muted-note">Loading example deal…</p>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="page-stack">
        <Link
          href={TRIAL_BUILD ? "/properties" : "/intake"}
          className="back-link"
        >
          {TRIAL_BUILD ? "← Properties" : "← Intake"}
        </Link>
        <section className="section-card">
          <h2>No example deal in this session</h2>
          <div className="section-card__body">
            <p className="muted-note">
              {TRIAL_BUILD ? (
                <>
                  Open a deal screen and choose{" "}
                  <strong>Load example deal</strong>. Example data stays in this
                  browser tab only.
                </>
              ) : (
                <>
                  Create one on Intake with <strong>Open demo stub</strong>, or
                  use <strong>Load example deal</strong> on a deal screen.
                  Session stubs are not saved permanently and clear when this
                  browser tab closes.
                </>
              )}
            </p>
            <p style={{ marginTop: "0.75rem" }}>
              <Link href={TRIAL_BUILD ? "/properties" : "/intake"}>
                {TRIAL_BUILD ? "View properties" : "Go to Intake"}
              </Link>
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <PropertyDealScreen
      property={property}
      backHref={TRIAL_BUILD ? "/properties" : "/intake"}
      backLabel={TRIAL_BUILD ? "← Properties" : "← Intake"}
      bannerNote="Example data · Demo deal · session only — not saved permanently."
    />
  );
}
