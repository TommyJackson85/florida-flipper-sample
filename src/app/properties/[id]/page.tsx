import { notFound } from "next/navigation";
import { PropertyDealScreen } from "@/components/property/PropertyDealScreen";
import { NiagaraPilotDealScreen } from "@/components/property/NiagaraPilotDealScreen";
import { getAllProperties, getPropertyById } from "@/data/properties";
import { TRIAL_BUILD } from "@/lib/trial-build";

type PropertyDetailPageProps = {
  params: Promise<{ id: string }>;
};

/** Catalog id for the Niagara pilot screen (Unit 1921). */
const NIAGARA_PILOT_ID = "7863-niagara-1921";

export function generateStaticParams() {
  return getAllProperties().map((property) => ({ id: property.id }));
}

/**
 * Catalog detail routes always render the file-backed seed.
 * Session intake stubs live only at /properties/intake-stub and must never
 * overlay /properties/<catalog-id> (including Niagara).
 */
export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) {
    notFound();
  }

  if (TRIAL_BUILD && property.id === NIAGARA_PILOT_ID && !property.isSample) {
    return <NiagaraPilotDealScreen property={property} />;
  }

  return <PropertyDealScreen property={property} />;
}
