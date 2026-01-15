"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import RecipeCardFlip from "@/components/recipe/RecipeCardFlip";
import { Utensils, Coffee, Sun, Moon, Cookie } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface Recipe {
    id: string;
    slug: string;
    title: string;
    imageUrl: string;
    summary?: string;
    averageRating: number;
    ratingCount: number;
    totalTime: number;
    category?: {
        name: string;
        slug: string;
    };
}

export default function MealsPage() {
    const { t } = useLanguage();
    const [selectedMeal, setSelectedMeal] = useState("breakfast");
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    const mealTypes = [
        { name: t('meals.breakfast'), slug: "breakfast", icon: Coffee, color: "from-yellow-500 to-orange-500", description: t('meals.breakfastDesc') },
        { name: t('meals.lunch'), slug: "lunch", icon: Sun, color: "from-green-500 to-emerald-500", description: t('meals.lunchDesc') },
        { name: t('meals.dinner'), slug: "dinner", icon: Moon, color: "from-blue-500 to-indigo-500", description: t('meals.dinnerDesc') },
        { name: t('meals.snacks'), slug: "snacks", icon: Cookie, color: "from-pink-500 to-rose-500", description: t('meals.snacksDesc') },
        { name: t('meals.desserts'), slug: "desserts", icon: Cookie, color: "from-purple-500 to-pink-500", description: t('meals.dessertsDesc') },
    ];

    useEffect(() => {
        setLoading(true);
        fetch(`/api/recipes?category=${selectedMeal}&limit=12&sort=popular`)
            .then((res) => res.json())
            .then((data) => {
                setRecipes(data.recipes || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load recipes:", err);
                setLoading(false);
            });
    }, [selectedMeal]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Utensils className="w-12 h-12" />
                            <h1 className="text-5xl font-bold">Meals & Recipes</h1>
                        </div>
                        <p className="text-xl text-white/90">
                            Browse recipes by meal type. From energizing breakfasts to satisfying dinners and everything in between.
                        </p>
                    </div>
                </div>
            </div>

            {/* Meal Type Cards */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold mb-8">Browse by Meal Type</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
                    {mealTypes.map((meal) => {
                        const Icon = meal.icon;
                        return (
                            <button
                                key={meal.slug}
                                onClick={() => setSelectedMeal(meal.slug)}
                                className={`p-6 rounded-xl transition-all ${selectedMeal === meal.slug
                                    ? `bg-gradient-to-br ${meal.color} text-white shadow-xl scale-105`
                                    : "bg-white hover:shadow-lg"
                                    }`}
                            >
                                <Icon className={`w-12 h-12 mx-auto mb-3 ${selectedMeal === meal.slug ? "text-white" : "text-gray-600"}`} />
                                <h3 className={`font-bold text-lg mb-1 ${selectedMeal === meal.slug ? "text-white" : "text-gray-900"}`}>
                                    {meal.name}
                                </h3>
                                <p className={`text-sm ${selectedMeal === meal.slug ? "text-white/90" : "text-gray-600"}`}>
                                    {meal.description}
                                </p>
                            </button>
                        );
                    })}
                </div>

                {/* Selected Meal Recipes */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">
                                {mealTypes.find(m => m.slug === selectedMeal)?.name} Recipes
                            </h2>
                            <p className="text-gray-600">
                                Discover delicious {selectedMeal} recipes
                            </p>
                        </div>
                        <Link
                            href={`/recipes?category=${selectedMeal}`}
                            className="text-orange-600 font-semibold hover:underline"
                        >
                            {t('meals.viewAll')} →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-[400px] bg-gray-200 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : recipes.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl">
                            <p className="text-gray-600 text-lg mb-4">
                                No {selectedMeal} recipes found yet!
                            </p>
                            <p className="text-gray-500">Try selecting a different meal type.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {recipes.map((recipe) => (
                                <RecipeCardFlip
                                    key={recipe.id}
                                    id={recipe.id}
                                    slug={recipe.slug}
                                    title={recipe.title}
                                    image={recipe.imageUrl}
                                    category={recipe.category?.name?.toUpperCase() || selectedMeal.toUpperCase()}
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
        </div>
    );
}
