"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import RecipeCardFlip from "@/components/recipe/RecipeCardFlip";
import { Clock, ChefHat } from "lucide-react";
import Link from "next/link";

interface Recipe {
    id: string;
    slug: string;
    title: string;
    imageUrl: string;
    summary?: string;
    averageRating: number;
    ratingCount: number;
    totalTime: number;
    category: {
        name: string;
    };
}

export default function DinnersPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/recipes?category=dinner&limit=24&sort=popular")
            .then((res) => res.json())
            .then((data) => {
                setRecipes(data.recipes || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load dinner recipes:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            <ChefHat className="w-12 h-12" />
                            <h1 className="text-5xl font-bold">Dinner Recipes</h1>
                        </div>
                        <p className="text-xl text-white/90">
                            Discover delicious dinner recipes for every occasion. From quick weeknight meals to impressive dinner party dishes.
                        </p>
                        <div className="flex gap-6 mt-6 text-sm">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <span>{recipes.length}+ Recipes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="border-b bg-white">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex gap-4 overflow-x-auto">
                        <Link href="/recipes?category=dinner&sort=quickest" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-orange-100 whitespace-nowrap font-medium transition-colors">
                            Quick Dinners
                        </Link>
                        <Link href="/recipes?category=dinner&sort=popular" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-orange-100 whitespace-nowrap font-medium transition-colors">
                            Popular Dinners
                        </Link>
                        <Link href="/cuisines" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-orange-100 whitespace-nowrap font-medium transition-colors">
                            By Cuisine
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recipes Grid */}
            <div className="container mx-auto px-4 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="h-[400px] bg-gray-200 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : recipes.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-600 text-lg mb-4">No dinner recipes found yet!</p>
                        <p className="text-gray-500 mb-6">Check back soon as we add more recipes.</p>
                        <Link
                            href="/recipes"
                            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600"
                        >
                            Browse All Recipes
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2">All Dinner Recipes</h2>
                            <p className="text-gray-600">
                                Showing {recipes.length} delicious dinner recipes
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {recipes.map((recipe) => (
                                <RecipeCardFlip
                                    key={recipe.id}
                                    id={recipe.id}
                                    slug={recipe.slug}
                                    title={recipe.title}
                                    image={recipe.imageUrl}
                                    category={recipe.category.name.toUpperCase()}
                                    rating={recipe.averageRating}
                                    ratingCount={recipe.ratingCount}
                                    totalTime={recipe.totalTime}
                                    summary={recipe.summary}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
