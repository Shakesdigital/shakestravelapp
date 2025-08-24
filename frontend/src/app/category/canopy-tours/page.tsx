export default function CanopyToursPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Canopy Tours</h1>
      <p className="text-lg text-gray-600 mb-8">
        Experience Uganda's forests from above with our thrilling canopy tour adventures.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Forest Canopy Adventure</h3>
            <p className="text-gray-600">Zip through the treetops of Uganda's pristine forests.</p>
          </div>
        </div>
      </div>
    </div>
  );
}