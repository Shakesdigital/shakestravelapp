@extends('layouts.app')

@section('title', 'ShakesTravel - Adventure Tourism in Uganda')
@section('description', 'Discover Uganda\'s finest adventure experiences. Book safari tours, hiking expeditions, cultural experiences, and authentic accommodations with local experts.')

@push('head')
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": "ShakesTravel",
        "description": "Adventure tourism booking platform for Uganda",
        "url": "{{ url('/') }}",
        "logo": "{{ asset('images/logo.svg') }}",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+256-XXX-XXXXXX",
            "contactType": "Customer Service"
        },
        "areaServed": "Uganda",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Adventure Tours and Accommodations",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "TouristTrip",
                        "name": "Safari Adventures"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "TouristTrip",
                        "name": "Hiking & Trekking"
                    }
                }
            ]
        }
    }
    </script>
@endpush

@section('content')
<!-- Hero Section -->
<section class="relative bg-gradient-to-r from-green-600 to-blue-600 overflow-hidden">
    <div class="absolute inset-0">
        <img class="w-full h-full object-cover" src="{{ asset('images/hero-uganda-landscape.jpg') }}" alt="Uganda Landscape">
        <div class="absolute inset-0 bg-gradient-to-r from-green-900/70 to-blue-900/70"></div>
    </div>
    
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div class="text-center">
            <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
                Discover Uganda's
                <span class="text-yellow-300">Wild Beauty</span>
            </h1>
            <p class="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto">
                Experience authentic adventures with local experts. From gorilla trekking to white-water rafting, 
                create unforgettable memories in the Pearl of Africa.
            </p>
            
            <!-- Search Bar -->
            <div class="max-w-4xl mx-auto">
                <form action="{{ route('search') }}" method="GET" 
                      class="bg-white rounded-lg shadow-xl p-6 md:p-8">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Where to?</label>
                            <input type="text" 
                                   name="location" 
                                   placeholder="Destination"
                                   class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">What?</label>
                            <select name="category" 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                <option value="">All Adventures</option>
                                <option value="safari">Safari</option>
                                <option value="hiking">Hiking</option>
                                <option value="cultural-tours">Cultural Tours</option>
                                <option value="water-sports">Water Sports</option>
                                <option value="extreme-sports">Extreme Sports</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">When?</label>
                            <input type="date" 
                                   name="start_date"
                                   min="{{ date('Y-m-d') }}"
                                   class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        </div>
                        <div class="flex items-end">
                            <button type="submit" 
                                    class="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-semibold transition-colors duration-200">
                                Search Adventures
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>

<!-- Featured Adventures -->
<section class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Adventures
            </h2>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                Handpicked experiences that showcase the best of Uganda's natural wonders and cultural heritage.
            </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @foreach($featuredTrips as $trip)
                <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div class="relative">
                        <img src="{{ $trip->primary_image }}" 
                             alt="{{ $trip->title }}" 
                             class="w-full h-48 object-cover">
                        <div class="absolute top-4 right-4">
                            @livewire('wishlist-button', ['item' => $trip])
                        </div>
                        @if($trip->is_featured)
                            <div class="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                                Featured
                            </div>
                        @endif
                    </div>
                    
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm text-green-600 font-medium">{{ ucfirst($trip->category) }}</span>
                            <div class="flex items-center">
                                <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                </svg>
                                <span class="ml-1 text-sm text-gray-600">{{ $trip->rating }} ({{ $trip->total_reviews }})</span>
                            </div>
                        </div>
                        
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $trip->title }}</h3>
                        <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ Str::limit($trip->description, 100) }}</p>
                        
                        <div class="flex items-center justify-between">
                            <div class="text-lg font-bold text-green-600">
                                ${{ number_format($trip->base_price) }}
                                <span class="text-sm text-gray-500 font-normal">/ person</span>
                            </div>
                            <a href="{{ route('trips.show', $trip->slug) }}" 
                               class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 text-sm font-medium">
                                View Details
                            </a>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
        
        <div class="text-center mt-12">
            <a href="{{ route('trips.index') }}" 
               class="inline-flex items-center px-6 py-3 border border-green-600 text-green-600 rounded-md hover:bg-green-600 hover:text-white transition-colors duration-200">
                View All Adventures
                <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </a>
        </div>
    </div>
</section>

<!-- Categories -->
<section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Adventure Categories
            </h2>
            <p class="text-lg text-gray-600">
                Choose your perfect adventure style
            </p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            @foreach($categories as $slug => $name)
                <a href="{{ route('trips.category', $slug) }}" 
                   class="group text-center">
                    <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 group-hover:bg-green-50">
                        <div class="text-3xl mb-3">
                            @switch($slug)
                                @case('safari')
                                    🦁
                                    @break
                                @case('hiking')
                                    🥾
                                    @break
                                @case('cultural-tours')
                                    🏛️
                                    @break
                                @case('water-sports')
                                    🚣
                                    @break
                                @case('extreme-sports')
                                    🪂
                                    @break
                                @case('aerial-adventures')
                                    🚁
                                    @break
                            @endswitch
                        </div>
                        <h3 class="text-sm font-semibold text-gray-900 group-hover:text-green-600">{{ $name }}</h3>
                    </div>
                </a>
            @endforeach
        </div>
    </div>
</section>

<!-- Featured Accommodations -->
<section class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Accommodations
            </h2>
            <p class="text-lg text-gray-600">
                Stay in comfort while exploring Uganda's wonders
            </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @foreach($featuredAccommodations as $accommodation)
                <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div class="relative">
                        <img src="{{ $accommodation->primaryImage }}" 
                             alt="{{ $accommodation->name }}" 
                             class="w-full h-48 object-cover">
                        <div class="absolute top-4 right-4">
                            @livewire('wishlist-button', ['item' => $accommodation])
                        </div>
                    </div>
                    
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm text-blue-600 font-medium">{{ ucfirst($accommodation->type) }}</span>
                            <div class="flex items-center">
                                <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                </svg>
                                <span class="ml-1 text-sm text-gray-600">{{ $accommodation->rating }} ({{ $accommodation->total_reviews }})</span>
                            </div>
                        </div>
                        
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $accommodation->name }}</h3>
                        <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ Str::limit($accommodation->description, 100) }}</p>
                        
                        <div class="flex items-center justify-between">
                            <div class="text-lg font-bold text-blue-600">
                                ${{ number_format($accommodation->price_per_night) }}
                                <span class="text-sm text-gray-500 font-normal">/ night</span>
                            </div>
                            <a href="{{ route('accommodations.show', $accommodation->slug) }}" 
                               class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                                View Details
                            </a>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</section>

<!-- Reviews Section -->
@if($recentReviews->count() > 0)
    <section class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    What Our Travelers Say
                </h2>
                <p class="text-lg text-gray-600">
                    Real experiences from real adventurers
                </p>
            </div>
            
            @livewire('review-carousel', ['reviews' => $recentReviews])
        </div>
    </section>
@endif

<!-- Call to Action -->
<section class="py-16 bg-green-600">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready for Your Next Adventure?
        </h2>
        <p class="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have discovered Uganda's magic with ShakesTravel.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="{{ route('trips.index') }}" 
               class="bg-white text-green-600 px-8 py-3 rounded-md hover:bg-gray-100 font-semibold transition-colors duration-200">
                Explore Adventures
            </a>
            
            @guest
                <a href="{{ route('register') }}" 
                   class="bg-yellow-400 text-yellow-900 px-8 py-3 rounded-md hover:bg-yellow-300 font-semibold transition-colors duration-200">
                    Create Account
                </a>
            @else
                @if(auth()->user()->role === 'guest')
                    <a href="{{ route('become-host') }}" 
                       class="bg-yellow-400 text-yellow-900 px-8 py-3 rounded-md hover:bg-yellow-300 font-semibold transition-colors duration-200">
                        Become a Host
                    </a>
                @endif
            @endguest
        </div>
    </div>
</section>
@endsection

@push('scripts')
<script>
// Add any specific home page JavaScript here
document.addEventListener('DOMContentLoaded', function() {
    // Initialize any interactive components
});
</script>
@endpush