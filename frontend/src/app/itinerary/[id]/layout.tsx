// Generate static params for static export
export async function generateStaticParams() {
  // For static export, generate params for known itineraries
  const itineraryIds = ['1', '2', '3', '4', '5']; // Add your actual itinerary IDs

  return itineraryIds.map((id) => ({
    id: id,
  }));
}

export default function ItineraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}