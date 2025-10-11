export interface Experience {
  id: number;
  slug: string;
  title: string;
  location: string;
  country: string;
  rating: number;
  reviews: number;
  image: string;
  duration: string;
  category: string;
  highlights: string[];
  difficulty: string;
  availability: string;
  description: string;
  price: number;
  originalPrice?: number;
  whatsIncluded: string[];
  itinerary?: {
    time: string;
    activity: string;
  }[];
}

export const experiences: Experience[] = [
  {
    id: 1,
    slug: 'gorilla-trekking-bwindi',
    title: 'Gorilla Trekking in Bwindi',
    location: 'Bwindi Impenetrable National Park',
    country: 'Uganda',
    rating: 4.9,
    reviews: 234,
    image: '/brand_assets/images/destinations/Bwindi/Bwindi Edited.jpg',
    duration: 'Full Day',
    category: 'Wildlife',
    highlights: [
      'Encounter endangered mountain gorillas in their natural habitat',
      'Trek through ancient rainforest with expert guides',
      'Spend one hour observing gorilla families',
      'Visit Batwa community for cultural experience',
      'UNESCO World Heritage Site experience'
    ],
    difficulty: 'Moderate',
    availability: 'Limited Spots',
    description: 'Experience the magic of encountering mountain gorillas in their natural habitat in Bwindi Impenetrable National Park. This once-in-a-lifetime adventure takes you deep into ancient rainforest where nearly half of the world\'s remaining mountain gorillas live.',
    price: 800,
    originalPrice: 950,
    whatsIncluded: [
      'Gorilla trekking permit',
      'Professional guide and tracker services',
      'Park entrance fees',
      'Trekking poles and walking sticks',
      'Bottled water and energy snacks',
      'Transportation from meeting point',
      'Batwa cultural experience',
      'Certificate of achievement'
    ],
    itinerary: [
      { time: '6:00 AM', activity: 'Early morning briefing at park headquarters' },
      { time: '8:00 AM', activity: 'Trek begins into Bwindi Forest' },
      { time: '10:00 AM', activity: 'Gorilla encounter (up to 1 hour)' },
      { time: '3:00 PM', activity: 'Return trek to headquarters' },
      { time: '4:30 PM', activity: 'Batwa cultural experience' }
    ]
  },
  {
    id: 2,
    slug: 'chimp-tracking-kibale',
    title: 'Chimp Tracking in Kibale',
    location: 'Kibale National Park',
    country: 'Uganda',
    rating: 4.8,
    reviews: 178,
    image: '/brand_assets/images/destinations/Kibale/Kibale Forest 1.jpg',
    duration: 'Half Day',
    category: 'Wildlife',
    highlights: [
      'Track chimpanzees with expert primatologists',
      'Explore the Primate Capital of the World',
      'Observe 13 primate species in their natural habitat',
      'Learn about chimpanzee behavior and conservation',
      'Forest canopy walk experience'
    ],
    difficulty: 'Moderate',
    availability: 'Daily',
    description: 'Track our closest relatives with expert primatologists in the \'Primate Capital of the World\'. Kibale Forest is home to over 1,500 chimpanzees and 13 primate species.',
    price: 250,
    originalPrice: 300,
    whatsIncluded: [
      'Chimpanzee tracking permit',
      'Professional guide services',
      'Park entrance fees',
      'Forest walk equipment',
      'Bottled water',
      'Transportation within the park',
      'Certificate of participation'
    ],
    itinerary: [
      { time: '7:00 AM', activity: 'Briefing at park headquarters' },
      { time: '8:00 AM', activity: 'Begin chimpanzee tracking' },
      { time: '10:00 AM', activity: 'Chimpanzee observation' },
      { time: '12:00 PM', activity: 'Return and debrief' }
    ]
  },
  {
    id: 3,
    slug: 'kidepo-valley-safari',
    title: 'Kidepo Valley Safari',
    location: 'Kidepo Valley National Park',
    country: 'Uganda',
    rating: 4.8,
    reviews: 105,
    image: '/brand_assets/images/destinations/Kidepo National Park/Kidepo Valley National Park 1.jpg',
    duration: '3 Days',
    category: 'Wildlife Safari',
    highlights: [
      'Experience Uganda\'s most remote national park',
      'Spot unique wildlife including cheetahs and ostriches',
      'Game drives through pristine savannah',
      'Visit traditional Karamojong communities',
      'Breathtaking mountain and valley landscapes'
    ],
    difficulty: 'Moderate',
    availability: 'Seasonal',
    description: 'Experience Uganda\'s most remote and pristine national park with exceptional wildlife viewing. Kidepo Valley offers a true wilderness experience with diverse landscapes and unique wildlife.',
    price: 1200,
    originalPrice: 1400,
    whatsIncluded: [
      'All park entrance fees',
      'Professional safari guide',
      'Game drive activities',
      'Accommodation for 2 nights',
      'All meals during safari',
      'Cultural village visit',
      'Transportation to/from park'
    ],
    itinerary: [
      { time: 'Day 1', activity: 'Travel to Kidepo, evening game drive' },
      { time: 'Day 2', activity: 'Morning and afternoon game drives, cultural visit' },
      { time: 'Day 3', activity: 'Morning game drive, return journey' }
    ]
  },
  {
    id: 4,
    slug: 'murchison-falls-safari',
    title: 'Murchison Falls Safari',
    location: 'Murchison Falls National Park',
    country: 'Uganda',
    rating: 4.7,
    reviews: 156,
    image: '/brand_assets/images/destinations/Murchison Falls/Murchison Falls 1.jpg',
    duration: '2 Days',
    category: 'Wildlife Safari',
    highlights: [
      'Witness the world\'s most powerful waterfall',
      'Boat cruise on the Nile River',
      'Spot elephants, lions, giraffes, and hippos',
      'Explore Uganda\'s largest national park',
      'Top of the falls hike experience'
    ],
    difficulty: 'Easy',
    availability: 'Daily',
    description: 'Witness the world\'s most powerful waterfall and explore Uganda\'s largest national park. The Nile River explodes through a narrow gorge creating spectacular falls.',
    price: 650,
    originalPrice: 750,
    whatsIncluded: [
      'Park entrance fees',
      'Professional guide',
      'Game drive activities',
      'Boat cruise to the falls',
      '1 night accommodation',
      'All meals',
      'Transportation'
    ],
    itinerary: [
      { time: 'Day 1', activity: 'Arrival, afternoon game drive' },
      { time: 'Day 2', activity: 'Morning boat cruise, top of falls hike, return' }
    ]
  },
  {
    id: 5,
    slug: 'queen-elizabeth-safari',
    title: 'Queen Elizabeth Safari',
    location: 'Queen Elizabeth National Park',
    country: 'Uganda',
    rating: 4.8,
    reviews: 189,
    image: '/brand_assets/images/destinations/Queen Elizabeth National Park/Queen Elizabeth NP 2 Edited.jpg',
    duration: '2 Days',
    category: 'Wildlife Safari',
    highlights: [
      'See famous tree-climbing lions in Ishasha',
      'Kazinga Channel boat cruise',
      'Diverse ecosystems from savannah to wetlands',
      'Over 600 bird species',
      'Explosive crater lakes exploration'
    ],
    difficulty: 'Easy',
    availability: 'Daily',
    description: 'Discover tree-climbing lions and diverse ecosystems in Uganda\'s most popular safari destination. Queen Elizabeth National Park offers incredible wildlife viewing and stunning landscapes.',
    price: 700,
    originalPrice: 850,
    whatsIncluded: [
      'Park entrance fees',
      'Professional guide',
      'Game drives',
      'Kazinga Channel boat cruise',
      '1 night accommodation',
      'All meals',
      'Transportation'
    ],
    itinerary: [
      { time: 'Day 1', activity: 'Arrival, afternoon game drive, crater lakes' },
      { time: 'Day 2', activity: 'Morning boat cruise, Ishasha sector for tree-climbing lions' }
    ]
  },
  {
    id: 6,
    slug: 'white-water-rafting-jinja',
    title: 'White Water Rafting Jinja',
    location: 'Source of the Nile, Jinja',
    country: 'Uganda',
    rating: 4.9,
    reviews: 234,
    image: '/brand_assets/images/destinations/Jinja/Jinja Bridge 1.jpg',
    duration: 'Full Day',
    category: 'Adventure & Water Sports',
    highlights: [
      'World-class Grade 5 rapids',
      'Raft at the source of the Nile River',
      'Professional safety equipment and guides',
      'BBQ lunch on the riverbank',
      'Photos and videos of your adventure'
    ],
    difficulty: 'Challenging',
    availability: 'Daily',
    description: 'Experience world-class white water rafting at the source of the mighty Nile River. Tackle Grade 5 rapids in one of the world\'s top rafting destinations.',
    price: 150,
    originalPrice: 180,
    whatsIncluded: [
      'Professional rafting guides',
      'All safety equipment',
      'Safety briefing and training',
      'BBQ lunch on the river',
      'Photos and videos',
      'Transportation from Jinja',
      'Soft drinks and snacks'
    ],
    itinerary: [
      { time: '8:00 AM', activity: 'Pick up and safety briefing' },
      { time: '9:00 AM', activity: 'Begin rafting adventure' },
      { time: '12:00 PM', activity: 'Riverbank BBQ lunch' },
      { time: '2:00 PM', activity: 'Continue rafting' },
      { time: '4:00 PM', activity: 'End rafting, return journey' }
    ]
  },
  {
    id: 7,
    slug: 'lake-bunyonyi-canoeing',
    title: 'Lake Bunyonyi Canoeing',
    location: 'Lake Bunyonyi',
    country: 'Uganda',
    rating: 4.6,
    reviews: 98,
    image: '/brand_assets/images/destinations/Lake Bunyonyi/Lake Bunyonyi 1.jpg',
    duration: 'Half Day',
    category: 'Adventure & Relaxation',
    highlights: [
      'Explore the Switzerland of Africa',
      'Island hopping on 29 islands',
      'Bird watching paradise',
      'Swimming in bilharzia-free waters',
      'Traditional dugout canoe experience'
    ],
    difficulty: 'Easy',
    availability: 'Daily',
    description: 'Explore the \'Switzerland of Africa\' with its stunning islands and crystal-clear waters. Lake Bunyonyi is one of Africa\'s deepest lakes with 29 beautiful islands.',
    price: 60,
    originalPrice: 80,
    whatsIncluded: [
      'Traditional dugout canoe',
      'Local guide',
      'Island hopping tour',
      'Bird watching guide',
      'Swimming opportunities',
      'Light refreshments'
    ],
    itinerary: [
      { time: '9:00 AM', activity: 'Start canoeing adventure' },
      { time: '10:00 AM', activity: 'Visit Punishment Island' },
      { time: '11:00 AM', activity: 'Explore more islands and bird watching' },
      { time: '12:30 PM', activity: 'Return to shore' }
    ]
  },
  {
    id: 8,
    slug: 'rwenzori-mountains-trek',
    title: 'Rwenzori Mountains Trek',
    location: 'Rwenzori Mountains National Park',
    country: 'Uganda',
    rating: 4.9,
    reviews: 67,
    image: '/brand_assets/images/destinations/Mt Rwenzori/Mt Rwenzori 1.jpg',
    duration: '7-9 Days',
    category: 'Adventure & Hiking',
    highlights: [
      'Conquer the legendary Mountains of the Moon',
      'Snow-capped peaks at the equator',
      'Mystical glaciers and alpine vegetation',
      'UNESCO World Heritage Site',
      'Unique Afro-alpine ecosystem'
    ],
    difficulty: 'Challenging',
    availability: 'Seasonal',
    description: 'Conquer the legendary Mountains of the Moon with their mystical glaciers and alpine vegetation. The Rwenzori Mountains offer one of Africa\'s most challenging treks.',
    price: 1800,
    originalPrice: 2100,
    whatsIncluded: [
      'Park entrance fees',
      'Professional mountain guides',
      'Porters',
      '6-8 nights mountain hut accommodation',
      'All meals on the mountain',
      'Cooking equipment',
      'First aid and emergency evacuation insurance'
    ],
    itinerary: [
      { time: 'Day 1-2', activity: 'Ascent through bamboo and montane forest' },
      { time: 'Day 3-4', activity: 'Heather and alpine zones' },
      { time: 'Day 5', activity: 'Summit attempt (optional)' },
      { time: 'Day 6-7', activity: 'Descent through different route' }
    ]
  },
  {
    id: 9,
    slug: 'lake-mburo-safari',
    title: 'Lake Mburo Wildlife Safari',
    location: 'Lake Mburo National Park',
    country: 'Uganda',
    rating: 4.5,
    reviews: 112,
    image: '/brand_assets/images/destinations/L Mburo National Park/Zebras in the wild 1.jpg',
    duration: '1 Day',
    category: 'Wildlife Safari',
    highlights: [
      'Uganda\'s smallest savannah park',
      'Large zebra herds and impalas',
      'Boat safari on the lake',
      'Night game drives',
      'Unique acacia woodland ecosystem'
    ],
    difficulty: 'Easy',
    availability: 'Daily',
    description: 'Uganda\'s smallest savannah park packed with zebras, impalas, and unique acacia woodlands. Perfect for a day trip or weekend getaway.',
    price: 180,
    originalPrice: 220,
    whatsIncluded: [
      'Park entrance fees',
      'Game drive',
      'Boat safari',
      'Professional guide',
      'Lunch',
      'Transportation',
      'Binoculars'
    ],
    itinerary: [
      { time: '7:00 AM', activity: 'Depart for Lake Mburo' },
      { time: '10:00 AM', activity: 'Morning game drive' },
      { time: '12:00 PM', activity: 'Lunch' },
      { time: '2:00 PM', activity: 'Boat safari' },
      { time: '5:00 PM', activity: 'Return journey' }
    ]
  },
  {
    id: 10,
    slug: 'sipi-falls-hiking',
    title: 'Sipi Falls Hiking',
    location: 'Sipi Falls, Mount Elgon',
    country: 'Uganda',
    rating: 4.7,
    reviews: 145,
    image: '/brand_assets/images/destinations/Sipi Falls/Sipi 1.jpg',
    duration: 'Half Day',
    category: 'Adventure & Hiking',
    highlights: [
      'Three spectacular waterfalls',
      'Coffee plantation tour',
      'Mountain views of Mount Elgon',
      'Local community experience',
      'Rock climbing opportunities'
    ],
    difficulty: 'Moderate',
    availability: 'Daily',
    description: 'Trek through stunning waterfalls and learn about coffee cultivation on the slopes of Mount Elgon. Sipi Falls offers breathtaking scenery and cultural experiences.',
    price: 40,
    originalPrice: 55,
    whatsIncluded: [
      'Local guide',
      'Three waterfalls hike',
      'Coffee tour',
      'Light refreshments',
      'Cultural village visit',
      'Certificate of participation'
    ],
    itinerary: [
      { time: '8:00 AM', activity: 'Start waterfall hike' },
      { time: '9:30 AM', activity: 'Visit first and second falls' },
      { time: '11:00 AM', activity: 'Coffee plantation tour' },
      { time: '12:00 PM', activity: 'Visit third waterfall and return' }
    ]
  },
  {
    id: 11,
    slug: 'mgahinga-gorilla-trekking',
    title: 'Mgahinga Gorilla Trekking',
    location: 'Mgahinga Gorilla National Park',
    country: 'Uganda',
    rating: 4.8,
    reviews: 78,
    image: '/brand_assets/images/destinations/Bwindi/Bwindi Edited.jpg',
    duration: 'Full Day',
    category: 'Wildlife',
    highlights: [
      'Track mountain gorillas in Virunga Mountains',
      'Golden monkey encounters',
      'Three volcanic peaks backdrop',
      'Cross-border park experience',
      'Batwa cultural trail'
    ],
    difficulty: 'Moderate',
    availability: 'Limited Spots',
    description: 'Track gorillas and golden monkeys in the shadow of the Virunga volcanic mountains. Mgahinga offers a unique gorilla trekking experience with volcanic landscapes.',
    price: 800,
    originalPrice: 950,
    whatsIncluded: [
      'Gorilla trekking permit',
      'Professional guides',
      'Park entrance fees',
      'Trekking equipment',
      'Bottled water and snacks',
      'Transportation',
      'Certificate of achievement'
    ],
    itinerary: [
      { time: '7:00 AM', activity: 'Briefing at park headquarters' },
      { time: '8:00 AM', activity: 'Begin gorilla trek' },
      { time: '11:00 AM', activity: 'Gorilla encounter' },
      { time: '2:00 PM', activity: 'Return and optional Batwa trail' }
    ]
  },
  {
    id: 12,
    slug: 'semuliki-hot-springs',
    title: 'Semuliki Hot Springs',
    location: 'Semuliki National Park',
    country: 'Uganda',
    rating: 4.4,
    reviews: 89,
    image: '/brand_assets/images/destinations/Semuliki Valley  National Park/Semuliki National Park 1.jpg',
    duration: 'Half Day',
    category: 'Nature & Cultural',
    highlights: [
      'Boiling hot springs experience',
      'Uganda\'s only lowland tropical rainforest',
      'Unique bird species',
      'Batwa pygmy cultural encounters',
      'Forest nature walks'
    ],
    difficulty: 'Easy',
    availability: 'Daily',
    description: 'Explore Uganda\'s only true lowland tropical rainforest with boiling hot springs. Semuliki offers unique biodiversity and cultural experiences.',
    price: 80,
    originalPrice: 100,
    whatsIncluded: [
      'Park entrance fees',
      'Local guide',
      'Hot springs visit',
      'Forest nature walk',
      'Batwa cultural experience',
      'Light refreshments'
    ],
    itinerary: [
      { time: '9:00 AM', activity: 'Depart for Semuliki' },
      { time: '10:00 AM', activity: 'Forest walk to hot springs' },
      { time: '11:30 AM', activity: 'Explore Sempaya hot springs' },
      { time: '1:00 PM', activity: 'Batwa community visit and return' }
    ]
  }
];

export { experiences };
export default experiences;
