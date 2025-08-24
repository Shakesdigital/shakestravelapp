<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Trip;
use App\Models\Accommodation;
use App\Models\Review;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        // Featured trips and accommodations
        $featuredTrips = Trip::active()
            ->featured()
            ->with(['host', 'reviews'])
            ->take(6)
            ->get();

        $featuredAccommodations = Accommodation::active()
            ->featured()
            ->with(['host', 'reviews'])
            ->take(6)
            ->get();

        // Recent reviews
        $recentReviews = Review::with(['user', 'reviewable'])
            ->where('is_verified', true)
            ->where('is_hidden', false)
            ->latest()
            ->take(10)
            ->get();

        // Popular destinations
        $popularDestinations = Trip::active()
            ->selectRaw('JSON_EXTRACT(location, "$.destination") as destination, COUNT(*) as trip_count')
            ->groupBy('destination')
            ->orderBy('trip_count', 'desc')
            ->take(8)
            ->get();

        // Trip categories
        $categories = [
            'safari' => 'Wildlife Safari',
            'hiking' => 'Hiking & Trekking',
            'cultural-tours' => 'Cultural Tours',
            'water-sports' => 'Water Sports',
            'extreme-sports' => 'Extreme Sports',
            'aerial-adventures' => 'Aerial Adventures',
        ];

        return view('home', compact(
            'featuredTrips',
            'featuredAccommodations',
            'recentReviews',
            'popularDestinations',
            'categories'
        ));
    }

    public function search(Request $request)
    {
        $query = $request->get('q');
        $category = $request->get('category');
        $location = $request->get('location');
        $minPrice = $request->get('min_price');
        $maxPrice = $request->get('max_price');
        $difficulty = $request->get('difficulty');
        $rating = $request->get('rating');
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        // Search trips
        $trips = Trip::active()
            ->with(['host', 'reviews'])
            ->when($query, function ($q) use ($query) {
                return $q->search($query);
            })
            ->when($category, function ($q) use ($category) {
                return $q->byCategory($category);
            })
            ->when($location, function ($q) use ($location) {
                return $q->byLocation($location);
            })
            ->when($minPrice || $maxPrice, function ($q) use ($minPrice, $maxPrice) {
                return $q->priceRange($minPrice, $maxPrice);
            })
            ->when($difficulty, function ($q) use ($difficulty) {
                return $q->byDifficulty($difficulty);
            })
            ->when($rating, function ($q) use ($rating) {
                return $q->byRating($rating);
            })
            ->orderBy($sortBy, $sortOrder)
            ->paginate(12)
            ->appends($request->query());

        // Search accommodations
        $accommodations = Accommodation::active()
            ->with(['host', 'reviews'])
            ->when($query, function ($q) use ($query) {
                return $q->search($query);
            })
            ->when($location, function ($q) use ($location) {
                return $q->byLocation($location);
            })
            ->when($minPrice || $maxPrice, function ($q) use ($minPrice, $maxPrice) {
                return $q->priceRange($minPrice, $maxPrice);
            })
            ->when($rating, function ($q) use ($rating) {
                return $q->byRating($rating);
            })
            ->orderBy($sortBy, $sortOrder)
            ->paginate(12)
            ->appends($request->query());

        return view('search.results', compact(
            'trips',
            'accommodations',
            'query',
            'category',
            'location',
            'minPrice',
            'maxPrice',
            'difficulty',
            'rating',
            'sortBy',
            'sortOrder'
        ));
    }
}