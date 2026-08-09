import { PropertyList } from "@/components/property/PropertyList";
import { TrialPropertyList } from "@/components/property/TrialPropertyList";
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
            <>Review properties with an initial Florida condo screening.</>
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

      {TRIAL_BUILD ? (
        <TrialPropertyList properties={properties} />
      ) : (
        <PropertyList properties={properties} />
      )}
    </main>
  );
}
