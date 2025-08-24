export default function RockClimbingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Rock Climbing</h1>
      <p className="text-lg text-gray-600 mb-8">
        Scale Uganda's rocky cliffs with our rock climbing adventures.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Cliff Climbing</h3>
            <p className="text-gray-600">Challenge yourself on natural rock formations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
