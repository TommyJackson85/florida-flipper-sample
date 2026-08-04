import { PropertyList } from "@/components/property/PropertyList";
import { getAllProperties } from "@/data/properties";
import { TRIAL_BUILD } from "@/lib/trial-build";

export default function PropertiesPage() {
  const properties = getAllProperties();

  return (
    <main className="page-stack">
      <section className="page-intro">
        <h1>Screened properties</h1>
        <p>
          {TRIAL_BUILD ? (
            <>
              Open the seeded Niagara deal to review Track outcome, risk flags,
              and missing diligence. Durable facts live in the file-backed
              screen — not in this-tab toggles. {properties.length} propert
              {properties.length === 1 ? "y" : "ies"} in this set; add another
              via a TypeScript file under <code>src/data/properties</code> and{" "}
              <code>index.ts</code>. Pilot script is on Home.
            </>
          ) : (
            <>
              {properties.length} propert
              {properties.length === 1 ? "y" : "ies"} in the current file-based
              screen set. Add another TypeScript data file under{" "}
              <code>src/data/properties</code>, then register it in{" "}
              <code>index.ts</code>. Archived records soft-hide from the main
              list without being deleted.
            </>
          )}
        </p>
      </section>

      <PropertyList properties={properties} />
    </main>
  );
}
