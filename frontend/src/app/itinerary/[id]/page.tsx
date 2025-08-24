export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default function ItineraryPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Travel Itinerary</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Itinerary ID: {params.id}</p>
          <p className="mt-4 text-gray-600">
            This is a placeholder page. Itinerary functionality will be connected to the API.
          </p>
        </div>
      </div>
    </div>
  );
}