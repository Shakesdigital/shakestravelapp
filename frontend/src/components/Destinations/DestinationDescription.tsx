'use client';

import React, { useState } from 'react';

interface DestinationDescriptionProps {
  destinationName: string;
  destinationSlug: string;
}

interface DestinationInfo {
  description: string;
  highlights: string[];
  history: string;
  culture: string;
  naturalFeatures: string;
  accessibility: {
    byAir: string;
    byRoad: string;
    publicTransport: string;
    nearestAirport: string;
    drivingTime: string;
    bestTimeToVisit: string;
  };
}

const DestinationDescription: React.FC<DestinationDescriptionProps> = ({ 
  destinationName, 
  destinationSlug 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'getting-there'>('overview');
  const primaryColor = '#195e48';

  // Destination-specific information (in production, this would come from CMS/API)
  const getDestinationInfo = (slug: string): DestinationInfo => {
    const destinationMap: { [key: string]: DestinationInfo } = {
      'amboseli-national-park': {
        description: 'Amboseli National Park is Kenya\'s premier wildlife destination, famous for its spectacular views of Mount Kilimanjaro and large herds of elephants. The park covers 392 square kilometers of savanna and offers some of the best wildlife photography opportunities in East Africa.',
        highlights: [
          'Large elephant herds with Mount Kilimanjaro backdrop',
          'Over 1,000 bird species recorded',
          'Maasai cultural encounters',
          'Big Five wildlife viewing',
          'Excellent photographic opportunities'
        ],
        history: 'Established as a national park in 1974, Amboseli has been a Maasai ranch and traditional hunting ground for centuries. The name comes from the Maasai word "Samburu" meaning "dry earth."',
        culture: 'The area is home to the Maasai people who have coexisted with wildlife for generations. Visitors can experience authentic Maasai culture through village visits and cultural walks.',
        naturalFeatures: 'The park features the iconic Mount Kilimanjaro, seasonal swamps, savanna grasslands, and the Olooloolo (Mt. Range) that provides a natural boundary with Tanzania.',
        accessibility: {
          byAir: 'Fly to Amboseli Airstrip or Wilson Airport in Nairobi, then road transfer. Charter flights available from Nairobi.',
          byRoad: '4-5 hours drive from Nairobi via A109. Good tarmac roads most of the way.',
          publicTransport: 'Matatu services from Nairobi to Kimana Gate, then park entry. Not recommended for tourists.',
          nearestAirport: 'Wilson Airport Nairobi (250km), Amboseli Airstrip (5km)',
          drivingTime: '4-5 hours from Nairobi, 2 hours from Tsavo West',
          bestTimeToVisit: 'January-March and June-October (dry seasons) for best wildlife viewing and clearer views of Mount Kilimanjaro'
        }
      },
      'bwindi-impenetrable-national-park': {
        description: 'Bwindi Impenetrable Forest is a UNESCO World Heritage Site in southwestern Uganda, home to nearly half of the world\'s remaining mountain gorillas. This ancient rainforest spans 331 square kilometers and offers one of the most extraordinary wildlife experiences on Earth.',
        highlights: [
          'Mountain gorilla trekking with 19 habituated gorilla families',
          'Over 400 bird species including 23 endemic to the Albertine Rift',
          '120 mammal species and 200 butterfly species',
          'Ancient forest ecosystem dating back 25,000 years',
          'Cultural encounters with the Batwa people'
        ],
        history: 'Bwindi has been a forest reserve since 1961 and became a national park in 1991. The name "Bwindi" comes from the local Rukiga word meaning "impenetrable," referring to the dense vegetation that characterizes this ancient ecosystem.',
        culture: 'The area is home to the Batwa people, often called "People of the Forest," who lived as hunter-gatherers in the forest for thousands of years. Today, cultural tours offer insights into their traditional way of life.',
        naturalFeatures: 'The park features a complex ecosystem with montane and lowland forests, creating a unique habitat for endangered mountain gorillas, chimpanzees, and numerous endemic species.',
        accessibility: {
          byAir: 'Fly to Kihihi Airstrip (1-hour drive to park) or Kisoro Airstrip (2-hour drive). Charter flights available from Entebbe Airport.',
          byRoad: '8-9 hours drive from Kampala via Mbarara and Kabale. Roads are generally good but can be challenging during rainy season.',
          publicTransport: 'Bus services available from Kampala to Kabale, then taxi/boda-boda to park entrance. Not recommended for tourists.',
          nearestAirport: 'Kihihi Airstrip (30km), Kisoro Airstrip (70km), Entebbe International Airport (460km)',
          drivingTime: '8-9 hours from Kampala, 2 hours from Kabale',
          bestTimeToVisit: 'June-August and December-February (dry seasons) for easier trekking conditions'
        }
      },
      'diani-beach': {
        description: 'Diani Beach is one of the most beautiful beaches in East Africa, stretching for 25km of white sand and crystal-clear waters along the Kenyan coast. The beach is renowned for its pristine marine environment and excellent water sports activities.',
        highlights: [
          '25km of pristine white sand beaches',
          'Excellent diving and snorkeling opportunities',
          'Marine wildlife including dolphins and sea turtles',
          'Luxury beach resorts and villas',
          'Water sports activities like kitesurfing and windsurfing'
        ],
        history: 'Diani has been a fishing village for centuries but was developed as a tourist destination in the 1980s. The area has historical ties to Arab traders and Portuguese explorers.',
        culture: 'The local Digo and Swahili communities offer rich cultural experiences with traditional dhow sailing, cultural tours, and authentic cuisine.',
        naturalFeatures: 'The beach features coral reefs, marine parks, coconut palms, and diverse marine life. The nearby marine parks provide excellent snorkeling and diving opportunities.',
        accessibility: {
          byAir: 'Fly directly to Ukunda Airstrip (20 minutes from Diani) or Moi International Airport in Mombasa (2 hours from Diani).',
          byRoad: '2-3 hours drive from Mombasa via Mombasa-Nairobi highway. Good tarmac roads.',
          publicTransport: 'Matatu services from Mombasa to Ukunda, then taxi to Diani. Available but slow.',
          nearestAirport: 'Ukunda Airstrip (20 mins), Moi International Airport Mombasa (2 hours)',
          drivingTime: '2 hours from Mombasa, 6 hours from Nairobi',
          bestTimeToVisit: 'Year-round destination with peak season November to March and May to October'
        }
      },
      'hells-gate-national-park': {
        description: 'Hell\'s Gate National Park is one of Kenya\'s smallest parks, famous for its dramatic scenery of gorges and volcanic features. The park is unique as it allows visitors to explore on foot, bicycle, or by vehicle without the need for armed guides.',
        highlights: [
          'Cycling and walking safaris without guides',
          'Dramatic gorges and towering cliffs',
          'Geothermal activity and hot springs',
          'Rock climbing opportunities',
          'Famous filming location for \'The Lion King\''
        ],
        history: 'Established as a national park in 1984, the area was named after a narrow break in the cliffs that reminded early explorers of a gateway to hell.',
        culture: 'The park is near Naivasha, which has a diverse population of Kikuyu, Maasai, and expatriate communities. The area has a strong agricultural heritage.',
        naturalFeatures: 'The park features dramatic gorges, towering cliffs, geothermal features, and Ol Njorowa Gorge. It\'s one of the few parks in Kenya where visitors can walk and cycle freely.',
        accessibility: {
          byAir: 'Fly to Wilson Airport Nairobi (2 hours drive) or private airstrips. Charter flights available.',
          byRoad: '2 hours drive from Nairobi via the Nairobi-Nakuru highway. Good tarmac roads.',
          publicTransport: 'Matatu services from Nairobi to Naivasha, then taxi to park entrance. Available but slow.',
          nearestAirport: 'Wilson Airport Nairobi (2 hours)',
          drivingTime: '2 hours from Nairobi, 30 minutes from Lake Naivasha',
          bestTimeToVisit: 'June-October and December-February for cooler temperatures and minimal rainfall'
        }
      },
      'jinja': {
        description: 'Jinja, known as the adventure capital of East Africa, sits at the source of the mighty River Nile. This vibrant town offers world-class white water rafting, bungee jumping, and cultural experiences along the banks of the world\'s longest river.',
        highlights: [
          'Source of the River Nile with historical significance',
          'Grade 5 white water rafting on the Nile',
          'Bungee jumping from 44 meters above the Nile',
          'Boat cruises and sunset tours',
          'Cultural sites and colonial architecture'
        ],
        history: 'Jinja was founded in 1901 and became a major trading center due to its strategic location at the source of the Nile. The town played a crucial role in Uganda\'s colonial history and industrial development.',
        culture: 'Jinja is home to diverse communities including the Basoga people, with rich cultural traditions centered around fishing and agriculture along the Nile.',
        naturalFeatures: 'The town is situated where Lake Victoria transforms into the River Nile, creating powerful rapids and scenic landscapes perfect for adventure activities.',
        accessibility: {
          byAir: 'No commercial airport in Jinja. Nearest is Entebbe International Airport (87km).',
          byRoad: '2 hours drive from Kampala via well-maintained highway. 1.5 hours from Entebbe Airport.',
          publicTransport: 'Regular bus and taxi services from Kampala to Jinja. Local boda-bodas available for short distances.',
          nearestAirport: 'Entebbe International Airport (87km)',
          drivingTime: '2 hours from Kampala, 1.5 hours from Entebbe Airport',
          bestTimeToVisit: 'Year-round destination, but dry seasons offer the best conditions for outdoor activities'
        }
      },
      'kibale-national-park': {
        description: 'Kibale National Park is Uganda\'s premier destination for chimpanzee tracking and primate viewing. The park contains the highest concentration of primates in the world and is famous for its "Primate Capital" status.',
        highlights: [
          'Chimpanzee tracking with over 1,500 individuals',
          'Highest primate density in the world (13 species)',
          '350+ bird species for bird watchers',
          'Research opportunities with primatologists',
          'Forest walks and canopy views'
        ],
        history: 'Kibale was gazetted as a forest reserve in 1932 and became a national park in 1993. The area has been a wildlife corridor for thousands of years.',
        culture: 'The area is inhabited by local communities who practice sustainable forest management and participate in tourism revenue sharing schemes.',
        naturalFeatures: 'The park features a tropical rainforest with a canopy of hardwood trees, numerous primate species, and diverse flora and fauna.',
        accessibility: {
          byAir: 'Fly to Kasese Airstrip or Fort Portal, then road transfer. Charter flights available from Entebbe.',
          byRoad: '6-7 hours drive from Kampala via Fort Portal. Good tarmac roads most of the way.',
          publicTransport: 'Bus services from Kampala to Fort Portal, then taxi to park. Not recommended for tourists.',
          nearestAirport: 'Fort Portal (30km), Entebbe International Airport (320km)',
          drivingTime: '6-7 hours from Kampala, 2 hours from Fort Portal',
          bestTimeToVisit: 'June-September and December-February (dry seasons) for easier tracking and better weather conditions'
        }
      },
      'kidepo-valley-national-park': {
        description: 'Kidepo Valley National Park is Uganda\'s most remote and pristine national park, located in the Karamoja region. The park offers exceptional wildlife viewing and cultural experiences with the Karamojong people.',
        highlights: [
          'Remote wilderness experience',
          'Cheetahs, ostriches, and unique wildlife',
          'Karamojong cultural encounters',
          'Spectacular mountain landscapes',
          'Fewer tourists for a private safari experience'
        ],
        history: 'Established in 1962, the park is named after the Kidepo River and covers 1,442 square kilometers of savanna grassland and mountainous terrain.',
        culture: 'The area is home to the Karamojong people, known for their traditional pastoral lifestyle, livestock culture, and warrior traditions.',
        naturalFeatures: 'The park features diverse landscapes including the Napak Range, Lokip Range, and the Narus Valley with seasonal water sources.',
        accessibility: {
          byAir: 'Fly to Kidepo Airstrip using chartered flights from Entebbe or Makerere Airport. No commercial flights available.',
          byRoad: '10-12 hours drive from Kampala via Gulu and Kotido. Challenging road conditions, especially during rains.',
          publicTransport: 'No reliable public transport. Requires chartering vehicles or joining organized tours.',
          nearestAirport: 'Kidepo Airstrip (charter flights from Entebbe)',
          drivingTime: '10-12 hours from Kampala on challenging roads',
          bestTimeToVisit: 'November-March (dry season) when roads are passable and wildlife is concentrated around water sources'
        }
      },
      'lake-bunyonyi': {
        description: 'Lake Bunyonyi is one of the most beautiful lakes in Africa, situated in southwestern Uganda. Known as the "Place of the Eagles," the lake features 29 islands and offers safe swimming, bird watching, and cultural experiences.',
        highlights: [
          '29 pristine islands to explore',
          'Safe swimming with no crocodiles or bilharzia',
          '200+ bird species including African fish eagles',
          'Twin lakes and volcanic landscapes',
          'Cultural experiences with local communities'
        ],
        history: 'The lake has been inhabited for centuries by various communities and served as a place of refuge for those fleeing diseases and conflicts.',
        culture: 'The area is home to communities that practice sustainable fishing and agriculture. Traditional fishing methods are still used.',
        naturalFeatures: 'The lake is 40km long and 7km wide with depths reaching 44m. It features volcanic cones and unique island ecosystems.',
        accessibility: {
          byAir: 'No airstrip at the lake. Nearest is Kisoro Airstrip or Kihihi Airstrip.',
          byRoad: '8-9 hours drive from Kampala via Mbarara and Kabale. Good roads in dry season.',
          publicTransport: 'Bus services from Kampala to Kabale, then taxi to lake. Not recommended for tourists.',
          nearestAirport: 'Kisoro Airstrip (30km), Kihihi Airstrip (60km), Entebbe Airport (450km)',
          drivingTime: '8-9 hours from Kampala, 1 hour from Kabale',
          bestTimeToVisit: 'June-August and December-February for dry season and optimal outdoor activities'
        }
      },
      'lake-mburo-national-park': {
        description: 'Lake Mburo National Park is Uganda\'s smallest savanna national park, located in the western corridor. The park is famous for its zebra populations, acacia woodlands, and proximity to Kampala.',
        highlights: [
          'Zebra sanctuary with the largest population in Uganda',
          'Boat safaris on Lake Mburo',
          'Acacia woodland ecosystem',
          'Hippopotamus pools',
          'Night game drives (one of few parks offering this)'
        ],
        history: 'The park was established in 1982 and covers 260 square kilometers. It was originally gazetted in 1928 but reduced in size to accommodate local communities.',
        culture: 'The area is home to the Bahima pastoralists who practice traditional cattle keeping and are known for their cultural dances.',
        naturalFeatures: 'The park features 5 interconnected lakes, acacia woodland, rocky outcrops, and seasonal plains supporting diverse wildlife.',
        accessibility: {
          byAir: 'Fly to Mbarara airstrip then road transfer, or charter flights from Entebbe.',
          byRoad: '4-5 hours drive from Kampala via Mbarara. Good tarmac roads throughout.',
          publicTransport: 'Bus services from Kampala to Mbarara or Muyembe, then taxi to park. Available but not convenient.',
          nearestAirport: 'Mbarara Airstrip (40km), Entebbe Airport (240km)',
          drivingTime: '4-5 hours from Kampala, 1 hour from Mbarara',
          bestTimeToVisit: 'June-September and December-February for dry season and optimal game viewing'
        }
      },
      'lake-nakuru-national-park': {
        description: 'Lake Nakuru National Park is famous for its flamingo populations and rhino sanctuary. The park is part of the Rift Valley Lakes system and offers excellent bird watching and wildlife viewing opportunities.',
        highlights: [
          'Massive flamingo populations (up to 2 million birds)',
          'White and black rhino sanctuary',
          'Largest concentration of flamingos in East Africa',
          'Mountain forest and diverse ecosystems',
          'Excellent bird watching (450+ species)'
        ],
        history: 'Established in 1968, the park was created to protect the flamingo populations. It was the first park in Kenya to be gazetted specifically for bird conservation.',
        culture: 'The area has agricultural communities and the park serves as a buffer zone protecting the lake ecosystem.',
        naturalFeatures: 'The park encompasses Lake Nakuru, acacia forest, rocky cliffs, and diverse vegetation zones supporting varied wildlife.',
        accessibility: {
          byAir: 'Fly to Naivasha Airstrip, then road transfer. Charter flights from Wilson Airport Nairobi.',
          byRoad: '3-4 hours drive from Nairobi via the Nairobi-Nakuru highway. Good tarmac roads.',
          publicTransport: 'Matatu services from Nairobi to Nakuru town, then taxi to park. Available but slow.',
          nearestAirport: 'Wilson Airport Nairobi (4 hours), Naivasha Airstrip (1 hour)',
          drivingTime: '3-4 hours from Nairobi, 30 minutes from Naivasha',
          bestTimeToVisit: 'Year-round, but best November-March and June-September for bird watching'
        }
      },
      'lake-turkana-national-parks': {
        description: 'Lake Turkana National Parks encompass the world\'s largest desert lake and include Sibiloi, Central Island, and South Island National Parks. The area is known as the "Cradle of Mankind" for its fossil discoveries.',
        highlights: [
          'World\'s largest desert lake',
          'Fossil sites and "Cradle of Mankind"',
          'Unique desert landscapes',
          'Flamingo colonies and bird watching',
          'Cultural encounters with Turkana people'
        ],
        history: 'The parks were established to protect the unique desert ecosystem and fossil sites. Archaeological discoveries date back 4 million years.',
        culture: 'The area is inhabited by the Turkana people, known for their traditional fishing, pastoral lifestyle, and unique cultural practices.',
        naturalFeatures: 'The area features volcanic formations, desert landscapes, alkaline lake, and unique flora and fauna adapted to harsh conditions.',
        accessibility: {
          byAir: 'Charter flights to Loiyangalani Airstrip from Nairobi. Essential for remote access.',
          byRoad: '6-8 hours drive from Nairobi via Marsabit. Challenging unpaved roads requiring 4WD.',
          publicTransport: 'Very limited public transport. Requires 4WD vehicles and experienced drivers.',
          nearestAirport: 'Loiyangalani Airstrip (charter flights only)',
          drivingTime: '6-8 hours from Nairobi on unpaved roads',
          bestTimeToVisit: 'December-March for cooler temperatures. Avoid April-May due to heavy rains making roads impassable'
        }
      },
      'lamu-old-town': {
        description: 'Lamu Old Town is a UNESCO World Heritage Site and one of the oldest Swahili settlements in East Africa. The historic island features 700 years of Swahili culture, architecture, and maritime history.',
        highlights: [
          '700-year-old Swahili settlement',
          'Car-free island with donkey transport',
          'UNESCO World Heritage architecture',
          'Traditional dhow building and sailing',
          'Authentic Swahili cultural experiences'
        ],
        history: 'Founded in the 14th century, Lamu was a major trading port and center of Swahili culture, connecting with traders from Arabia, India, and Persia.',
        culture: 'The island has preserved authentic Swahili culture with traditional architecture, language, cuisine, and Islamic customs.',
        naturalFeatures: 'The island features pristine beaches, mangrove forests, coral reefs, and diverse marine life in the surrounding waters.',
        accessibility: {
          byAir: 'Fly to Lamu Airport, then dhow or boat transfer to the town. Regular flights from Nairobi.',
          byRoad: 'Not accessible by road. Requires dhow or boat transfer from Manda Island.',
          publicTransport: 'Dhow services from Manda Island to Lamu Town. Available throughout the year.',
          nearestAirport: 'Lamu Airport (15 minutes by dhow)',
          drivingTime: 'N/A - connected by dhow/boat services',
          bestTimeToVisit: 'June-October and December-February for dry season and optimal weather conditions'
        }
      },
      'masai-mara-national-reserve': {
        description: 'The Masai Mara National Reserve is Kenya\'s most famous wildlife reserve, known for the Great Migration and highest concentration of lions in the world. The reserve forms part of the greater Serengeti ecosystem.',
        highlights: [
          'Great Migration (July-October)',
          'Highest concentration of lions in the world',
          'Big Five wildlife viewing',
          'Maasai cultural experiences',
          'Hot air balloon safaris at sunrise'
        ],
        history: 'Established in 1961 as a wildlife sanctuary, named after the Maasai people and the Mara River. It has been a protected area for over 60 years.',
        culture: 'The reserve is managed by the Maasai community who have coexisted with wildlife for generations. Cultural visits to Maasai villages are available.',
        naturalFeatures: 'The reserve features the Mara River, acacia savanna, riverine forests, and diverse landscapes that support high wildlife densities.',
        accessibility: {
          byAir: 'Fly to Mara Serena, Musoma, or Kichwa Tembo airstrips. Regular flights from Nairobi Wilson Airport.',
          byRoad: '6-7 hours drive from Nairobi via Narok. Good tarmac roads to Narok, then gravel to park.',
          publicTransport: 'Matatu services from Nairobi to Narok, then to park gates. Available but slow.',
          nearestAirport: 'Mara Serena Airstrip, Kichwa Tembo Airstrip',
          drivingTime: '6-7 hours from Nairobi, 4 hours from Nakuru',
          bestTimeToVisit: 'July-October for Great Migration, January-March for calving season'
        }
      },
      'mount-elgon-national-park': {
        description: 'Mount Elgon National Park features the world\'s largest volcanic base and offers trekking, cave exploration, and mountain landscapes. The park spans 1,279 square kilometers across the Uganda-Kenya border.',
        highlights: [
          'World\'s largest volcanic base',
          'Sipi Falls and spectacular waterfalls',
          'Kitum Cave exploration',
          'Hiking and trekking opportunities',
          'Unique high-altitude flora and fauna'
        ],
        history: 'The park was gazetted in 1974 and encompasses Mount Elgon, an ancient extinct volcano that began erupting about 24 million years ago.',
        culture: 'The area is home to the Bagisu and Sabiny communities known for their traditional practices and agricultural skills.',
        naturalFeatures: 'The park features the world\'s largest intact caldera, 400+ bird species, caves, waterfalls, and diverse ecological zones.',
        accessibility: {
          byAir: 'No airstrip in the park. Nearest is Soroti or Jinja airports in Uganda, or Kitale in Kenya.',
          byRoad: '4-5 hours drive from Kampala via Mbale. Good tarmac roads to Mbale, then gravel to park.',
          publicTransport: 'Bus services to Mbale, then taxi to park. Available but slow.',
          nearestAirport: 'Soroti Airport (2.5 hours), Jinja (3 hours), Kitale Kenya (1.5 hours)',
          drivingTime: '4-5 hours from Kampala, 1.5 hours from Mbale',
          bestTimeToVisit: 'December-March and June-September for dry seasons and optimal trekking conditions'
        }
      },
      'mount-kenya-national-park': {
        description: 'Mount Kenya National Park encompasses the second-highest mountain in Africa and offers alpine trekking, unique flora and fauna, and spectacular landscapes. The park covers 715 square kilometers around the mountain.',
        highlights: [
          'Africa\'s second-highest mountain (5,199m)',
          'Unique alpine and moorland ecosystems',
          'Rapala trout fishing in mountain streams',
          'Camping and trekking opportunities',
          'UNESCO World Heritage status'
        ],
        history: 'The park was established in 1949 to protect the mountain and its wildlife. The mountain has significant cultural importance to the Kikuyu people.',
        culture: 'The mountain is sacred to the Kikuyu people who call it "Kirinyaga" (place where God resides) and consider it a spiritual center.',
        naturalFeatures: 'The park features alpine zones, moorlands, bamboo forests, unique vegetation zones, and diverse wildlife adapted to high altitudes.',
        accessibility: {
          byAir: 'Fly to Nanyuki or Wilson Airport, then road transfer. Charter flights available.',
          byRoad: '4-5 hours drive from Nairobi via Nanyuki. Good tarmac roads to Nanyuki, then access roads to park.',
          publicTransport: 'Matatu services from Nairobi to Nanyuki, then taxi to park entrance. Available.',
          nearestAirport: 'Wilson Airport Nairobi (4 hours), Nanyuki Airstrip (1 hour)',
          drivingTime: '4-5 hours from Nairobi, 1 hour from Nanyuki',
          bestTimeToVisit: 'January-March and July-October for dry seasons and optimal climbing conditions'
        }
      },
      'murchison-falls-national-park': {
        description: 'Murchison Falls National Park is Uganda\'s largest national park, famous for the powerful Murchison Falls where the Nile River forces through a narrow gap. The park offers game drives, boat safaris, and diverse wildlife viewing.',
        highlights: [
          'The most powerful waterfall in the world',
          'Game drives with Big Five',
          'Boat safaris on the Victoria Nile',
          'Chobe National Park-style game viewing',
          'Hydroelectric power station'
        ],
        history: 'Established in 1952 as a game reserve, named after the falls. It covers 3,840 square kilometers and has been protected for over 70 years.',
        culture: 'The area is home to the Alur and other communities who have traditional fishing and farming practices along the Nile.',
        naturalFeatures: 'The park features savanna plains, riverine forests, the Victoria Nile, the dramatic Murchison Falls, and diverse wildlife habitats.',
        accessibility: {
          byAir: 'Fly to Pakuba Airstrip or Murchison Falls Airstrip, then road transfer. Charter flights from Entebbe.',
          byRoad: '6-7 hours drive from Kampala via Masindi. Good tarmac to Masindi, then gravel to park.',
          publicTransport: 'Bus services to Masindi, then taxi to park. Not recommended for tourists.',
          nearestAirport: 'Pakuba Airstrip (45 mins), Murchison Falls Airstrip (30 mins), Entebbe Airport (350km)',
          drivingTime: '6-7 hours from Kampala, 1.5 hours from Masindi',
          bestTimeToVisit: 'June-September and December-February for dry season and optimal game viewing'
        }
      },
      'nairobi-national-park': {
        description: 'Nairobi National Park is the world\'s only national park within a capital city. It\'s located just 7km from Nairobi\'s central business district and offers unique wildlife viewing opportunities with the city skyline as a backdrop.',
        highlights: [
          'World\'s only national park in a capital city',
          'Rhino sanctuary and big cat conservation',
          'Voi River and savanna ecosystems',
          'Close proximity to Nairobi city',
          'Excellent bird watching and game viewing'
        ],
        history: 'Established in 1946, it was Kenya\'s first national park. It was created to protect the wildlife corridor between Nairobi and the Athi Plains.',
        culture: 'The park serves as an educational center for local communities and schools in Nairobi, promoting conservation awareness.',
        naturalFeatures: 'The park features short grass plains, riverine forest, seasonal pools, and volcanic grasslands supporting diverse wildlife.',
        accessibility: {
          byAir: 'Not accessible by air. Drive from Nairobi city center.',
          byRoad: '45 minutes-1 hour drive from Nairobi CBD via Mombasa Road or Langata Road.',
          publicTransport: 'Matatu services to Ngong or Oloitokitok, then taxi to park gates. Available.',
          nearestAirport: 'Jomo Kenyatta International Airport (45 mins)',
          drivingTime: '45 minutes-1 hour from Nairobi city center',
          bestTimeToVisit: 'Year-round, but June-October and December-March offer optimal wildlife viewing'
        }
      },
      'ngorongoro-conservation-area': {
        description: 'Ngorongoro Conservation Area is a UNESCO World Heritage Site featuring the world\'s largest intact volcanic caldera. The area supports diverse ecosystems and high wildlife densities in a unique geological setting.',
        highlights: [
          'World\'s largest intact volcanic caldera',
          'Highest concentration of wildlife per square kilometer',
          'Big Five in a contained ecosystem',
          'Maasai pastoralist communities',
          'UNESCO World Heritage status'
        ],
        history: 'The area has been inhabited for over 3 million years with archaeological evidence found at Olduvai Gorge, making it the "Cradle of Mankind."',
        culture: 'The area is home to the Maasai people who practice traditional pastoralism within the conservation area, creating a unique human-wildlife coexistence model.',
        naturalFeatures: 'The conservation area features the Ngorongoro Crater, highlands, grasslands, forests, and diverse ecosystems supporting various wildlife species.',
        accessibility: {
          byAir: 'Fly to Manyara Airstrip, Seronera Airstrip, or Kilimanjaro International Airport, then road transfer.',
          byRoad: '4-5 hours drive from Arusha or 6-7 hours from Moshi. Good roads throughout.',
          publicTransport: 'Buses from Arusha to Karatu or Mto wa Mbu, then taxi to crater. Available.',
          nearestAirport: 'Kilimanjaro International Airport (4 hours), Manyara Airstrip (2 hours)',
          drivingTime: '4-5 hours from Arusha, 6-7 hours from Moshi',
          bestTimeToVisit: 'June-October and December-March for dry seasons and optimal wildlife viewing'
        }
      },
      'queen-elizabeth-national-park': {
        description: 'Queen Elizabeth National Park is Uganda\'s most visited savanna reserve, renowned for its incredible biodiversity and the famous tree-climbing lions of Ishasha. The park spans 1,978 square kilometers across the equator, offering classic African safari experiences.',
        highlights: [
          'Tree-climbing lions in the Ishasha sector',
          'Boat safaris on the Kazinga Channel',
          'Over 600 bird species recorded',
          '95 mammal species including elephants, leopards, and hippos',
          'Chimpanzee tracking in Kyambura Gorge'
        ],
        history: 'Originally established as Kazinga National Park in 1952, it was renamed Queen Elizabeth National Park in 1954 to commemorate a visit by Queen Elizabeth II.',
        culture: 'The park area is inhabited by several communities including the Bakonzo people of the Rwenzori Mountains and fishing communities along Lake Edward.',
        naturalFeatures: 'The park encompasses savanna, wetlands, lakes, and forests, with the Kazinga Channel connecting Lakes Edward and George, creating a wildlife corridor.',
        accessibility: {
          byAir: 'Kasese Airstrip or Mweya Airstrip within the park. Charter flights from Entebbe Airport.',
          byRoad: '6-7 hours drive from Kampala via Mbarara. Well-maintained tarmac roads most of the way.',
          publicTransport: 'Bus services to Kasese town, then taxi to park gates. Limited public transport within the park.',
          nearestAirport: 'Kasese Airstrip (5km), Mweya Airstrip (inside park), Entebbe International Airport (420km)',
          drivingTime: '6-7 hours from Kampala, 1 hour from Kasese',
          bestTimeToVisit: 'Year-round destination, but dry seasons (June-August, December-February) offer best game viewing'
        }
      },
      'rwenzori-mountains-national-park': {
        description: 'Rwenzori Mountains National Park features the "Mountains of the Moon" with Africa\'s third-highest peak. The park offers challenging trekking, unique alpine flora, and spectacular mountain landscapes.',
        highlights: [
          'Africa\'s third-highest mountain peaks',
          'Equatorial glaciers and alpine flora',
          'Unique "mountain of the moon" landscapes',
          'Challenging multi-day trekking',
          'UNESCO World Heritage status'
        ],
        history: 'Named by ancient Greek geographers as the source of the Nile, the mountains have been a landmark for centuries. The park was established in 1991.',
        culture: 'The area is known to locals as "Rwenzori" meaning "rain-maker" or "clouds of rain" in local languages.',
        naturalFeatures: 'The park features five distinct vegetation zones, alpine peaks up to 5,109m, glaciers, lakes, and unique flora like giant lobelias.',
        accessibility: {
          byAir: 'Fly to Kasese Airstrip, then road transfer to park. Charter flights from Entebbe.',
          byRoad: '6-7 hours drive from Kampala via Kasese. Good tarmac roads to Kasese, then access roads to park.',
          publicTransport: 'Bus services to Kasese, then taxi to park. Requires advanced planning.',
          nearestAirport: 'Kasese Airstrip (2 hours), Entebbe Airport (400km)',
          drivingTime: '6-7 hours from Kampala, 2 hours from Kasese',
          bestTimeToVisit: 'June-September and December-February for dry seasons and optimal trekking conditions'
        }
      },
      'samburu-national-reserve': {
        description: 'Samburu National Reserve is located in northern Kenya and is famous for the "Samburu Special Six" - unique wildlife species not found elsewhere in Kenya. The park offers unique desert-adapted wildlife viewing.',
        highlights: [
          'Samburu Special Six: Grevy\'s zebra, reticulated giraffe, Somali ostrich, gerenuk, beisa oryx, and fringed-eared oryx',
          'Ewaso Nyiro River ecosystem',
          'Desert-adapted wildlife',
          'Samburu cultural experiences',
          'Unique northern Kenya landscapes'
        ],
        history: 'Established in 1966, the reserve protects the unique northern wildlife and the Ewaso Nyiro River ecosystem.',
        culture: 'The area is inhabited by the Samburu people, closely related to the Maasai but with distinct cultural practices and traditional knowledge.',
        naturalFeatures: 'The reserve features the Ewaso Nyiro River, arid landscapes, Borana grasslands, and unique vegetation adapted to semi-arid conditions.',
        accessibility: {
          byAir: 'Fly to Samburu airstrip, then road transfer. Regular flights from Nairobi Wilson Airport.',
          byRoad: '6-7 hours drive from Nairobi via Archer\'s Post. Good tarmac to Archer\'s Post, then gravel to park.',
          publicTransport: 'Matatu services to Archer\'s Post, then taxi to park. Available but slow.',
          nearestAirport: 'Samburu Airstrip, Wilson Airport Nairobi (charter flights)',
          drivingTime: '6-7 hours from Nairobi, 2 hours from Archer\'s Post',
          bestTimeToVisit: 'December-March and June-October for cooler temperatures and optimal wildlife viewing'
        }
      },
      'semuliki-valley-national-park': {
        description: 'Semuliki Valley National Park is Uganda\'s only lowland tropical rainforest park, located in the Albertine Rift. The park features unique equatorial forest ecosystems and diverse wildlife.',
        highlights: [
          'Uganda\'s only lowland tropical rainforest',
          'Sempaya Hot Springs with boiling mud pools',
          'Diverse bird species and primates',
          'Unique Albertine Rift ecosystems',
          'Traditional salt mining and forest walks'
        ],
        history: 'The park was established in 1993 to protect the unique lowland forest ecosystem of the Albertine Rift valley.',
        culture: 'The area is home to the Toro people and traditional salt miners who have practiced ancient techniques for generations.',
        naturalFeatures: 'The park features tropical rainforest, hot springs, seasonal lakes, diverse primates, and unique bird species endemic to the Albertine Rift.',
        accessibility: {
          byAir: 'Fly to Fort Portal or Bundibugyo airstrip, then road transfer. Charter flights from Entebbe.',
          byRoad: '7-8 hours drive from Kampala via Fort Portal. Good tarmac to Fort Portal, then access roads to park.',
          publicTransport: 'Bus services to Fort Portal, then taxi to park. Not recommended for tourists.',
          nearestAirport: 'Fort Portal Airstrip (3 hours), Entebbe Airport (400km)',
          drivingTime: '7-8 hours from Kampala, 3 hours from Fort Portal',
          bestTimeToVisit: 'June-September and December-February for dry seasons and optimal forest trekking'
        }
      },
      'serengeti-national-park': {
        description: 'Serengeti National Park is one of the world\'s most famous wildlife reserves, known for the Great Migration of over 1.5 million wildebeest and hundreds of thousands of zebra and gazelle. The park covers 14,750 square kilometers of pristine wilderness.',
        highlights: [
          'Great Migration of 1.5 million wildebeest',
          'Highest concentration of big cats in Africa',
          'Uninterrupted wildlife corridor',
          'Big Five and diverse wildlife',
          'Endless plains and diverse ecosystems'
        ],
        history: 'Established in 1951, the Serengeti is named from the Maasai word "Siringet" meaning "the place where the land runs on forever."',
        culture: 'The area has been home to the Maasai people for centuries who practice traditional pastoralism and maintain a harmonious relationship with wildlife.',
        naturalFeatures: 'The park features vast grasslands, acacia woodlands, riverine forests, kopjes (rocky outcrops), and diverse habitats supporting year-round wildlife viewing.',
        accessibility: {
          byAir: 'Fly to Seronera Airstrip, Grumeti Airstrip, or other park airstrips. Regular flights from Arusha or Dar es Salaam.',
          byRoad: '7-8 hours drive from Arusha via Ngorongoro or 6-7 hours from Mwanza. Good roads throughout.',
          publicTransport: 'Buses from Arusha to Serengeti Gate. Available but slow.',
          nearestAirport: 'Kilimanjaro International Airport (6 hours), Arusha (7 hours)',
          drivingTime: '7-8 hours from Arusha, 3-4 hours from Ngorongoro',
          bestTimeToVisit: 'December-March for calving season and June-October for Great Migration river crossings'
        }
      },
      'tsavo-national-parks': {
        description: 'Tsavo National Parks consist of Tsavo East and Tsavo West, forming Kenya\'s largest protected area. The parks are famous for red elephants, the Yatta Plateau, and diverse landscapes.',
        highlights: [
          'Kenya\'s largest protected area (22,000 sq km)',
          'Red elephants dusted with volcanic soil',
          'Yatta Plateau (world\'s longest lava flow)',
          'Mzima Springs with underwater hippo viewing',
          'Rhino sanctuary and diverse landscapes'
        ],
        history: 'Established in 1948, the parks were initially called the North and South National Reserves before being renamed Tsavo in honor of the Tsavo River.',
        culture: 'The area is inhabited by the Kamba people who practice traditional farming and have cultural sites throughout the region.',
        naturalFeatures: 'The parks feature diverse landscapes including acacia savanna, riverine forests, volcanic hills, and the Yatta Plateau.',
        accessibility: {
          byAir: 'Fly to Voi Airstrip or other park airstrips, then road transfer. Charter flights from Nairobi.',
          byRoad: '3-4 hours drive from Nairobi via Mombasa Road or 4-5 hours via Machakos. Good tarmac roads.',
          publicTransport: 'Matatu services from Nairobi to Voi or Tsavo Gate. Available.',
          nearestAirport: 'Wilson Airport Nairobi (4 hours), Voi Airstrip (1 hour)',
          drivingTime: '3-4 hours from Nairobi, 1 hour from Voi',
          bestTimeToVisit: 'June-October and December-March for dry seasons and optimal wildlife viewing'
        }
      },
      'watamu-marine-park': {
        description: 'Watamu Marine National Park is one of Kenya\'s premier marine protected areas, featuring pristine coral reefs, diverse marine life, and beautiful beaches. The park offers excellent snorkeling, diving, and marine wildlife viewing.',
        highlights: [
          'Pristine coral reefs and marine life',
          'Sea turtle conservation and nesting sites',
          'Dolphin spotting in clear waters',
          'Excellent snorkeling and diving opportunities',
          'Beautiful beaches and mangrove forests'
        ],
        history: 'Established in 1968 as Kenya\'s first marine national park to protect the rich marine biodiversity of the Indian Ocean coast.',
        culture: 'The area is predominantly inhabited by the Mijikenda people who have traditional fishing practices and cultural sites along the coast.',
        naturalFeatures: 'The park features coral reefs, sea grass beds, mangrove forests, sandy beaches, and diverse marine ecosystems.',
        accessibility: {
          byAir: 'Fly to Malindi Airport, then road transfer (45 mins). Regular flights from Nairobi Wilson Airport.',
          byRoad: '2-3 hours drive from Mombasa via Mombasa-Malindi road. Good tarmac roads.',
          publicTransport: 'Matatu services from Mombasa to Malindi, then local transport to Watamu. Available.',
          nearestAirport: 'Malindi Airport (45 mins), Moi International Airport Mombasa (2 hours)',
          drivingTime: '2 hours from Mombasa, 5 hours from Nairobi',
          bestTimeToVisit: 'Year-round, but April-May and November for calmer seas and optimal marine activities'
        }
      }
    };

    // Default information for destinations not specifically defined
    const defaultInfo: DestinationInfo = {
      description: `${destinationName} is one of East Africa's remarkable destinations, offering unique experiences in the Pearl of Africa region. This destination combines natural beauty with cultural richness, providing unforgettable adventures for travelers.`,
      highlights: [
        'Spectacular natural landscapes and wildlife',
        'Rich cultural heritage and local communities',
        'Adventure activities and outdoor experiences',
        'Photography opportunities',
        'Sustainable tourism practices'
      ],
      history: `${destinationName} has a rich history intertwined with East Africa's cultural and natural heritage, offering visitors insights into the region's past and present.`,
      culture: 'The area is home to local communities with diverse cultural traditions, offering opportunities for authentic cultural exchanges and learning experiences.',
      naturalFeatures: `${destinationName} features diverse ecosystems and natural attractions that showcase East Africa's incredible biodiversity and scenic beauty.`,
      accessibility: {
        byAir: 'Access via charter flights to nearby airstrips or through major international airports.',
        byRoad: 'Accessible by road from major cities with varying travel times depending on road conditions.',
        publicTransport: 'Public transportation available but private transport recommended for comfort and convenience.',
        nearestAirport: 'Major international airport with connecting flights or road transport',
        drivingTime: 'Travel time varies depending on departure point and road conditions',
        bestTimeToVisit: 'Year-round destination with seasonal variations affecting specific activities'
      }
    };

    return destinationMap[slug] || defaultInfo;
  };

  const destinationInfo = getDestinationInfo(destinationSlug);

  return (
    <section className="destination-description mt-12" id="destination-description">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About {destinationName}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover everything you need to know about this incredible Uganda destination
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'text-[#195e48] border-[#195e48]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Overview & Culture
          </button>
          <button
            onClick={() => setActiveTab('getting-there')}
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'getting-there'
                ? 'text-[#195e48] border-[#195e48]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            How to Get There
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Main Description */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Destination Overview
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {destinationInfo.description}
                </p>
                
                {/* Highlights */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Highlights</h4>
                    <ul className="space-y-3">
                      {destinationInfo.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-[#195e48] mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Best Time to Visit</h4>
                    <p className="text-gray-700 mb-4">{destinationInfo.accessibility.bestTimeToVisit}</p>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-[#195e48] mb-2">Quick Facts</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Location: {destinationName}, East Africa</li>
                        <li>• Activities: Adventure, Wildlife, Culture</li>
                        <li>• Suitable for: All levels of travelers</li>
                        <li>• Eco-friendly: Sustainable tourism practices</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* History & Culture */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">History</h3>
                  <p className="text-gray-700 leading-relaxed">{destinationInfo.history}</p>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Culture & People</h3>
                  <p className="text-gray-700 leading-relaxed">{destinationInfo.culture}</p>
                </div>
              </div>

              {/* Natural Features */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Natural Features</h3>
                <p className="text-gray-700 leading-relaxed">{destinationInfo.naturalFeatures}</p>
              </div>
            </div>
          )}

          {activeTab === 'getting-there' && (
            <div className="space-y-8">
              {/* Transportation Overview */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Transportation Options</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* By Air */}
                  <div className="space-y-4">
                    <div className="flex items-center mb-3">
                      <svg className="w-6 h-6 text-[#195e48] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <h4 className="text-xl font-semibold text-gray-900">By Air</h4>
                    </div>
                    <p className="text-gray-700">{destinationInfo.accessibility.byAir}</p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Nearest Airport:</strong> {destinationInfo.accessibility.nearestAirport}
                      </p>
                    </div>
                  </div>

                  {/* By Road */}
                  <div className="space-y-4">
                    <div className="flex items-center mb-3">
                      <svg className="w-6 h-6 text-[#195e48] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <h4 className="text-xl font-semibold text-gray-900">By Road</h4>
                    </div>
                    <p className="text-gray-700">{destinationInfo.accessibility.byRoad}</p>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Driving Time:</strong> {destinationInfo.accessibility.drivingTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Public Transport */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-[#195e48] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                  </svg>
                  <h3 className="text-2xl font-bold text-gray-900">Public Transportation</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">{destinationInfo.accessibility.publicTransport}</p>
                
                {/* Travel Tips */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                  <h4 className="text-lg font-semibold text-yellow-800 mb-3">Travel Tips</h4>
                  <ul className="space-y-2 text-yellow-700">
                    <li>• Book accommodation in advance, especially during peak seasons</li>
                    <li>• Consider hiring a local guide for the best experience</li>
                    <li>• Pack appropriate clothing for varying weather conditions</li>
                    <li>• Carry sufficient cash as ATMs may be limited in remote areas</li>
                    <li>• Respect local customs and wildlife conservation guidelines</li>
                  </ul>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help Planning Your Trip?</h3>
                <p className="text-gray-700 mb-6">
                  Our local experts can help you plan the perfect itinerary and arrange transportation to {destinationName}.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    className="bg-[#195e48] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#164439] transition-colors"
                    onClick={() => window.location.href = '/contact'}
                  >
                    Contact Our Experts
                  </button>
                  <button
                    className="border-2 border-[#195e48] text-[#195e48] px-6 py-3 rounded-xl font-semibold hover:bg-[#195e48] hover:text-white transition-colors"
                    onClick={() => window.location.href = '/trip-planner'}
                  >
                    Plan Your Trip
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DestinationDescription;
