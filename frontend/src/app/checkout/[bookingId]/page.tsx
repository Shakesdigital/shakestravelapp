export async function generateStaticParams() {
  return [
    { bookingId: '1' },
    { bookingId: '2' },
    { bookingId: '3' },
  ];
}

export default function CheckoutPage({ params }: { params: { bookingId: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Booking ID: {params.bookingId}</p>
          <p className="mt-4 text-gray-600">
            This is a placeholder page. Checkout functionality will be connected to the API.
          </p>
        </div>
      </div>
    </div>
  );
}