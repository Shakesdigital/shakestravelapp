#!/usr/bin/env node

/**
 * Database Seeding Script for Shakes Travel
 * 
 * This script populates the database with sample Uganda travel data
 * including trips, accommodations, and users for development and testing.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const Trip = require('../src/models/Trip');
const Accommodation = require('../src/models/Accommodation');
const User = require('../src/models/User');
const Review = require('../src/models/Review');

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shakestravel', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Sample Users Data
const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    phone: '+256701234567',
    country: 'USA',
    isVerified: true
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'user',
    phone: '+256702345678',
    country: 'UK',
    isVerified: true
  },
  {
    name: 'Admin User',
    email: 'admin@shakestravel.com',
    password: 'admin123',
    role: 'admin',
    phone: '+256703456789',
    country: 'Uganda',
    isVerified: true
  }
];

// Sample Trips/Experiences Data
const trips = [
  {
    title: 'Bwindi Gorilla Trekking Experience',
    slug: 'bwindi-gorilla-trekking',
    description: 'Embark on an unforgettable journey to track mountain gorillas in their natural habitat. This once-in-a-lifetime experience takes you deep into Bwindi Impenetrable Forest, home to nearly half of the world\'s remaining mountain gorillas.',
    longDescription: 'The Bwindi Gorilla Trekking experience is Uganda\'s crown jewel of wildlife adventures. Starting early morning, you\'ll be briefed by experienced guides before venturing into the dense tropical rainforest. The trek can take anywhere from 2-8 hours depending on the gorilla family location. Once you encounter these magnificent creatures, you\'ll spend an hour observing their behavior, social interactions, and daily activities. The experience includes permits, professional guides, and transportation from Kampala.',
    location: 'Bwindi Impenetrable Forest',
    coordinates: { lat: -1.0673, lng: 29.7007 },
    price: 800,
    duration: 3,
    difficulty: 'moderate',
    maxGroupSize: 8,
    categories: ['wildlife', 'trekking', 'nature'],
    features: ['Gorilla permits included', 'Professional guide', 'Transportation', 'Lunch included', 'Certificate of participation'],
    itinerary: [
      { day: 1, title: 'Arrival and Briefing', description: 'Arrive at Bwindi, check-in, and receive briefing about gorilla trekking rules and safety.' },
      { day: 2, title: 'Gorilla Trekking', description: 'Early morning trek to find and spend time with mountain gorilla family.' },
      { day: 3, title: 'Cultural Experience and Departure', description: 'Visit local Batwa community and depart back to Kampala.' }
    ],
    images: ['/brand_assets/images/gorilla-trekking.jpg'],
    rating: 4.9,
    reviewCount: 156,
    bookingCount: 89,
    featured: true,
    status: 'active',
    availability: [
      { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31'), available: true, price: 800 }
    ]
  },
  {
    title: 'Jinja White Water Rafting Adventure',
    slug: 'jinja-white-water-rafting',
    description: 'Experience the thrill of conquering the mighty Nile River rapids on this exhilarating full-day white water rafting adventure in Jinja, the adventure capital of East Africa.',
    longDescription: 'Navigate through Grade III-V rapids on the source of the Nile River in this adrenaline-pumping adventure. The full-day experience includes professional rafting guides, all safety equipment, riverside lunch, and transportation. Perfect for adventure seekers looking to challenge themselves while enjoying Uganda\'s beautiful scenery. No previous rafting experience required - our expert guides will ensure your safety throughout the journey.',
    location: 'Jinja',
    coordinates: { lat: 0.4316, lng: 33.2013 },
    price: 120,
    duration: 1,
    difficulty: 'challenging',
    maxGroupSize: 12,
    categories: ['adventure', 'water-sports', 'rafting'],
    features: ['Professional guides', 'All safety equipment', 'Riverside lunch', 'Transportation', 'Photos and videos'],
    itinerary: [
      { day: 1, title: 'Full Day Rafting Adventure', description: 'Safety briefing, equipment fitting, full day rafting through Nile rapids with lunch break.' }
    ],
    images: ['/brand_assets/images/jinja-rafting.jpg'],
    rating: 4.8,
    reviewCount: 234,
    bookingCount: 156,
    featured: true,
    status: 'active',
    availability: [
      { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31'), available: true, price: 120 }
    ]
  },
  {
    title: 'Queen Elizabeth National Park Safari',
    slug: 'queen-elizabeth-safari',
    description: 'Explore Uganda\'s most popular national park on this comprehensive safari experience featuring game drives, boat cruises, and diverse wildlife viewing opportunities.',
    longDescription: 'Queen Elizabeth National Park offers the classic African safari experience with Uganda\'s highest biodiversity. This 3-day safari includes game drives in search of lions, elephants, hippos, and buffaloes, a boat cruise on Kazinga Channel famous for its large concentration of hippos and Nile crocodiles, and visits to the Ishasha sector known for its tree-climbing lions. The park is also a paradise for bird watchers with over 600 bird species.',
    location: 'Queen Elizabeth National Park',
    coordinates: { lat: -0.1773, lng: 29.8537 },
    price: 450,
    duration: 3,
    difficulty: 'easy',
    maxGroupSize: 6,
    categories: ['safari', 'wildlife', 'photography'],
    features: ['Game drives', 'Boat cruise', 'Professional guide', 'All park fees', 'Transportation'],
    itinerary: [
      { day: 1, title: 'Arrival and Evening Game Drive', description: 'Arrive at Queen Elizabeth NP, check-in, and evening game drive in Kasenyi sector.' },
      { day: 2, title: 'Kazinga Channel Boat Cruise', description: 'Morning game drive and afternoon boat cruise on Kazinga Channel.' },
      { day: 3, title: 'Ishasha Tree-climbing Lions', description: 'Visit Ishasha sector to see famous tree-climbing lions and depart.' }
    ],
    images: ['/brand_assets/images/uganda-hero.jpg'],
    rating: 4.7,
    reviewCount: 189,
    bookingCount: 112,
    featured: true,
    status: 'active',
    availability: [
      { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31'), available: true, price: 450 }
    ]
  },
  {
    title: 'Kampala City Cultural Tour',
    slug: 'kampala-cultural-tour',
    description: 'Discover the vibrant culture, rich history, and bustling markets of Uganda\'s capital city on this comprehensive full-day cultural immersion tour.',
    longDescription: 'Explore Kampala\'s fascinating blend of traditional and modern culture. Visit the Kasubi Tombs (UNESCO World Heritage Site), Buganda Parliament, vibrant local markets, religious sites, and experience authentic Ugandan cuisine. Learn about Uganda\'s history, politics, and daily life from knowledgeable local guides. This tour provides deep insights into Ugandan culture and traditions.',
    location: 'Kampala',
    coordinates: { lat: 0.3136, lng: 32.5811 },
    price: 45,
    duration: 1,
    difficulty: 'easy',
    maxGroupSize: 15,
    categories: ['cultural', 'city-tour', 'history'],
    features: ['Local guide', 'Transportation', 'Cultural sites entry', 'Traditional lunch', 'Market visits'],
    itinerary: [
      { day: 1, title: 'Full Day Cultural Immersion', description: 'Visit Kasubi Tombs, Buganda Parliament, local markets, and enjoy traditional Ugandan lunch.' }
    ],
    images: ['/brand_assets/images/uganda-culture.jpg'],
    rating: 4.4,
    reviewCount: 123,
    bookingCount: 87,
    featured: false,
    status: 'active',
    availability: [
      { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31'), available: true, price: 45 }
    ]
  },
  {
    title: 'Murchison Falls National Park Adventure',
    slug: 'murchison-falls-adventure',
    description: 'Experience the power of Murchison Falls and encounter diverse wildlife in Uganda\'s largest national park on this comprehensive 4-day safari adventure.',
    longDescription: 'Murchison Falls National Park offers spectacular scenery where the Nile River explodes through a narrow gorge and cascades down to become a placid river whose banks are thronged with hippos, crocodiles, waterbuck, and buffaloes. This 4-day adventure includes game drives, boat trips to the falls, hiking to the top of the falls, and excellent opportunities for bird watching and photography.',
    location: 'Murchison Falls National Park',
    coordinates: { lat: 2.2151, lng: 31.5804 },
    price: 650,
    duration: 4,
    difficulty: 'moderate',
    maxGroupSize: 8,
    categories: ['safari', 'waterfalls', 'wildlife', 'nature'],
    features: ['Game drives', 'Boat to falls', 'Falls hike', 'All park fees', 'Professional guide'],
    itinerary: [
      { day: 1, title: 'Travel and Evening Game Drive', description: 'Travel to Murchison Falls NP, check-in, and evening game drive.' },
      { day: 2, title: 'Morning Game Drive and Boat Trip', description: 'Early morning game drive and afternoon boat trip to Murchison Falls.' },
      { day: 3, title: 'Top of Falls Hike and Delta Cruise', description: 'Hike to top of falls and evening Nile Delta boat cruise.' },
      { day: 4, title: 'Final Game Drive and Departure', description: 'Final morning game drive and departure to Kampala.' }
    ],
    images: ['/brand_assets/images/uganda-hero.jpg'],
    rating: 4.6,
    reviewCount: 98,
    bookingCount: 64,
    featured: true,
    status: 'active',
    availability: [
      { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31'), available: true, price: 650 }
    ]
  },
  {
    title: 'Lake Bunyonyi Island Hopping',
    slug: 'lake-bunyonyi-island-hopping',
    description: 'Relax and explore the beautiful Lake Bunyonyi, known as the "Place of Many Little Birds," with its 29 islands and stunning mountain scenery.',
    longDescription: 'Lake Bunyonyi is one of the most beautiful lakes in Uganda, perfect for relaxation after adventure activities. This 2-day experience includes island hopping by traditional dugout canoe, visiting local communities, bird watching (over 200 species), swimming in the bilharzia-free lake, and enjoying the spectacular mountain scenery. Learn about local culture and history while enjoying the peaceful atmosphere.',
    location: 'Lake Bunyonyi',
    coordinates: { lat: -1.2921, lng: 29.9246 },
    price: 180,
    duration: 2,
    difficulty: 'easy',
    maxGroupSize: 10,
    categories: ['relaxation', 'cultural', 'birdwatching', 'nature'],
    features: ['Dugout canoe rides', 'Island visits', 'Community visits', 'Swimming', 'Bird watching'],
    itinerary: [
      { day: 1, title: 'Lake Exploration and Island Visits', description: 'Canoe rides, visit to Punishment Island, local community interaction.' },
      { day: 2, title: 'Bird Watching and Relaxation', description: 'Early morning bird watching, swimming, and relaxation by the lake.' }
    ],
    images: ['/brand_assets/images/uganda-culture.jpg'],
    rating: 4.5,
    reviewCount: 76,
    bookingCount: 45,
    featured: false,
    status: 'active',
    availability: [
      { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31'), available: true, price: 180 }
    ]
  }
];

// Sample Accommodations Data
const accommodations = [
  {
    name: 'Queen Elizabeth Safari Lodge',
    slug: 'queen-elizabeth-safari-lodge',
    description: 'Luxury safari lodge with stunning views of the Kazinga Channel and abundant wildlife right at your doorstep.',
    longDescription: 'Experience the ultimate in safari luxury at Queen Elizabeth Safari Lodge. Perched on a hill overlooking the famous Kazinga Channel, this exclusive lodge offers unparalleled wildlife viewing from the comfort of your room. Watch elephants, hippos, and various antelope species from your private balcony. The lodge features spacious rooms with modern amenities, a restaurant serving international and local cuisine, and a bar with panoramic views.',
    type: 'lodge',
    location: 'Queen Elizabeth National Park',
    coordinates: { lat: -0.1773, lng: 29.8537 },
    pricePerNight: 250,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['WiFi', 'Restaurant', 'Bar', 'Game Viewing Deck', 'Laundry Service', 'Airport Transfer'],
    features: ['Wildlife viewing from room', 'Channel views', 'All meals included', 'Game drives arranged'],
    images: ['/brand_assets/images/uganda-hero.jpg'],
    rating: 4.7,
    reviewCount: 89,
    bookingCount: 156,
    featured: true,
    status: 'active',
    availability: [
      { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31'), available: true, pricePerNight: 250 }
    ]
  },
  {
    name: 'Lake Bunyonyi Eco Resort',
    slug: 'lake-bunyonyi-eco-resort',
    description: 'Peaceful lakeside resort perfect for relaxation and birdwatching, with stunning views of Lake Bunyonyi and surrounding hills.',
    longDescription: 'Nestled on the shores of Lake Bunyonyi, this eco-friendly resort offers the perfect retreat in nature. Wake up to the sounds of birds and stunning lake views. The resort features comfortable cottages built with local materials, a restaurant serving fresh local cuisine, and various activities including canoe rides, nature walks, and cultural visits. Ideal for honeymooners and those seeking tranquility.',
    type: 'resort',
    location: 'Lake Bunyonyi',
    coordinates: { lat: -1.2921, lng: 29.9246 },
    pricePerNight: 180,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['Restaurant', 'Boat Trips', 'WiFi', 'Spa Services', 'Cultural Activities', 'Swimming'],
    features: ['Lake views', 'Eco-friendly', 'Local materials', 'Fresh cuisine', 'Peaceful environment'],
    images: ['/brand_assets/images/uganda-culture.jpg'],
    rating: 4.6,
    reviewCount: 67,
    bookingCount: 98,
    featured: false,
    status: 'active',
    availability: [
      { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31'), available: true, pricePerNight: 180 }
    ]
  },
  {
    name: 'Murchison Falls Lodge',
    slug: 'murchison-falls-lodge',
    description: 'Experience the power of Murchison Falls from this riverside lodge offering comfortable accommodation and excellent wildlife viewing.',
    longDescription: 'Located along the banks of the Nile River, Murchison Falls Lodge provides front-row seats to one of nature\'s most spectacular shows. The lodge offers comfortable tented accommodation with private bathrooms, a restaurant with river views, and easy access to game drives and boat trips. Listen to the roar of the falls and watch wildlife come to drink from the river right from your tent.',
    type: 'lodge',
    location: 'Murchison Falls National Park',
    coordinates: { lat: 2.2151, lng: 31.5804 },
    pricePerNight: 320,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['Restaurant', 'River Views', 'Game Drives', 'Boat Trips', 'WiFi', 'Laundry'],
    features: ['Riverside location', 'Tented accommodation', 'Falls proximity', 'Wildlife viewing'],
    images: ['/brand_assets/images/uganda-hero.jpg'],
    rating: 4.8,
    reviewCount: 145,
    bookingCount: 203,
    featured: true,
    status: 'active',
    availability: [
      { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31'), available: true, pricePerNight: 320 }
    ]
  },
  {
    name: 'Bwindi Forest Lodge',
    slug: 'bwindi-forest-lodge',
    description: 'Luxury eco-lodge on the edge of Bwindi Impenetrable Forest, perfect for gorilla trekking adventures with world-class amenities.',
    longDescription: 'Set in the heart of gorilla country, Bwindi Forest Lodge offers luxury accommodation with minimal environmental impact. The lodge features spacious bandas (cottages) with private bathrooms, a restaurant serving gourmet cuisine, and stunning forest views. Professional guides are available for gorilla trekking and nature walks. The lodge supports local communities and conservation efforts.',
    type: 'eco-lodge',
    location: 'Bwindi Impenetrable Forest',
    coordinates: { lat: -1.0673, lng: 29.7007 },
    pricePerNight: 450,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['Gourmet Restaurant', 'Forest Views', 'Gorilla Trekking', 'Nature Walks', 'Community Support', 'WiFi'],
    features: ['Luxury bandas', 'Eco-friendly', 'Forest location', 'Conservation focus'],
    images: ['/brand_assets/images/gorilla-trekking.jpg'],
    rating: 4.9,
    reviewCount: 112,
    bookingCount: 178,
    featured: true,
    status: 'active',
    availability: [
      { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31'), available: true, pricePerNight: 450 }
    ]
  },
  {
    name: 'Jinja Backpackers Lodge',
    slug: 'jinja-backpackers-lodge',
    description: 'Budget-friendly accommodation in the adventure capital of East Africa, perfect for backpackers and adventure seekers.',
    longDescription: 'Located in the heart of Jinja, this backpackers lodge offers affordable accommodation without compromising on comfort and fun. The lodge features dormitory and private rooms, a restaurant serving local and international dishes, and easy access to all Jinja attractions. The friendly staff can arrange white water rafting, bungee jumping, quad biking, and other adventure activities.',
    type: 'hostel',
    location: 'Jinja',
    coordinates: { lat: 0.4316, lng: 33.2013 },
    pricePerNight: 35,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 2,
    amenities: ['Shared Kitchen', 'Restaurant', 'WiFi', 'Laundry', 'Adventure Booking', 'Common Area'],
    features: ['Budget-friendly', 'Backpacker atmosphere', 'Adventure activities', 'Social environment'],
    images: ['/brand_assets/images/jinja-rafting.jpg'],
    rating: 4.2,
    reviewCount: 234,
    bookingCount: 456,
    featured: false,
    status: 'active',
    availability: [
      { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31'), available: true, pricePerNight: 35 }
    ]
  },
  {
    name: 'Kampala Boutique Hotel',
    slug: 'kampala-boutique-hotel',
    description: 'Modern boutique hotel in the heart of Kampala offering comfortable accommodation with easy access to city attractions.',
    longDescription: 'This stylish boutique hotel combines modern amenities with Ugandan hospitality in the vibrant capital city. Located in a quiet neighborhood yet close to major attractions, restaurants, and business districts. The hotel features well-appointed rooms with air conditioning, free WiFi, a restaurant serving continental and local cuisine, and helpful staff who can arrange city tours and cultural experiences.',
    type: 'hotel',
    location: 'Kampala',
    coordinates: { lat: 0.3136, lng: 32.5811 },
    pricePerNight: 120,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['Air Conditioning', 'WiFi', 'Restaurant', 'Room Service', 'City Tours', 'Business Center'],
    features: ['Central location', 'Modern amenities', 'Local hospitality', 'Cultural access'],
    images: ['/brand_assets/images/uganda-culture.jpg'],
    rating: 4.3,
    reviewCount: 187,
    bookingCount: 298,
    featured: false,
    status: 'active',
    availability: [
      { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31'), available: true, pricePerNight: 120 }
    ]
  }
];

// Hash passwords
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🚀 Starting database seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Trip.deleteMany({}),
      Accommodation.deleteMany({}),
      Review.deleteMany({})
    ]);
    console.log('✅ Cleared existing data');

    // Hash passwords for users
    for (let user of users) {
      user.password = await hashPassword(user.password);
    }

    // Create users
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create trips
    const createdTrips = await Trip.insertMany(trips);
    console.log(`✅ Created ${createdTrips.length} trips`);

    // Create accommodations
    const createdAccommodations = await Accommodation.insertMany(accommodations);
    console.log(`✅ Created ${createdAccommodations.length} accommodations`);

    // Create sample reviews
    const reviews = [
      {
        user: createdUsers[0]._id,
        itemType: 'trip',
        itemId: createdTrips[0]._id,
        rating: 5,
        title: 'Absolutely Amazing Experience!',
        content: 'The gorilla trekking experience was beyond my expectations. Our guide was knowledgeable and the entire experience was well-organized. Seeing the gorillas up close was truly magical!',
        helpful: 12,
        images: []
      },
      {
        user: createdUsers[1]._id,
        itemType: 'trip',
        itemId: createdTrips[1]._id,
        rating: 5,
        title: 'Thrilling Adventure!',
        content: 'White water rafting on the Nile was incredible! The guides were professional and made sure we felt safe throughout. The rapids were exciting and the scenery beautiful.',
        helpful: 8,
        images: []
      },
      {
        user: createdUsers[0]._id,
        itemType: 'accommodation',
        itemId: createdAccommodations[0]._id,
        rating: 4,
        title: 'Great Safari Lodge',
        content: 'Beautiful location with amazing wildlife viewing. The staff was friendly and the food was excellent. Would definitely recommend for a safari experience.',
        helpful: 15,
        images: []
      }
    ];

    await Review.insertMany(reviews);
    console.log(`✅ Created ${reviews.length} sample reviews`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👤 Users: ${createdUsers.length}`);
    console.log(`🎯 Trips: ${createdTrips.length}`);
    console.log(`🏨 Accommodations: ${createdAccommodations.length}`);
    console.log(`⭐ Reviews: ${reviews.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run seeding
const runSeeding = async () => {
  try {
    await connectDB();
    await seedDatabase();
    console.log('✅ Seeding process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Seeding process failed:', error);
    process.exit(1);
  }
};

// Only run if this file is executed directly
if (require.main === module) {
  runSeeding();
}

module.exports = { seedDatabase, connectDB };