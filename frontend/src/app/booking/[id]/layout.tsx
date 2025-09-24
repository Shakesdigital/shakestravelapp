// Generate static params for static export
export async function generateStaticParams() {
  // For static export, generate params for known bookings
  const bookingIds = ['1', '2', '3', '4', '5']; // Add your actual booking IDs

  return bookingIds.map((id) => ({
    id: id,
  }));
}

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}