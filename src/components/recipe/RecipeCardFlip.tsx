"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Clock, Star } from "lucide-react";

interface RecipeCardFlipProps {
    id: string;
    slug: string;
    title: string;
    image: string;
    category?: string;
    rating: number;
    ratingCount: number;
    totalTime: number;
    summary?: string;
}

export default function RecipeCardFlip({
    id,
    slug,
    title,
    image,
    category = "QUICK & EASY",
    rating,
    ratingCount,
    totalTime,
    summary,
}: RecipeCardFlipProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsSaved(!isSaved);
        // TODO: Call API to save/unsave recipe
    };

    return (
        <div
            className="group relative h-[400px] cursor-pointer perspective-1000"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <div
                className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? "[transform:rotateY(180deg)]" : ""
                    }`}
            >
                {/* FRONT SIDE */}
                <div className="absolute inset-0 backface-hidden">
                    <div className="relative h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow bg-white">
                        {/* Image */}
                        <div className="relative h-64">
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />

                            {/* Category Badge */}
                            <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                {category}
                            </div>

                            {/* Save Button */}
                            <button
                                onClick={handleSave}
                                className={`absolute top-4 right-4 p-2 rounded-full transition-all ${isSaved
                                    ? "bg-red-500 text-white"
                                    : "bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white"
                                    }`}
                            >
                                <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <h3 className="font-bold text-xl mb-2 line-clamp-2 min-h-[56px]">
                                {title}
                            </h3>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${star <= Math.round(rating || 0)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                    {rating ? rating.toFixed(1) : "New"} {ratingCount ? `(${ratingCount})` : ""}
                                </span>
                            </div>

                            {/* Time */}
                            <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">{totalTime} mins</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BACK SIDE */}
                <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)]">
                    <div className="relative h-full rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-orange-500 to-amber-600 p-6 flex flex-col justify-between text-white">
                        <div>
                            <h3 className="font-bold text-2xl mb-4">{title}</h3>

                            {/* Summary */}
                            {summary && (
                                <p className="text-white/90 text-sm leading-relaxed line-clamp-6 mb-4">
                                    {summary}
                                </p>
                            )}

                            {/* Rating on back */}
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < Math.round(rating || 0)
                                                ? "fill-white text-white"
                                                : "text-white/40"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-white/90">
                                    {rating ? `${rating.toFixed(1)} (${ratingCount || 0} reviews)` : "New Recipe"}
                                </span>
                            </div>
                        </div>

                        {/* View Recipe Button */}
                        <Link
                            href={`/recipes/${slug}`}
                            className="block w-full py-3 px-6 bg-white text-orange-600 rounded-lg font-bold text-center hover:bg-gray-100 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            View Recipe →
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
        </div>
    );
}
