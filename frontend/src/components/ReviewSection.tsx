'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';

interface Review {
  _id: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  helpful: number;
  photos?: string[];
}

interface ReviewSectionProps {
  reviews: Review[];
  onSubmitReview?: (review: ReviewFormData) => Promise<void>;
  allowReviews?: boolean;
}

interface ReviewFormData {
  rating: number;
  title: string;
  comment: string;
  photos: File[];
}

export default function ReviewSection({ reviews, onSubmitReview, allowReviews = true }: ReviewSectionProps) {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<ReviewFormData>({
    defaultValues: {
      rating: 5,
      title: '',
      comment: '',
      photos: []
    }
  });

  const rating = watch('rating');

  const onSubmit = async (data: ReviewFormData) => {
    if (!onSubmitReview) return;
    
    setSubmitting(true);
    try {
      await onSubmitReview(data);
      reset();
      setShowReviewForm(false);
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(review => review.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter(review => review.rating === star).length / reviews.length) * 100 : 0
  }));

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Reviews ({reviews.length})</h2>
          {allowReviews && user && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Write Review
            </button>
          )}
        </div>

        {reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center text-yellow-400 text-xl mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-600">Based on {reviews.length} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center space-x-2">
                  <span className="text-sm w-8">{star}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && user && (
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-4">Write Your Review</h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setValue('rating', star)}
                    className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Review Title</label>
              <input
                {...register('title', { required: 'Title is required' })}
                type="text"
                placeholder="Summarize your experience"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <textarea
                {...register('comment', { required: 'Review comment is required', minLength: { value: 10, message: 'Review must be at least 10 characters' } })}
                placeholder="Share your experience with others..."
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
              {errors.comment && (
                <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
              )}
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-medium mb-2">Add Photos (optional)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setValue('photos', Array.from(e.target.files || []))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review._id} className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {review.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold">{review.user.name}</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <h5 className="font-semibold mb-2">{review.title}</h5>
            <p className="text-gray-700 mb-4">{review.comment}</p>
            
            {review.photos && review.photos.length > 0 && (
              <div className="flex space-x-2 mb-4">
                {review.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Review photo ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <button className="hover:text-green-600 transition-colors">
                👍 Helpful ({review.helpful})
              </button>
              <button className="hover:text-red-600 transition-colors">
                Report
              </button>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="bg-white rounded-lg p-12 shadow-md text-center">
          <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
          <p className="text-gray-600 mb-4">Be the first to share your experience!</p>
          {allowReviews && user && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Write First Review
            </button>
          )}
        </div>
      )}
    </div>
  );
}