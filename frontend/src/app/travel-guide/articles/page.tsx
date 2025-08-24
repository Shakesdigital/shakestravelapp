export default function ArticlesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Travel Articles</h1>
      <p className="text-lg text-gray-600 mb-8">
        Read our comprehensive travel articles about Uganda and East Africa.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Best Time to Visit Uganda</h3>
            <p className="text-gray-600 mb-4">Discover the optimal seasons for your Uganda adventure.</p>
            <a href="#" className="text-green-600 hover:text-green-800">Read More →</a>
          </div>
        </article>
        
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Uganda Travel Safety Tips</h3>
            <p className="text-gray-600 mb-4">Essential safety information for travelers to Uganda.</p>
            <a href="#" className="text-green-600 hover:text-green-800">Read More →</a>
          </div>
        </article>
        
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Wildlife Photography Guide</h3>
            <p className="text-gray-600 mb-4">Tips for capturing Uganda's incredible wildlife.</p>
            <a href="#" className="text-green-600 hover:text-green-800">Read More →</a>
          </div>
        </article>
      </div>
    </div>
  );
}