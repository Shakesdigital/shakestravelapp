// Generate static params for static export
export async function generateStaticParams() {
  // For static export, generate params for known checkout sessions
  const bookingIds = ['1', '2', '3', '4', '5']; // Add your actual booking IDs

  return bookingIds.map((bookingId) => ({
    bookingId: bookingId,
  }));
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}