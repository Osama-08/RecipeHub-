"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Star, Loader2 } from "lucide-react";
import Image from "next/image";

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: {
        id: string;
        name: string;
        image: string | null;
    };
}

interface ReviewSectionProps {
    recipeSlug: string;
    initialRating: number;
    initialCount: number;
}

export default function ReviewSection({ recipeSlug, initialRating, initialCount }: ReviewSectionProps) {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const fetchReviews = useCallback(async () => {
        try {
            const response = await fetch(`/api/recipes/${recipeSlug}/reviews`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data.reviews || []);
            }
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
        } finally {
            setLoading(false);
        }
    }, [recipeSlug]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!session) {
            window.location.href = "/login";
            return;
        }

        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch(`/api/recipes/${recipeSlug}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, comment }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit review");
            }

            const data = await response.json();
            const newReview = data.review;

            setSuccess(true);
            setRating(0);
            setComment("");

            // Add new review to the beginning of the list immediately
            setReviews([newReview, ...reviews]);
        } catch (err) {
            setError("Failed to submit review. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const StarRating = ({ value, interactive = false }: { value: number; interactive?: boolean }) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-5 h-5 cursor-pointer transition-colors ${star <= (interactive ? (hoverRating || rating) : value)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                            }`}
                        onClick={() => interactive && setRating(star)}
                        onMouseEnter={() => interactive && setHoverRating(star)}
                        onMouseLeave={() => interactive && setHoverRating(0)}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto mt-12">
            {/* Rating Summary */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ratings & Reviews</h2>
                <div className="flex items-center gap-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900">
                            {initialRating.toFixed(1)}
                        </span>
                        <span className="text-gray-500">({initialCount} reviews)</span>
                    </div>
                    <StarRating value={Math.round(initialRating)} />
                </div>
            </div>

            {/* Leave a Review */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Leave a Review</h3>

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
                        Review submitted successfully!
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Rating *
                        </label>
                        <StarRating value={rating} interactive={true} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Review (Optional)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Share your thoughts about this recipe..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || rating === 0}
                        className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Review"
                        )}
                    </button>
                </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">All Reviews ({reviews.length})</h3>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No reviews yet. Be the first to review this recipe!
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-lg p-6 shadow-sm border">
                            <div className="flex items-start gap-4">
                                {/* User Avatar */}
                                <div className="flex-shrink-0">
                                    {review.user.image ? (
                                        <Image
                                            src={review.user.image}
                                            alt={review.user.name}
                                            width={48}
                                            height={48}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg">
                                            {review.user.name[0]}
                                        </div>
                                    )}
                                </div>

                                {/* Review Content */}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
                                            <p className="text-sm text-gray-500">
                                                {new Date(review.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <StarRating value={review.rating} />
                                    </div>
                                    {review.comment && (
                                        <p className="text-gray-700 mt-2">{review.comment}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
