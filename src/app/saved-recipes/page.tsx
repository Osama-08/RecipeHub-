"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import RecipeCardFlip from "@/components/recipe/RecipeCardFlip";
import { Heart, Loader2 } from "lucide-react";

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

export default function SavedRecipesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (status === "authenticated") {
            // Fetch saved recipes
            fetch("/api/saved-recipes")
                .then((res) => res.json())
                .then((data) => {
                    setRecipes(data.recipes || []);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to load saved recipes:", err);
                    setLoading(false);
                });
        }
    }, [status, router]);

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-16 flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Saved Recipes</h1>
                        <p className="text-gray-600">
                            {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"} saved
                        </p>
                    </div>
                </div>

                {/* Recipes Grid */}
                {recipes.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No saved recipes yet</h2>
                        <p className="text-gray-600 mb-6">
                            Start saving your favorite recipes to find them here later
                        </p>
                        <Link
                            href="/recipes"
                            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                        >
                            Explore Recipes
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                )}
            </div>
        </div>
    );
}
