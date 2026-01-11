"use client";

import { Star, Clock, Heart } from "lucide-react";
import Image from "next/image";

interface RecipeCardProps {
    title: string;
    image: string;
    rating: number;
    reviews: number;
    cookTime: string;
    category: string;
    categoryColor?: string;
}

export default function RecipeCard({
    title,
    image,
    rating,
    reviews,
    cookTime,
    category,
    categoryColor = "bg-amber-400",
}: RecipeCardProps) {
    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Category Badge */}
                <div className={`absolute top-4 left-4 ${categoryColor} px-4 py-1 rounded-full`}>
                    <span className="text-xs font-bold text-black uppercase tracking-wide">
                        {category}
                    </span>
                </div>
                {/* Save Button */}
                <button className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full transition-all duration-200 hover:scale-110">
                    <Heart className="w-5 h-5 text-gray-700 hover:text-red-500 hover:fill-red-500 transition-colors" />
                </button>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {title}
                </h3>

                {/* Ratings & Time */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(rating)
                                        ? "fill-orange-400 text-orange-400"
                                        : "text-gray-300"
                                    }`}
                            />
                        ))}
                        <span className="ml-1 font-semibold">({reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{cookTime}</span>
                    </div>
                </div>

                {/* Save Recipe Button */}
                <button className="w-full py-3 border-2 border-gray-800 rounded-lg font-semibold hover:bg-gray-800 hover:text-white transition-all duration-200">
                    Save Recipe
                </button>
            </div>
        </div>
    );
}
