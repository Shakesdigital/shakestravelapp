'use client';

import React, { useState } from 'react';
import { AnimatedButton } from '../UI/FeedbackComponents';
import { HelpTooltip } from '../UI/Tooltip';

interface Listing {
  id: string;
  title: string;
  description: string;
  type: 'experience' | 'accommodation';
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published' | 'archived';
  featured: boolean;
  visibility: 'public' | 'private' | 'unlisted';
  owner: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  images: {
    id: string;
    url: string;
    caption?: string;
    isPrimary: boolean;
  }[];
  pricing: {
    basePrice: number;
    currency: string;
    priceType: 'per_person' | 'per_group' | 'per_night' | 'per_room';
  };
  categories: string[];
  tags: string[];
  rating: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  verificationScore: number;
  bookingCount: number;
  revenue: number;
  reviewHistory?: {
    id: string;
    reviewer: {
      id: string;
      name: string;
      role: string;
    };
    action: 'submitted' | 'approved' | 'rejected' | 'requested_changes' | 'featured' | 'unfeatured';
    timestamp: Date;
    comment?: string;
    checklist?: {
      item: string;
      status: 'pass' | 'fail' | 'na';
      note?: string;
    }[];
  }[];
}

interface ReviewChecklist {
  category: string;
  items: {
    id: string;
    label: string;
    description: string;
    required: boolean;
  }[];
}

interface ListingStatusManagerProps {
  listings: Listing[];
  userRole: 'admin' | 'manager' | 'owner';
  onStatusUpdate: (listingId: string, newStatus: string, comment?: string, checklist?: any[]) => void;
}

const reviewChecklists: ReviewChecklist[] = [
  {
    category: 'Content Quality',
    items: [
      {
        id: 'title_quality',
        label: 'Title is descriptive and engaging',
        description: 'Clear, concise, and accurately describes the offering',
        required: true
      },
      {
        id: 'description_complete',
        label: 'Description is complete and informative',
        description: 'Provides sufficient detail for customers to make informed decisions',
        required: true
      },
      {
        id: 'grammar_spelling',
        label: 'Grammar and spelling are correct',
        description: 'Professional language with no obvious errors',
        required: true
      }
    ]
  },
  {
    category: 'Media Content',
    items: [
      {
        id: 'primary_image',
        label: 'Has high-quality primary image',
        description: 'Clear, well-lit, professionally presented main photo',
        required: true
      },
      {
        id: 'sufficient_images',
        label: 'Sufficient number of images (min 3)',
        description: 'Multiple angles and aspects of the experience/accommodation',
        required: true
      },
      {
        id: 'image_quality',
        label: 'All images are high resolution',
        description: 'Images are sharp, properly exposed, and professional quality',
        required: false
      }
    ]
  },
  {
    category: 'Pricing & Details',
    items: [
      {
        id: 'pricing_clear',
        label: 'Pricing is clear and accurate',
        description: 'No misleading prices, includes what is covered',
        required: true
      },
      {
        id: 'inclusions_exclusions',
        label: 'Inclusions and exclusions are specified',
        description: 'Clear about what is and isn\'t included in the price',
        required: true
      },
      {
        id: 'availability_accurate',
        label: 'Availability information is accurate',
        description: 'Dates, times, and capacity are correctly specified',
        required: true
      }
    ]
  },
  {
    category: 'Safety & Legal',
    items: [
      {
        id: 'safety_guidelines',
        label: 'Safety guidelines are provided',
        description: 'Appropriate safety information and requirements',
        required: true
      },
      {
        id: 'age_restrictions',
        label: 'Age restrictions are clearly stated',
        description: 'Any age limits or requirements are mentioned',
        required: false
      },
      {
        id: 'cancellation_policy',
        label: 'Cancellation policy is clear',
        description: 'Terms and conditions for cancellations',
        required: true
      }
    ]
  },
  {
    category: 'Location & Contact',
    items: [
      {
        id: 'location_accurate',
        label: 'Location information is accurate',
        description: 'Address, GPS coordinates, and directions are correct',
        required: true
      },
      {
        id: 'contact_valid',
        label: 'Contact information is valid',
        description: 'Working phone numbers and email addresses',
        required: true
      },
      {
        id: 'meeting_point_clear',
        label: 'Meeting point is clearly described',
        description: 'Easy to find starting location with clear instructions',
        required: true
      }
    ]
  }
];

export default function ListingStatusManager({ listings, userRole, onStatusUpdate }: ListingStatusManagerProps) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [checklist, setChecklist] = useState<{[key: string]: { status: 'pass' | 'fail' | 'na', note: string }}>({});
  const [bulkAction, setBulkAction] = useState('');
  const [selectedListings, setSelectedListings] = useState<string[]>([]);

  const initializeChecklist = () => {
    const initialChecklist: {[key: string]: { status: 'pass' | 'fail' | 'na', note: string }} = {};
    reviewChecklists.forEach(category => {
      category.items.forEach(item => {
        initialChecklist[item.id] = { status: 'na', note: '' };
      });
    });
    setChecklist(initialChecklist);
  };

  const handleStartReview = (listing: Listing) => {
    setSelectedListing(listing);
    setReviewComment('');
    initializeChecklist();
    setShowReviewModal(true);
  };

  const handleApprove = () => {
    if (!selectedListing) return;
    
    const checklistArray = Object.entries(checklist).map(([id, data]) => ({
      item: reviewChecklists.find(cat => cat.items.find(item => item.id === id))?.items.find(item => item.id === id)?.label || id,
      status: data.status,
      note: data.note
    }));

    onStatusUpdate(selectedListing.id, 'approved', reviewComment, checklistArray);
    setShowReviewModal(false);
    setSelectedListing(null);
  };

  const handleReject = () => {
    if (!selectedListing) return;
    
    const checklistArray = Object.entries(checklist).map(([id, data]) => ({
      item: reviewChecklists.find(cat => cat.items.find(item => item.id === id))?.items.find(item => item.id === id)?.label || id,
      status: data.status,
      note: data.note
    }));

    onStatusUpdate(selectedListing.id, 'rejected', reviewComment, checklistArray);
    setShowReviewModal(false);
    setSelectedListing(null);
  };

  const handleRequestChanges = () => {
    if (!selectedListing) return;
    
    const checklistArray = Object.entries(checklist).map(([id, data]) => ({
      item: reviewChecklists.find(cat => cat.items.find(item => item.id === id))?.items.find(item => item.id === id)?.label || id,
      status: data.status,
      note: data.note
    }));

    onStatusUpdate(selectedListing.id, 'draft', reviewComment, checklistArray);
    setShowReviewModal(false);
    setSelectedListing(null);
  };

  const handlePublish = (listingId: string) => {
    onStatusUpdate(listingId, 'published');
  };

  const handleFeatureToggle = (listingId: string, featured: boolean) => {
    const comment = featured ? 'Marked as featured listing' : 'Removed from featured listings';
    onStatusUpdate(listingId, featured ? 'featured' : 'unfeatured', comment);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
      pending: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
      approved: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
      published: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
      rejected: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
      archived: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getVerificationColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getChecklistScore = () => {
    const entries = Object.entries(checklist);
    if (entries.length === 0) return 0;
    
    const passCount = entries.filter(([_, data]) => data.status === 'pass').length;
    return Math.round((passCount / entries.length) * 100);
  };

  const canApprove = () => {
    const requiredItems = reviewChecklists.flatMap(cat => 
      cat.items.filter(item => item.required).map(item => item.id)
    );
    
    return requiredItems.every(id => checklist[id]?.status === 'pass');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            ⏳ Pending Reviews
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Review and approve listings from property owners and experience providers
          </p>
        </div>
        
        {userRole === 'admin' && selectedListings.length > 0 && (
          <div className="flex items-center space-x-3">
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
            >
              <option value="">Bulk Actions</option>
              <option value="approve">Approve All</option>
              <option value="reject">Reject All</option>
              <option value="feature">Mark as Featured</option>
              <option value="publish">Publish All</option>
            </select>
            <AnimatedButton variant="secondary" size="sm">
              Apply to {selectedListings.length}
            </AnimatedButton>
          </div>
        )}
      </div>

      {/* Review Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">⏳</div>
            <div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {listings.filter(l => l.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Pending Review</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">✅</div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {listings.filter(l => l.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Approved Today</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">❌</div>
            <div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {listings.filter(l => l.status === 'rejected').length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Rejected</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">📈</div>
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round(listings.reduce((sum, l) => sum + l.verificationScore, 0) / listings.length) || 0}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Avg Quality Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Listings for Review */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Listings Awaiting Review ({listings.length})
          </h3>
        </div>

        {listings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {userRole === 'admin' && (
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedListings.length === listings.length && listings.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedListings(listings.map(l => l.id));
                          } else {
                            setSelectedListings([]);
                          }
                        }}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Listing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quality Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {userRole === 'admin' && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedListings.includes(listing.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedListings([...selectedListings, listing.id]);
                            } else {
                              setSelectedListings(selectedListings.filter(id => id !== listing.id));
                            }
                          }}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0">
                          {listing.images[0] ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={listing.images[0].url}
                              alt={listing.title}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                              <span className="text-gray-500 text-xl">
                                {listing.type === 'experience' ? '🏔️' : '🏨'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {listing.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            📍 {listing.location.city}, {listing.location.country}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                              {listing.type === 'experience' ? '🏔️' : '🏨'} {listing.type}
                            </span>
                            <span className="text-sm font-medium text-green-600">
                              ${listing.pricing.basePrice}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center">
                        <span className="mr-2">{listing.owner.avatar}</span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {listing.owner.name}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {listing.owner.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div>
                        <div>{listing.createdAt.toLocaleDateString()}</div>
                        <div className="text-xs">
                          {Math.ceil((Date.now() - listing.createdAt.getTime()) / (1000 * 60 * 60 * 24))} days ago
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${getVerificationColor(listing.verificationScore)}`}>
                          {listing.verificationScore}%
                        </span>
                        <div className="ml-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              listing.verificationScore >= 90 ? 'bg-green-500' :
                              listing.verificationScore >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${listing.verificationScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                        {listing.status}
                      </span>
                      {listing.featured && (
                        <span className="block mt-1 text-xs text-yellow-600">⭐ Featured</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {listing.status === 'pending' && userRole === 'admin' && (
                          <>
                            <button
                              onClick={() => handleStartReview(listing)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              📋 Review
                            </button>
                            <button
                              onClick={() => onStatusUpdate(listing.id, 'approved', 'Quick approved')}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            >
                              ✅ Quick Approve
                            </button>
                          </>
                        )}
                        
                        {listing.status === 'approved' && userRole === 'admin' && (
                          <button
                            onClick={() => handlePublish(listing.id)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            🚀 Publish
                          </button>
                        )}
                        
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                          👁️ View
                        </button>
                        
                        {userRole === 'admin' && (
                          <button
                            onClick={() => handleFeatureToggle(listing.id, !listing.featured)}
                            className={`${listing.featured ? 'text-yellow-600' : 'text-gray-400'} hover:text-yellow-700`}
                          >
                            {listing.featured ? '⭐' : '☆'} Feature
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              All Caught Up!
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              No listings are currently waiting for review
            </p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    📋 Review Listing
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedListing.title}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getVerificationColor(getChecklistScore())}`}>
                      {getChecklistScore()}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Review Score
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              {/* Listing Preview */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 flex-shrink-0">
                    {selectedListing.images[0] ? (
                      <img
                        className="h-16 w-16 rounded-lg object-cover"
                        src={selectedListing.images[0].url}
                        alt={selectedListing.title}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-gray-500 text-2xl">
                          {selectedListing.type === 'experience' ? '🏔️' : '🏨'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {selectedListing.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {selectedListing.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>📍 {selectedListing.location.city}</span>
                      <span>💰 ${selectedListing.pricing.basePrice}</span>
                      <span>📅 Submitted {selectedListing.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Checklist */}
              <div className="space-y-6">
                {reviewChecklists.map((category) => (
                  <div key={category.category} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-4">
                      {category.category}
                    </h5>
                    <div className="space-y-4">
                      {category.items.map((item) => (
                        <div key={item.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                                {item.required && <span className="text-red-500 mr-1">*</span>}
                                {item.label}
                              </label>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {item.description}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={item.id}
                                  value="pass"
                                  checked={checklist[item.id]?.status === 'pass'}
                                  onChange={() => setChecklist({
                                    ...checklist,
                                    [item.id]: { ...checklist[item.id], status: 'pass' }
                                  })}
                                  className="text-green-600 focus:ring-green-500"
                                />
                                <span className="ml-1 text-sm text-green-600">✓ Pass</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={item.id}
                                  value="fail"
                                  checked={checklist[item.id]?.status === 'fail'}
                                  onChange={() => setChecklist({
                                    ...checklist,
                                    [item.id]: { ...checklist[item.id], status: 'fail' }
                                  })}
                                  className="text-red-600 focus:ring-red-500"
                                />
                                <span className="ml-1 text-sm text-red-600">✗ Fail</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={item.id}
                                  value="na"
                                  checked={checklist[item.id]?.status === 'na'}
                                  onChange={() => setChecklist({
                                    ...checklist,
                                    [item.id]: { ...checklist[item.id], status: 'na' }
                                  })}
                                  className="text-gray-600 focus:ring-gray-500"
                                />
                                <span className="ml-1 text-sm text-gray-600">N/A</span>
                              </label>
                            </div>
                          </div>
                          
                          {checklist[item.id]?.status === 'fail' && (
                            <textarea
                              value={checklist[item.id]?.note || ''}
                              onChange={(e) => setChecklist({
                                ...checklist,
                                [item.id]: { ...checklist[item.id], note: e.target.value }
                              })}
                              placeholder="Please explain what needs to be improved..."
                              className="w-full px-3 py-2 border border-red-300 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                              rows={2}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Overall Comments */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Review Comments
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Add any additional comments or feedback for the listing owner..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  rows={4}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {canApprove() 
                    ? '✅ All required items passed' 
                    : '⚠️ Some required items failed - cannot approve'
                  }
                </div>
                
                <div className="flex items-center space-x-3">
                  <AnimatedButton
                    onClick={() => setShowReviewModal(false)}
                    variant="secondary"
                  >
                    Cancel
                  </AnimatedButton>
                  
                  <AnimatedButton
                    onClick={handleRequestChanges}
                    variant="secondary"
                  >
                    📝 Request Changes
                  </AnimatedButton>
                  
                  <AnimatedButton
                    onClick={handleReject}
                    variant="secondary"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    ❌ Reject
                  </AnimatedButton>
                  
                  <AnimatedButton
                    onClick={handleApprove}
                    variant="primary"
                    disabled={!canApprove()}
                  >
                    ✅ Approve
                  </AnimatedButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}