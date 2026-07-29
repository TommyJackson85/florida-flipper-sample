import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyClientStatusView } from "@/components/property/PropertyClientStatusView";
import { getAllProperties, getPropertyById } from "@/data/properties";

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
