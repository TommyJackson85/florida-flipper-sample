import { notFound } from "next/navigation";
import { PropertyDealScreen } from "@/components/property/PropertyDealScreen";
import { getAllProperties, getPropertyById } from "@/data/properties";

type PropertyDetailPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return getAllProperties().map((property) => ({ id: property.id }));
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) {
    notFound();
  }

  return <PropertyDealScreen property={property} />;
}
