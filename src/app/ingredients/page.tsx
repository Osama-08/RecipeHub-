"use client";

import Header from "@/components/layout/Header";
import { Carrot, Search } from "lucide-react";
import Link from "next/link";
import AIRecipeSuggestions from "@/components/AIRecipeSuggestions";

export default function IngredientsPage() {
    const popularIngredients = [
        { name: "Chicken", emoji: "🍗", count: "250+ recipes" },
        { name: "Pasta", emoji: "🍝", count: "180+ recipes" },
        { name: "Tomatoes", emoji: "🍅", count: "320+ recipes" },
        { name: "Cheese", emoji: "🧀", count: "290+ recipes" },
        { name: "Rice", emoji: "🍚", count: "150+ recipes" },
        { name: "Eggs", emoji: "🥚", count: "200+ recipes" },
        { name: "Garlic", emoji: "🧄", count: "400+ recipes" },
        { name: "Onions", emoji: "🧅", count: "380+ recipes" },
        { name: "Potatoes", emoji: "🥔", count: "170+ recipes" },
        { name: "Beef", emoji: "🥩", count: "140+ recipes" },
        { name: "Fish", emoji: "🐟", count: "120+ recipes" },
        { name: "Avocado", emoji: "🥑", count: "95+ recipes" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <Carrot className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-5xl font-bold mb-4">Find Recipes by Ingredients</h1>
                    <p className="text-xl text-white/90">
                        Enter what you have at home, and our AI will suggest the perfect meal!
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* AI Recipe Suggestions Component */}
                    <AIRecipeSuggestions />
                </div>
            </div>

            {/* Popular Ingredients */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold mb-8">Popular Ingredients</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {popularIngredients.map((ingredient) => (
                        <Link
                            key={ingredient.name}
                            href={`/recipes?search=${ingredient.name.toLowerCase()}`}
                            className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 group"
                        >
                            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                                {ingredient.emoji}
                            </div>
                            <h3 className="font-bold text-lg mb-1 group-hover:text-orange-600 transition-colors">
                                {ingredient.name}
                            </h3>
                            <p className="text-sm text-gray-600">{ingredient.count}</p>
                        </Link>
                    ))}
                </div>

                {/* How It Works */}
                <div className="mt-16 bg-white rounded-xl p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">1️⃣</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Enter Your Ingredients</h3>
                            <p className="text-gray-600 text-sm">
                                Type in the ingredients you have available
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">2️⃣</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Get Recipe Matches</h3>
                            <p className="text-gray-600 text-sm">
                                We&apos;ll show you recipes that use those ingredients
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">3️⃣</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Start Cooking!</h3>
                            <p className="text-gray-600 text-sm">
                                Follow the step-by-step instructions
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-200">
                    <h3 className="text-2xl font-bold mb-4">Can&apos;t find what you&apos;re looking for?</h3>
                    <p className="text-gray-700 mb-6">
                        Browse all our recipes or search by cuisine and meal type
                    </p>
                    <Link
                        href="/recipes"
                        className="inline-block px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold hover:from-green-600 hover:to-emerald-600 transition-all"
                    >
                        Browse All Recipes
                    </Link>
                </div>
            </div>
        </div>
    );
}
