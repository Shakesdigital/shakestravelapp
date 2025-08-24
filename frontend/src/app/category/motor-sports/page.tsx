export default function MotorSportsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Motor Sports</h1>
      <p className="text-lg text-gray-600 mb-8">
        Get your adrenaline pumping with our motor sports adventures in Uganda.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">ATV Adventures</h3>
            <p className="text-gray-600">Explore rough terrain with all-terrain vehicles.</p>
          </div>
        </div>
      </div>
    </div>
  );
}