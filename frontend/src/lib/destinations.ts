// Utility functions for destination management

export interface DestinationMapping {
  name: string;
  slug: string;
  searchVariants: string[];
}

// Mapping between destination names and URL slugs
export const destinationMappings: DestinationMapping[] = [
  {
    name: 'Amboseli National Park',
    slug: 'amboseli-national-park',
    searchVariants: ['Amboseli', 'Amboseli Park', 'Amboseli NP']
  },
  {
    name: 'Bwindi Impenetrable National Park',
    slug: 'bwindi-impenetrable-national-park',
    searchVariants: ['Bwindi', 'Bwindi Forest', 'Bwindi Impenetrable', 'Bwindi NP']
  },
  {
    name: 'Diani Beach',
    slug: 'diani-beach',
    searchVariants: ['Diani', 'Diani Beach', 'Diani Coast']
  },
  {
    name: 'Hell\'s Gate National Park',
    slug: 'hells-gate-national-park',
    searchVariants: ['Hells Gate', 'Hells Gate Park', 'Hells Gate NP', 'Hell\'s Gate']
  },
  {
    name: 'Jinja',
    slug: 'jinja',
    searchVariants: ['Jinja', 'Source of the Nile']
  },
  {
    name: 'Kibale National Park',
    slug: 'kibale-national-park',
    searchVariants: ['Kibale', 'Kibale Forest', 'Kibale NP']
  },
  {
    name: 'Kidepo Valley National Park',
    slug: 'kidepo-valley-national-park',
    searchVariants: ['Kidepo', 'Kidepo Valley', 'Kidepo NP']
  },
  {
    name: 'Lake Bunyonyi',
    slug: 'lake-bunyonyi',
    searchVariants: ['Bunyonyi', 'Lake Bunyonyi']
  },
  {
    name: 'Lake Mburo National Park',
    slug: 'lake-mburo-national-park',
    searchVariants: ['Lake Mburo', 'Lake Mburo NP', 'Mburo']
  },
  {
    name: 'Lake Nakuru National Park',
    slug: 'lake-nakuru-national-park',
    searchVariants: ['Lake Nakuru', 'Lake Nakuru NP', 'Nakuru']
  },
  {
    name: 'Lake Turkana National Parks',
    slug: 'lake-turkana-national-parks',
    searchVariants: ['Lake Turkana', 'Turkana', 'Turkana Parks']
  },
  {
    name: 'Lamu Old Town',
    slug: 'lamu-old-town',
    searchVariants: ['Lamu', 'Lamu Town', 'Old Lamu']
  },
  {
    name: 'Masai Mara National Reserve',
    slug: 'masai-mara-national-reserve',
    searchVariants: ['Masai Mara', 'Maasai Mara', 'Mara', 'Mara Reserve']
  },
  {
    name: 'Mount Elgon National Park',
    slug: 'mount-elgon-national-park',
    searchVariants: ['Mount Elgon', 'Elgon', 'Elgon NP', 'Mt Elgon']
  },
  {
    name: 'Mount Kenya National Park',
    slug: 'mount-kenya-national-park',
    searchVariants: ['Mount Kenya', 'Mt Kenya', 'Kenya NP', 'Mt Kenya NP']
  },
  {
    name: 'Murchison Falls National Park',
    slug: 'murchison-falls-national-park',
    searchVariants: ['Murchison Falls', 'Murchison', 'Murchison NP', 'MFNP']
  },
  {
    name: 'Nairobi National Park',
    slug: 'nairobi-national-park',
    searchVariants: ['Nairobi NP', 'Nairobi Park', 'Nairobi']
  },
  {
    name: 'Ngorongoro Conservation Area',
    slug: 'ngorongoro-conservation-area',
    searchVariants: ['Ngorongoro', 'NCA', 'Ngorongoro Crater']
  },
  {
    name: 'Queen Elizabeth National Park',
    slug: 'queen-elizabeth-national-park',
    searchVariants: ['Queen Elizabeth', 'Queen Elizabeth NP', 'QENP']
  },
  {
    name: 'Rwenzori Mountains National Park',
    slug: 'rwenzori-mountains-national-park',
    searchVariants: ['Rwenzori', 'Mountains of the Moon', 'Rwenzori NP']
  },
  {
    name: 'Samburu National Reserve',
    slug: 'samburu-national-reserve',
    searchVariants: ['Samburu', 'Samburu Reserve', 'Samburu NP']
  },
  {
    name: 'Semuliki Valley National Park',
    slug: 'semuliki-valley-national-park',
    searchVariants: ['Semuliki', 'Semuliki Valley', 'Semuliki NP']
  },
  {
    name: 'Serengeti National Park',
    slug: 'serengeti-national-park',
    searchVariants: ['Serengeti', 'Serengeti NP', 'Serengeti Park']
  },
  {
    name: 'Tsavo National Parks',
    slug: 'tsavo-national-parks',
    searchVariants: ['Tsavo', 'Tsavo East', 'Tsavo West', 'Tsavo NP']
  },
  {
    name: 'Watamu Marine Park',
    slug: 'watamu-marine-park',
    searchVariants: ['Watamu', 'Watamu Marine', 'Watamu Park']
  },
  {
    name: 'Kampala',
    slug: 'kampala',
    searchVariants: ['Kampala', 'Capital']
  },
  {
    name: 'Mgahinga Gorilla National Park',
    slug: 'mgahinga-gorilla-national-park',
    searchVariants: ['Mgahinga', 'Mgahinga Gorilla', 'Gorilla Park']
  },
  {
    name: 'Lake Victoria',
    slug: 'lake-victoria',
    searchVariants: ['Victoria', 'Lake Victoria']
  },
  {
    name: 'Sipi Falls',
    slug: 'sipi-falls',
    searchVariants: ['Sipi', 'Sipi Falls']
  },
  {
    name: 'Ziwa Rhino Sanctuary',
    slug: 'ziwa-rhino-sanctuary',
    searchVariants: ['Ziwa', 'Ziwa Rhino', 'Rhino Sanctuary']
  },
  {
    name: 'Fort Portal',
    slug: 'fort-portal',
    searchVariants: ['Fort Portal']
  }
];

/**
 * Convert a destination name to a URL slug
 */
export function getDestinationSlug(destinationName: string): string {
  const mapping = destinationMappings.find(
    m => m.name === destinationName || 
    m.searchVariants.some(variant => 
      variant.toLowerCase() === destinationName.toLowerCase()
    )
  );
  
  if (mapping) {
    return mapping.slug;
  }
  
  // Fallback: convert name to slug format
  return destinationName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Convert a URL slug to a readable destination name
 */
export function getDestinationName(slug: string): string {
  const mapping = destinationMappings.find(m => m.slug === slug);
  return mapping ? mapping.name : slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Check if a destination has a dedicated page
 */
export function hasDestinationPage(destinationName: string): boolean {
  return destinationMappings.some(
    m => m.name === destinationName || 
    m.searchVariants.some(variant => 
      variant.toLowerCase() === destinationName.toLowerCase()
    )
  );
}

/**
 * Get the appropriate link for a destination (either dedicated page or search)
 */
export function getDestinationLink(destinationName: string): string {
  if (hasDestinationPage(destinationName)) {
    return `/destinations/${getDestinationSlug(destinationName)}`;
  }
  
  // Fallback to search page
  return `/search?destination=${encodeURIComponent(destinationName)}`;
}