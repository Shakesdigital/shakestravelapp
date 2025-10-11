export interface Accommodation {
  id: number;
  slug: string;
  name: string;
  location: string;
  country: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  discount?: string;
  image: string;
  type: string;
  category: string;
  amenities: string[];
  specialFeatures: string[];
  availability: string;
  description: string;
  roomTypes: {
    name: string;
    description: string;
    price: number;
    capacity: number;
  }[];
}

export const accommodations: Accommodation[] = [
  {
    id: 1,
    slug: 'clouds-mountain-gorilla-lodge',
    name: 'Clouds Mountain Gorilla Lodge',
    location: 'Bwindi Impenetrable National Park',
    country: 'Uganda',
    rating: 4.9,
    reviews: 156,
    price: 450,
    originalPrice: 520,
    discount: 'Save $70',
    image: '/brand_assets/images/destinations/Bwindi/Bwindi Edited.jpg',
    type: 'Stone Cottage',
    category: 'Luxury Lodge',
    amenities: ['Free WiFi', 'Restaurant', 'Spa', 'Mountain Views', 'Eco-Friendly', 'Bar', 'Lounge', 'Garden'],
    specialFeatures: ['Panoramic Mountain Views', 'Eco-Friendly Design', 'Close to Gorilla Trekking'],
    availability: 'Available',
    description: 'Perched high on a ridge with panoramic views of the Virunga Volcanoes and Bwindi Impenetrable Forest, Clouds Mountain Gorilla Lodge offers luxurious stone cottages with stunning vistas. The perfect base for gorilla trekking adventures.',
    roomTypes: [
      {
        name: 'Deluxe Stone Cottage',
        description: 'Spacious cottage with fireplace, private veranda, and mountain views',
        price: 450,
        capacity: 2
      },
      {
        name: 'Family Stone Cottage',
        description: 'Two-bedroom cottage ideal for families, with shared living area',
        price: 700,
        capacity: 4
      }
    ]
  },
  {
    id: 2,
    slug: 'serena-hotel-kampala',
    name: 'Serena Hotel Kampala',
    location: 'Kampala',
    country: 'Uganda',
    rating: 4.5,
    reviews: 203,
    price: 180,
    originalPrice: 220,
    discount: 'Save $40',
    image: '/brand_assets/images/destinations/Kampala/Kampala Edited.jpg',
    type: 'Executive Room',
    category: 'City Hotel',
    amenities: ['Swimming Pool', 'Spa', 'Restaurant', 'Free WiFi', 'Conference Facilities', 'Fitness Center', 'Bar', 'Room Service'],
    specialFeatures: ['City Center Location', 'Business Center', 'International Cuisine'],
    availability: 'Available',
    description: 'Located in the heart of Kampala on a hilltop, Serena Hotel combines traditional Ugandan hospitality with modern luxury. Perfect for business travelers and tourists exploring the capital city.',
    roomTypes: [
      {
        name: 'Superior Room',
        description: 'Comfortable room with city views and modern amenities',
        price: 150,
        capacity: 2
      },
      {
        name: 'Executive Room',
        description: 'Spacious room with enhanced amenities and lounge access',
        price: 180,
        capacity: 2
      },
      {
        name: 'Executive Suite',
        description: 'Luxurious suite with separate living area and premium services',
        price: 280,
        capacity: 3
      }
    ]
  },
  {
    id: 3,
    slug: 'kibale-forest-camp',
    name: 'Kibale Forest Camp',
    location: 'Kibale National Park',
    country: 'Uganda',
    rating: 4.8,
    reviews: 127,
    price: 400,
    originalPrice: 480,
    discount: 'Save $80',
    image: '/brand_assets/images/destinations/Kibale/Kibale Forest 1.jpg',
    type: 'Forest Tent',
    category: 'Eco Camp',
    amenities: ['Chimpanzee Tracking', 'Restaurant', 'Bar', 'Forest Views', 'Wildlife Guides', 'Campfire', 'Solar Power'],
    specialFeatures: ['Chimpanzee Tracking Access', 'Forest Setting', 'Eco-Friendly'],
    availability: 'Available',
    description: 'Set on the edge of Kibale Forest National Park, this eco-camp offers comfortable safari tents with direct access to chimpanzee tracking. Experience the sounds of the forest while enjoying modern comforts.',
    roomTypes: [
      {
        name: 'Standard Safari Tent',
        description: 'Comfortable tent with en-suite bathroom and forest views',
        price: 350,
        capacity: 2
      },
      {
        name: 'Deluxe Safari Tent',
        description: 'Spacious tent with private deck and enhanced amenities',
        price: 400,
        capacity: 2
      }
    ]
  },
  {
    id: 4,
    slug: 'murchison-falls-safari-lodge',
    name: 'Murchison Falls Safari Lodge',
    location: 'Murchison Falls National Park',
    country: 'Uganda',
    rating: 4.7,
    reviews: 98,
    price: 280,
    originalPrice: 350,
    discount: 'Save $70',
    image: '/brand_assets/images/destinations/Murchison Falls/Murchison Falls 1.jpg',
    type: 'Park View Room',
    category: 'Safari Lodge',
    amenities: ['Nile River Views', 'Game Drives', 'Boating', 'Restaurant', 'Bar', 'Swimming Pool', 'Spa'],
    specialFeatures: ['Nile River Views', 'Boating Access', 'Falls Views'],
    availability: 'Available',
    description: 'Located on the banks of the Nile River with spectacular views of Murchison Falls. This lodge offers comfortable accommodations with easy access to game drives and boat cruises.',
    roomTypes: [
      {
        name: 'River View Room',
        description: 'Room with views of the Nile River and surrounding wilderness',
        price: 280,
        capacity: 2
      },
      {
        name: 'Falls View Suite',
        description: 'Premium suite with panoramic views of the falls',
        price: 380,
        capacity: 2
      }
    ]
  },
  {
    id: 5,
    slug: 'kidepo-valley-lodge',
    name: 'Kidepo Valley Lodge',
    location: 'Kidepo Valley National Park',
    country: 'Uganda',
    rating: 4.8,
    reviews: 89,
    price: 350,
    originalPrice: 420,
    discount: 'Save $70',
    image: '/brand_assets/images/destinations/Kidepo National Park/Kidepo Valley National Park 1.jpg',
    type: 'Valley View Room',
    category: 'Remote Safari Lodge',
    amenities: ['Wildlife Viewing', 'Game Drives', 'Cultural Tours', 'Restaurant', 'Bar', 'Campfire', 'Library'],
    specialFeatures: ['Remote Location', 'Unique Wildlife', 'Cultural Experiences'],
    availability: 'Available',
    description: 'Experience true wilderness in Uganda\'s most remote national park. This lodge offers stunning valley views and access to unique wildlife including cheetahs and ostriches found nowhere else in Uganda.',
    roomTypes: [
      {
        name: 'Standard Valley Room',
        description: 'Comfortable room with valley and mountain views',
        price: 350,
        capacity: 2
      },
      {
        name: 'Premium Safari Suite',
        description: 'Spacious suite with private deck and panoramic views',
        price: 480,
        capacity: 2
      }
    ]
  },
  {
    id: 6,
    slug: 'lake-bunyonyi-rock-view-resort',
    name: 'Lake Bunyonyi Rock View Resort',
    location: 'Lake Bunyonyi',
    country: 'Uganda',
    rating: 4.7,
    reviews: 123,
    price: 150,
    originalPrice: 180,
    discount: 'Save $30',
    image: '/brand_assets/images/destinations/Lake Bunyonyi/Lake Bunyonyi 1.jpg',
    type: 'Lake View Room',
    category: 'Lake Resort',
    amenities: ['Lake Views', 'Canoeing', 'Swimming', 'Restaurant', 'Cultural Tours', 'Bar', 'Garden', 'Beach Access'],
    specialFeatures: ['Lake Views', 'Island Tour', 'Canoeing'],
    availability: 'Available',
    description: 'Nestled on the shores of Lake Bunyonyi, the Switzerland of Africa, this resort offers stunning lake views and access to 29 islands. Perfect for relaxation after gorilla trekking.',
    roomTypes: [
      {
        name: 'Standard Lake View',
        description: 'Comfortable room with views of the lake and islands',
        price: 120,
        capacity: 2
      },
      {
        name: 'Deluxe Lake View',
        description: 'Spacious room with private balcony overlooking the lake',
        price: 150,
        capacity: 2
      },
      {
        name: 'Family Cottage',
        description: 'Two-bedroom cottage with living area and lake views',
        price: 250,
        capacity: 4
      }
    ]
  },
  {
    id: 7,
    slug: 'queen-elizabeth-bush-lodge',
    name: 'Queen Elizabeth Bush Lodge',
    location: 'Queen Elizabeth National Park',
    country: 'Uganda',
    rating: 4.6,
    reviews: 145,
    price: 320,
    originalPrice: 380,
    discount: 'Save $60',
    image: '/brand_assets/images/destinations/Queen Elizabeth National Park/Queen Elizabeth NP 2 Edited.jpg',
    type: 'Safari Tent',
    category: 'Safari Lodge',
    amenities: ['Kazinga Channel Views', 'Game Drives', 'Swimming Pool', 'Restaurant', 'Bar', 'Wildlife Viewing', 'Spa'],
    specialFeatures: ['Channel Views', 'Tree-Climbing Lions', 'Boat Safari Access'],
    availability: 'Available',
    description: 'Located near the famous Kazinga Channel with views of hippos and elephants. This bush lodge offers luxury safari tents and easy access to game drives to see tree-climbing lions.',
    roomTypes: [
      {
        name: 'Standard Safari Tent',
        description: 'Luxury tent with en-suite facilities and bush views',
        price: 280,
        capacity: 2
      },
      {
        name: 'Premium Safari Tent',
        description: 'Spacious tent with private deck and channel views',
        price: 320,
        capacity: 2
      }
    ]
  },
  {
    id: 8,
    slug: 'wildwaters-lodge',
    name: 'Wildwaters Lodge',
    location: 'Source of the Nile, Jinja',
    country: 'Uganda',
    rating: 4.9,
    reviews: 178,
    price: 550,
    originalPrice: 650,
    discount: 'Save $100',
    image: '/brand_assets/images/destinations/Jinja/Jinja Bridge 1.jpg',
    type: 'River Suite',
    category: 'Luxury Lodge',
    amenities: ['Nile River Island', 'Spa', 'Restaurant', 'Water Sports', 'Private Deck', 'Infinity Pool', 'Bar', 'Library'],
    specialFeatures: ['Private Island Location', 'White Water Views', 'Rafting Access'],
    availability: 'Available',
    description: 'Set on a private island in the Nile River, Wildwaters Lodge offers ultimate luxury with the sounds of white water rapids. Perfect for adventure seekers and those seeking tranquility.',
    roomTypes: [
      {
        name: 'River Suite',
        description: 'Luxury suite on stilts over the Nile with private deck',
        price: 550,
        capacity: 2
      },
      {
        name: 'Honeymoon Suite',
        description: 'Romantic suite with outdoor shower and rapids views',
        price: 650,
        capacity: 2
      }
    ]
  },
  {
    id: 9,
    slug: 'sipi-river-lodge',
    name: 'Sipi River Lodge',
    location: 'Sipi Falls, Mount Elgon',
    country: 'Uganda',
    rating: 4.5,
    reviews: 112,
    price: 120,
    originalPrice: 150,
    discount: 'Save $30',
    image: '/brand_assets/images/destinations/Sipi Falls/Sipi 1.jpg',
    type: 'Garden Cottage',
    category: 'Mountain Lodge',
    amenities: ['Waterfall Views', 'Hiking', 'Coffee Tours', 'Restaurant', 'Campfire', 'Garden', 'Bar'],
    specialFeatures: ['Waterfall Views', 'Coffee Farm', 'Hiking Trails'],
    availability: 'Available',
    description: 'Nestled on the slopes of Mount Elgon with views of Sipi Falls, this eco-lodge offers comfortable cottages surrounded by coffee plantations. Experience authentic Ugandan coffee culture.',
    roomTypes: [
      {
        name: 'Standard Cottage',
        description: 'Cozy cottage with garden and waterfall views',
        price: 100,
        capacity: 2
      },
      {
        name: 'Deluxe Cottage',
        description: 'Spacious cottage with private balcony and enhanced views',
        price: 120,
        capacity: 2
      }
    ]
  },
  {
    id: 10,
    slug: 'mihingo-lodge',
    name: 'Mihingo Lodge',
    location: 'Lake Mburo National Park',
    country: 'Uganda',
    rating: 4.8,
    reviews: 134,
    price: 380,
    originalPrice: 450,
    discount: 'Save $70',
    image: '/brand_assets/images/destinations/L Mburo National Park/Zebras in the wild 1.jpg',
    type: 'Rock Cottage',
    category: 'Luxury Lodge',
    amenities: ['Infinity Pool', 'Game Drives', 'Horse Riding', 'Restaurant', 'Bar', 'Spa', 'Wildlife Viewing'],
    specialFeatures: ['Rock Setting', 'Infinity Pool', 'Horse Safaris'],
    availability: 'Available',
    description: 'Built into a rocky outcrop with stunning views of Lake Mburo, this luxury lodge features an infinity pool and unique rock cottages. Enjoy horse riding safaris through the park.',
    roomTypes: [
      {
        name: 'Rock Cottage',
        description: 'Unique cottage built into rock face with private deck',
        price: 380,
        capacity: 2
      },
      {
        name: 'Family Rock Suite',
        description: 'Two-bedroom suite perfect for families',
        price: 600,
        capacity: 4
      }
    ]
  },
  {
    id: 11,
    slug: 'mount-gahinga-lodge',
    name: 'Mount Gahinga Lodge',
    location: 'Mgahinga Gorilla National Park',
    country: 'Uganda',
    rating: 4.7,
    reviews: 89,
    price: 420,
    originalPrice: 500,
    discount: 'Save $80',
    image: '/brand_assets/images/destinations/Bwindi/Bwindi Edited.jpg',
    type: 'Bandas',
    category: 'Safari Lodge',
    amenities: ['Volcano Views', 'Gorilla Trekking', 'Restaurant', 'Garden', 'Cultural Tours', 'Bar', 'Lounge', 'Fireplace'],
    specialFeatures: ['Volcano Views', 'Batwa Experience', 'Golden Monkey Tracking'],
    availability: 'Available',
    description: 'Set at the foot of the Virunga Volcanoes, this lodge offers traditional bandas with modern comforts. Perfect base for gorilla trekking and golden monkey tracking in Mgahinga.',
    roomTypes: [
      {
        name: 'Standard Banda',
        description: 'Traditional banda with volcano views and fireplace',
        price: 380,
        capacity: 2
      },
      {
        name: 'Deluxe Banda',
        description: 'Spacious banda with enhanced amenities and private garden',
        price: 420,
        capacity: 2
      }
    ]
  },
  {
    id: 12,
    slug: 'semuliki-safari-lodge',
    name: 'Semuliki Safari Lodge',
    location: 'Semuliki National Park',
    country: 'Uganda',
    rating: 4.4,
    reviews: 67,
    price: 280,
    originalPrice: 340,
    discount: 'Save $60',
    image: '/brand_assets/images/destinations/Semuliki Valley  National Park/Semuliki National Park 1.jpg',
    type: 'Luxury Tent',
    category: 'Safari Camp',
    amenities: ['Hot Springs Access', 'Forest Views', 'Swimming Pool', 'Restaurant', 'Bar', 'Bird Watching', 'Nature Walks'],
    specialFeatures: ['Hot Springs', 'Rainforest Setting', 'Unique Biodiversity'],
    availability: 'Available',
    description: 'Located in Uganda\'s only lowland tropical rainforest, this safari lodge offers luxury tents with access to the famous Sempaya hot springs. Perfect for bird watching enthusiasts.',
    roomTypes: [
      {
        name: 'Standard Safari Tent',
        description: 'Comfortable tent with forest views and en-suite bathroom',
        price: 250,
        capacity: 2
      },
      {
        name: 'Premium Safari Tent',
        description: 'Spacious tent with private deck overlooking the forest',
        price: 280,
        capacity: 2
      }
    ]
  }
];

export default accommodations;
