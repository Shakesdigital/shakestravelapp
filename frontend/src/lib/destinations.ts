// Utility functions for destination management

export interface DestinationMapping {
  name: string;
  slug: string;
  searchVariants: string[];
}

// Mapping between destination names and URL slugs
export const destinationMappings: DestinationMapping[] = [
  {
    name: 'Bwindi Impenetrable Forest',
    slug: 'bwindi-impenetrable-forest',
    searchVariants: ['Bwindi', 'Bwindi Forest', 'Bwindi Impenetrable']
  },
  {
    name: 'Queen Elizabeth National Park',
    slug: 'queen-elizabeth-national-park',
    searchVariants: ['Queen Elizabeth', 'Queen Elizabeth Park', 'QENP']
  },
  {
    name: 'Murchison Falls National Park',
    slug: 'murchison-falls-national-park',
    searchVariants: ['Murchison Falls', 'Murchison', 'MFNP']
  },
  {
    name: 'Lake Bunyonyi',
    slug: 'lake-bunyonyi',
    searchVariants: ['Bunyonyi', 'Lake Bunyonyi']
  },
  {
    name: 'Jinja',
    slug: 'jinja',
    searchVariants: ['Jinja', 'Source of the Nile']
  },
  {
    name: 'Kampala',
    slug: 'kampala',
    searchVariants: ['Kampala', 'Capital']
  },
  {
    name: 'Kibale National Park',
    slug: 'kibale-forest',
    searchVariants: ['Kibale', 'Kibale Forest', 'Kibale National Park']
  },
  {
    name: 'Mt Elgon',
    slug: 'mount-elgon',
    searchVariants: ['Mount Elgon', 'Mt Elgon', 'Elgon']
  },
  {
    name: 'Mgahinga Gorilla National Park',
    slug: 'mgahinga-gorilla-national-park',
    searchVariants: ['Mgahinga', 'Mgahinga Gorilla']
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
    name: 'Kidepo Valley National Park',
    slug: 'kidepo-valley-national-park',
    searchVariants: ['Kidepo', 'Kidepo Valley']
  },
  {
    name: 'Fort Portal',
    slug: 'fort-portal',
    searchVariants: ['Fort Portal']
  },
  {
    name: 'Mt Rwenzori',
    slug: 'mount-rwenzori',
    searchVariants: ['Rwenzori', 'Mt Rwenzori', 'Mount Rwenzori', 'Mountains of the Moon']
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