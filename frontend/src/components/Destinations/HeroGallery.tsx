'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroGalleryProps {
  destinationName: string;
  destinationSlug: string;
}

interface DestinationImage {
  src: string;
  alt: string;
  title: string;
  credit?: string;
}

const HeroGallery: React.FC<HeroGalleryProps> = ({ destinationName, destinationSlug }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Destination-specific image data (in production, this would come from API/CMS)
  const getDestinationImages = (slug: string): DestinationImage[] => {
    const imageMap: { [key: string]: DestinationImage[] } = {
      'bwindi-impenetrable-national-park': [
        { src: '/images/gorilla-trekking.jpg', alt: 'Mountain gorillas in Bwindi Forest', title: 'Mountain Gorilla Encounter' },
        { src: '/images/bwindi-forest.jpg', alt: 'Dense forest canopy of Bwindi', title: 'Ancient Rainforest' },
        { src: '/images/gorilla-family.jpg', alt: 'Gorilla family in natural habitat', title: 'Wildlife Photography' },
        { src: '/images/bwindi-trek.jpg', alt: 'Trekking through Bwindi forest', title: 'Forest Trekking Adventure' }
      ],
      'queen-elizabeth-national-park': [
        { src: '/images/tree-climbing-lions.jpg', alt: 'Lions resting in fig trees', title: 'Tree-Climbing Lions' },
        { src: '/images/kazinga-channel.jpg', alt: 'Boat safari on Kazinga Channel', title: 'Kazinga Channel Cruise' },
        { src: '/images/savanna-landscape.jpg', alt: 'Vast savanna plains', title: 'African Savanna' },
        { src: '/images/elephants-qenp.jpg', alt: 'Elephant herd in the park', title: 'Elephant Families' }
      ],
      'jinja': [
        { src: '/images/jinja-rafting.jpg', alt: 'White water rafting on River Nile', title: 'Nile River Adventures' },
        { src: '/images/source-of-nile.jpg', alt: 'Source of the River Nile', title: 'Source of the Nile' },
        { src: '/images/bungee-jumping.jpg', alt: 'Bungee jumping over the Nile', title: 'Extreme Sports' },
        { src: '/images/sunset-nile.jpg', alt: 'Beautiful sunset over River Nile', title: 'Nile Sunset Views' }
      ],
      'amboseli-national-park': [
        { src: '/images/amboseli-elephants.jpg', alt: 'Elephants with Mount Kilimanjaro backdrop', title: 'Kilimanjaro Views' },
        { src: '/images/amboseli-landscape.jpg', alt: 'Vast savanna with Mount Kilimanjaro', title: 'Iconic Views' },
        { src: '/images/amboseli-safari.jpg', alt: 'Safari vehicles tracking wildlife', title: 'Wildlife Safari' },
        { src: '/images/amboseli-maasai.jpg', alt: 'Maasai warriors with traditional livestock', title: 'Maasai Culture' }
      ],
      'diani-beach': [
        { src: '/images/diani-beach.jpg', alt: 'Pristine white sand beach', title: 'Coastal Paradise' },
        { src: '/images/diani-water-sports.jpg', alt: 'Water sports activities', title: 'Marine Adventures' },
        { src: '/images/diani-resort.jpg', alt: 'Beachfront resort accommodation', title: 'Beach Stays' },
        { src: '/images/diani-marine-life.jpg', alt: 'Tropical marine life', title: 'Underwater World' }
      ],
      'mara-national-reserve': [
        { src: '/images/mara-migration.jpg', alt: 'Great Migration crossing', title: 'The Great Migration' },
        { src: '/images/mara-safari.jpg', alt: 'Safari vehicles on plains', title: 'Safari Experience' },
        { src: '/images/mara-camp.jpg', alt: 'Luxury safari camp', title: 'Safari Accommodation' },
        { src: '/images/mara-wildlife.jpg', alt: 'Big Five wildlife', title: 'Wildlife Spectacular' }
      ],
      'serengeti-national-park': [
        { src: '/images/serengeti-plains.jpg', alt: 'Endless acacia plains', title: 'Endless Plains' },
        { src: '/images/serengeti-wildlife.jpg', alt: 'Migration animals crossing', title: 'Great Migration' },
        { src: '/images/serengeti-sunset.jpg', alt: 'Safari sunset', title: 'African Sunsets' },
        { src: '/images/serengeti-camp.jpg', alt: 'Tented safari camp', title: 'Safari Camping' }
      ],
      'ngorongoro-crater': [
        { src: '/images/ngorongoro-crater.jpg', alt: 'Wildlife in Ngorongoro Crater', title: 'Crater Safari' },
        { src: '/images/ngorongoro-wildlife.jpg', alt: 'Big Five in the crater', title: 'Big Five Safari' },
        { src: '/images/ngorongoro-view.jpg', alt: 'View from crater rim', title: 'Crater Rim Views' },
        { src: '/images/ngorongoro-lodge.jpg', alt: 'Lodge at crater rim', title: 'Crater Accommodation' }
      ],
      'kibale-national-park': [
        { src: '/images/kibale-chimps.jpg', alt: 'Chimpanzees in forest', title: 'Chimpanzee Trekking' },
        { src: '/images/kibale-forest.jpg', alt: 'Tropical forest canopy', title: 'Primate Habitat' },
        { src: '/images/kibale-research.jpg', alt: 'Research in primate behavior', title: 'Research Experience' },
        { src: '/images/kibale-trek.jpg', alt: 'Forest trekking', title: 'Forest Adventures' }
      ],
      'murchison-falls-national-park': [
        { src: '/images/murchison-falls.jpg', alt: 'Powerful waterfall cascade', title: 'The Falls' },
        { src: '/images/murchison-game-drive.jpg', alt: 'Game drive in park', title: 'Wildlife Safari' },
        { src: '/images/murchison-boat-safari.jpg', alt: 'Boat safari on Nile', title: 'River Safari' },
        { src: '/images/murchison-lodge.jpg', alt: 'Lodge near the falls', title: 'Park Accommodation' }
      ],
      'lake-nakuru-national-park': [
        { src: '/images/lake-nakuru-flamingos.jpg', alt: 'Thousands of pink flamingos', title: 'Flamingo Paradise' },
        { src: '/images/lake-nakuru-rhinos.jpg', alt: 'Rhinoceros in sanctuary', title: 'Rhino Sanctuary' },
        { src: '/images/lake-nakuru-safari.jpg', alt: 'Safari in alkaline lake area', title: 'Alkaline Lake Safari' },
        { src: '/images/lake-nakuru-lodge.jpg', alt: 'Lodge with lake views', title: 'Lake View Accommodation' }
      ],
      'samburu-national-reserve': [
        { src: '/images/samburu-special-six.jpg', alt: 'Unique wildlife species', title: 'Special Six' },
        { src: '/images/samburu-culture.jpg', alt: 'Samburu cultural experience', title: 'Cultural Encounter' },
        { src: '/images/samburu-river.jpg', alt: 'Ewaso Nyiro River landscape', title: 'River Landscape' },
        { src: '/images/samburu-camp.jpg', alt: 'Luxury camp in Samburu', title: 'Samburu Safari Camp' }
      ],
      'tsavo-national-parks': [
        { src: '/images/tsavo-red-elephants.jpg', alt: 'Red elephants covered in dust', title: 'Red Elephants' },
        { src: '/images/tsavo-bush.jpg', alt: 'Vast bush landscape', title: 'Bush Adventure' },
        { src: '/images/tsavo-rock.jpg', alt: 'Bushman Rock landmark', title: 'Landmark Views' },
        { src: '/images/tsavo-safari.jpg', alt: 'Safari in Tsavo', title: 'Tsavo Safari' }
      ],
      'mount-kilimanjaro': [
        { src: '/images/kilimanjaro-summit.jpg', alt: 'Summit of Mount Kilimanjaro', title: 'Summit Experience' },
        { src: '/images/kilimanjaro-trek.jpg', alt: 'Trekking through different zones', title: 'Trekking Adventure' },
        { src: '/images/kilimanjaro-landscape.jpg', alt: 'Scenic mountain landscape', title: 'Mountain Views' },
        { src: '/images/kilimanjaro-camp.jpg', alt: 'High altitude camping', title: 'High Altitude Adventure' }
      ],
      'kidepo-valley-national-park': [
        { src: '/images/kidepo-landscape.jpg', alt: 'Remote wilderness landscape', title: 'Remote Wilderness' },
        { src: '/images/kidepo-wildlife.jpg', alt: 'Unique wildlife in park', title: 'Unique Wildlife' },
        { src: '/images/kidepo-cultural.jpg', alt: 'Karamojong cultural interaction', title: 'Cultural Experience' },
        { src: '/images/kidepo-accommodation.jpg', alt: 'Remote park accommodation', title: 'Remote Stay' }
      ],
      'rwenzori-mountains-national-park': [
        { src: '/images/rwenzori-mountain.jpg', alt: 'Rwenzori mountain peaks', title: 'Mountain Peaks' },
        { src: '/images/rwenzori-trek.jpg', alt: 'Trekking through mountain terrain', title: 'Mountain Trekking' },
        { src: '/images/rwenzori-glacier.jpg', alt: 'Equatorial glaciers', title: 'Glacial Views' },
        { src: '/images/rwenzori-landscape.jpg', alt: 'Alpine mountain landscape', title: 'Alpine Adventure' }
      ],
      'hells-gate-national-park': [
        { src: '/images/hells-gate-landscape.jpg', alt: 'Dramatic gorges and cliffs', title: 'Dramatic Gorges' },
        { src: '/images/hells-gate-cycling.jpg', alt: 'Cycling through the park', title: 'Cycling Adventure' },
        { src: '/images/hells-gate-rock-climbing.jpg', alt: 'Rock climbing activities', title: 'Rock Climbing' },
        { src: '/images/hells-gate-geothermal.jpg', alt: 'Geothermal features', title: 'Geothermal Activity' }
      ],
      'lake-mburo-national-park': [
        { src: '/images/lake-mburo-landscape.jpg', alt: 'Acacia woodland around the lake', title: 'Acacia Woodland' },
        { src: '/images/lake-mburo-wildlife.jpg', alt: 'Zebra and other wildlife', title: 'Wildlife Viewing' },
        { src: '/images/lake-mburo-boating.jpg', alt: 'Boating on the lake', title: 'Lake Activities' },
        { src: '/images/lake-mburo-lodge.jpg', alt: 'Lakeside accommodation', title: 'Lakeside Stay' }
      ],
      'lake-turkana-national-parks': [
        { src: '/images/lake-turkana-landscape.jpg', alt: 'Turkana desert landscape', title: 'Desert Lake' },
        { src: '/images/lake-turkana-fossil.jpg', alt: 'Fossil sites', title: 'Cradle of Mankind' },
        { src: '/images/lake-turkana-parks.jpg', alt: 'National parks around the lake', title: 'National Parks' },
        { src: '/images/lake-turkana-communities.jpg', alt: 'Local Turkana communities', title: 'Cultural Experience' }
      ],
      'lamu-old-town': [
        { src: '/images/lamu-town.jpg', alt: 'Historic Lamu architecture', title: 'Historic Town' },
        { src: '/images/lamu-beaches.jpg', alt: 'Pr pristine beaches', title: 'Beach Paradise' },
        { src: '/images/lamu-dhow.jpg', alt: 'Traditional dhow sailing', title: 'Dhow Sailing' },
        { src: '/images/lamu-culture.jpg', alt: 'Swahili cultural heritage', title: 'Swahili Culture' }
      ],
      'mount-elgon-national-park': [
        { src: '/images/mount-elgon-landscape.jpg', alt: 'Elgon volcanic caldera', title: 'Volcanic Landscape' },
        { src: '/images/mount-elgon-trekking.jpg', alt: 'Mountain trekking', title: 'Trekking Adventure' },
        { src: '/images/mount-elgon-sipi-falls.jpg', alt: 'Sipi Falls', title: 'Sipi Falls' },
        { src: '/images/mount-elgon-caves.jpg', alt: 'Kitum Cave', title: 'Mountain Caves' }
      ],
      'mount-kenya-national-park': [
        { src: '/images/mount-kenya-landscape.jpg', alt: 'Mount Kenya peaks', title: 'Mountain Peaks' },
        { src: '/images/mount-kenya-trekking.jpg', alt: 'Mountain trekking', title: 'Trekking Adventure' },
        { src: '/images/mount-kenya-wildlife.jpg', alt: 'Mountain wildlife', title: 'Mountain Wildlife' },
        { src: '/images/mount-kenya-accommodation.jpg', alt: 'Mountain accommodation', title: 'Mountain Stay' }
      ],
      'nairobi-national-park': [
        { src: '/images/nairobi-park-landscape.jpg', alt: 'Park with Nairobi skyline', title: 'Capital City Park' },
        { src: '/images/nairobi-wildlife.jpg', alt: 'Wildlife in the park', title: 'Wildlife Safari' },
        { src: '/images/nairobi-rhino.jpg', alt: 'Rhino sanctuary', title: 'Rhino Conservation' },
        { src: '/images/nairobi-safari.jpg', alt: 'Safari with city view', title: 'Unique Safari' }
      ],
      'semuliki-valley-national-park': [
        { src: '/images/semuliki-landscape.jpg', alt: 'Tropical valley landscape', title: 'Tropical Valley' },
        { src: '/images/semuliki-hot-springs.jpg', alt: 'Sempaya hot springs', title: 'Hot Springs' },
        { src: '/images/semuliki-wildlife.jpg', alt: 'Diverse wildlife', title: 'Wildlife Diversity' },
        { src: '/images/semuliki-jungle.jpg', alt: 'Tropical jungle', title: 'Jungle Experience' }
      ],
      'watamu-marine-park': [
        { src: '/images/watamu-beach.jpg', alt: 'Pristine white sand beach', title: 'Beach Paradise' },
        { src: '/images/watamu-coral.jpg', alt: 'Coral reef snorkeling', title: 'Coral Reefs' },
        { src: '/images/watamu-canoes.jpg', alt: 'Traditional canoes', title: 'Cultural Activities' },
        { src: '/images/watamu-marine-life.jpg', alt: 'Marine life', title: 'Marine Adventures' }
      ]
    };

    // Default images if specific destination not found
    const defaultImages: DestinationImage[] = [
      { src: '/images/uganda-hero.jpg', alt: `${destinationName} landscape`, title: `Discover ${destinationName}` },
      { src: '/images/uganda-culture.jpg', alt: `Cultural experiences in ${destinationName}`, title: 'Cultural Heritage' },
      { src: '/images/uganda-wildlife.jpg', alt: `Wildlife in ${destinationName}`, title: 'Wildlife Encounters' },
      { src: '/images/uganda-adventure.jpg', alt: `Adventure activities in ${destinationName}`, title: 'Adventure Activities' }
    ];

    return imageMap[slug] || defaultImages;
  };

  const images = getDestinationImages(destinationSlug);
  const primaryColor = '#195e48';

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying || !isMounted) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [images.length, isAutoPlaying, isMounted]);

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const goToPrevious = () => {
    setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section 
      className="hero-gallery relative h-[80vh] overflow-hidden"
      aria-label={`${destinationName} image gallery`}
      role="banner"
    >
      {/* Background Images */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: 'linear-gradient(135deg, #195e48 0%, #2d7f5b 50%, #1a5945 100%)'
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              style={{ objectFit: 'cover' }}
              priority={index === 0}
              className="w-full h-full"
              unoptimized
              onError={(e) => {
                // Fallback to a solid color background if image fails
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" aria-hidden="true"></div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center text-white">
        <div className="text-center max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-lg">
            Explore {destinationName}
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-8 opacity-90 drop-shadow-md">
            {images[currentImageIndex].title}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-white text-gray-900 px-8 py-3 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const experiencesSection = document.getElementById('experiences-section');
                  experiencesSection?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Discover Experiences
            </button>
            <button
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-white hover:text-gray-900 transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2"
              style={{ backgroundColor: `${primaryColor}80` }}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const accommodationsSection = document.getElementById('accommodations-section');
                  accommodationsSection?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Find Accommodations
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-offset-2"
        aria-label="Previous image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-offset-2"
        aria-label="Next image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Image Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-offset-2 ${
              index === currentImageIndex 
                ? 'bg-white scale-110' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Go to image ${index + 1}: ${images[index].title}`}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="absolute top-4 right-4 z-20 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
        {currentImageIndex + 1} / {images.length}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-offset-2"
          aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isAutoPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
      </div>
    </section>
  );
};

export default HeroGallery;
