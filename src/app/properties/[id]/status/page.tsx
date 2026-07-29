import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyClientStatusView } from "@/components/property/PropertyClientStatusView";
import { getAllProperties, getPropertyById } from "@/data/properties";
import { showClientStatusPreview } from "@/lib/trial-build";

type PropertyStatusPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return getAllProperties().map((property) => ({ id: property.id }));
}

export default async function PropertyStatusPage({
  params,
}: PropertyStatusPageProps) {
  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) {
    notFound();
  }

  if (!showClientStatusPreview()) {
    return (
      <main className="page-stack">
        <Link href={`/properties/${property.id}`} className="back-link">
          ← Deal screen
        </Link>
        <section className="section-card">
          <h2>Not part of this pilot build</h2>
          <div className="section-card__body">
            <p className="muted-note">
              The demo status / print preview is not included in the pilot
              build. Use the deal screen for the condo screening review.
            </p>
            <p style={{ marginTop: "0.75rem" }}>
              <Link href={`/properties/${property.id}`}>
                Open {property.address}
              </Link>
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-stack printable-summary-page">
      <Link
        href={`/properties/${property.id}`}
        className="back-link print-hide"
      >
        ← Full deal screen
      </Link>
      <PropertyClientStatusView property={property} />
    </main>
  );
}
