import { PropertyListCard } from "@/components/property/PropertyListCard";
import { getAllProperties } from "@/data/properties";

export default function PropertiesPage() {
  const properties = getAllProperties();

  return (
    <main className="page-stack">
      <section className="page-intro">
        <h1>Screened properties</h1>
        <p>
          {properties.length} propert{properties.length === 1 ? "y" : "ies"} in
          the current file-based screen set. Add another TypeScript data file
          under <code>src/data/properties</code>, then register it in{" "}
          <code>index.ts</code>.
        </p>
      </section>

      <section className="property-grid">
        {properties.map((property) => (
          <PropertyListCard key={property.id} property={property} />
        ))}
      </section>
    </main>
  );
}
