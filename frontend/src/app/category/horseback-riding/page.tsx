export default function HorsebackRidingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Horseback Riding</h1>
      <p className="text-lg text-gray-600 mb-8">
        Explore Uganda's landscapes on horseback with our guided riding tours.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Scenic Horse Trails</h3>
            <p className="text-gray-600">Ride through beautiful Ugandan countryside.</p>
          </div>
        </div>
      </div>
    </div>
  );
}