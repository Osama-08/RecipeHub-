"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, Printer, Share2, ChevronRight, Clock, Sparkles } from "lucide-react";
import YouTubeEmbed from "./YouTubeEmbed";
import AIRecipeChat from "./AIRecipeChat";
import VoiceGuide from "./VoiceGuide";
import ReviewSection from "./ReviewSection";
import { InRecipeAd } from "../ads/AdSense";
import AffiliateLink, { IngredientAffiliateLink } from "../ads/AffiliateLink";

interface Recipe {
    id: string;
    slug: string;
    title: string;
    description: string;
    summary?: string | null;
    prepTime: number;
    cookTime: number;
    totalTime: number;
    servings: number;
    difficulty: string;
    imageUrl: string;
    youtubeId?: string | null;
    videoCreatorName?: string | null;
    videoCreatorChannelId?: string | null;
    averageRating: number;
    ratingCount: number;
    views: number;
    sourceName?: string | null;
    createdAt: Date;
    category: {
        id?: string;
        name: string;
        slug: string;
        imageUrl?: string | null;
    };
    author?: {
        id?: string;
        name: string | null;
        image?: string | null;
    } | null;
    ingredients: Array<{
        id: string;
        amount: string;
        unit?: string | null;
        name: string;
        original: string;
        calories?: number | null;
        protein?: number | null;
        carbs?: number | null;
        fat?: number | null;
        [key: string]: any;
    }>;
    directions: Array<{
        stepNumber: number;
        instruction: string;
        imageUrl?: string | null;
        [key: string]: any;
    }>;
    nutrition?: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber?: number | null;
        sugar?: number | null;
        sodium?: number | null;
        [key: string]: any;
    } | null;
    reviews: Array<{
        id: string;
        rating: number;
        comment?: string | null;
        createdAt: Date | string;
        user: {
            name: string | null;
            image?: string | null;
            [key: string]: any;
        };
        [key: string]: any;
    }>;
    [key: string]: any;
}

export default function RecipeDetailClient({ recipe }: { recipe: Recipe }) {
    const { data: session } = useSession();
    const [servingMultiplier, setServingMultiplier] = useState(1);
    const [isSaved, setIsSaved] = useState(false);
    const [keepAwake, setKeepAwake] = useState(false);
    const [savingRecipe, setSavingRecipe] = useState(false);
    const [generatingDirections, setGeneratingDirections] = useState(false);
    const [directions, setDirections] = useState(recipe.directions);

    const adjustedServings = recipe.servings * servingMultiplier;

    // Check if recipe is already saved
    useEffect(() => {
        if (!session) return;

        fetch("/api/saved-recipes")
            .then(res => res.json())
            .then(data => {
                const saved = data.recipes?.some((r: any) => r.id === recipe.id);
                setIsSaved(saved || false);
            })
            .catch(err => console.error("Error checking saved status:", err));
    }, [session, recipe.id]);

    const adjustIngredient = (amount: string) => {
        const num = parseFloat(amount);
        if (isNaN(num)) return amount;
        const adjusted = num * servingMultiplier;
        return adjusted % 1 === 0 ? adjusted.toString() : adjusted.toFixed(1);
    };

    const handleSave = async () => {
        if (!session) {
            window.location.href = "/login";
            return;
        }

        setSavingRecipe(true);
        try {
            if (isSaved) {
                // Unsave
                await fetch(`/api/saved-recipes?recipeId=${recipe.id}`, {
                    method: "DELETE",
                });
                setIsSaved(false);
            } else {
                // Save
                await fetch("/api/saved-recipes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ recipeId: recipe.id }),
                });
                setIsSaved(true);
            }
        } catch (err) {
            console.error("Error saving recipe:", err);
            alert("Failed to save recipe. Please try again.");
        } finally {
            setSavingRecipe(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        const shareData = {
            title: recipe.title,
            text: recipe.description,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    const handleGenerateDirections = async () => {
        setGeneratingDirections(true);
        try {
            const response = await fetch("/api/ai/generate-directions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipeId: recipe.id,
                    title: recipe.title,
                    ingredients: recipe.ingredients.map(ing => ({
                        amount: ing.amount,
                        unit: ing.unit,
                        name: ing.name,
                    })),
                    servings: recipe.servings,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setDirections(data.directions);
                alert(`✅ Generated ${data.count} cooking steps!`);
            } else {
                throw new Error("Failed to generate directions");
            }
        } catch (error) {
            console.error("Error generating directions:", error);
            alert("Failed to generate directions. Please try again.");
        } finally {
            setGeneratingDirections(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumbs */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-orange-500">
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href={`/categories/${recipe.category.slug}`} className="hover:text-orange-500">
                            {recipe.category.name}
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-gray-900 font-medium">{recipe.title}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        {recipe.title}
                    </h1>

                    {/* Rating & Reviews */}
                    <div className="flex flex-wrap items-center gap-6 mb-4">
                        <div className="flex items-center gap-2">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.round(recipe.averageRating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="font-semibold">{recipe.averageRating.toFixed(1)}</span>
                            <span className="text-gray-600">({recipe.ratingCount.toLocaleString()})</span>
                        </div>

                        <Link href="#reviews" className="text-orange-600 hover:underline font-medium">
                            {recipe.ratingCount.toLocaleString()} REVIEWS
                        </Link>

                        <Link href="#photos" className="text-orange-600 hover:underline font-medium">
                            {recipe.views} PHOTOS
                        </Link>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 leading-relaxed mb-4">{recipe.description}</p>

                    {/* Author Info */}
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-6">
                        <span>
                            Submitted by{" "}
                            <span className="font-semibold text-gray-900">
                                {recipe.author?.name || recipe.sourceName || "CaribbeanRecipe"}
                            </span>
                        </span>
                        <span>•</span>
                        <span>
                            Updated on{" "}
                            <span className="font-semibold text-gray-900">
                                {new Date(recipe.createdAt).toLocaleDateString()}
                            </span>
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mb-8 no-print">
                        <button
                            onClick={handleSave}
                            disabled={savingRecipe}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${isSaved
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-white border-2 border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500"
                                }`}
                        >
                            <Heart className={`w-5 h-5 ${isSaved ? "fill-white" : ""}`} />
                            {isSaved ? "SAVED" : "SAVE"}
                        </button>

                        <a
                            href="#reviews"
                            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-orange-500 hover:text-orange-500 transition-colors"
                        >
                            <Star className="w-5 h-5" />
                            RATE
                        </a>

                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-orange-500 hover:text-orange-500 transition-colors"
                        >
                            <Printer className="w-5 h-5" />
                            PRINT
                        </button>

                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-orange-500 hover:text-orange-500 transition-colors"
                        >
                            <Share2 className="w-5 h-5" />
                            SHARE
                        </button>
                    </div>

                    {recipe.sourceName === "Spoonacular" && (
                        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-2 rounded-lg text-sm text-green-800 mb-6">
                            <span className="font-semibold">✓</span>
                            <span>Recipe from Spoonacular</span>
                        </div>
                    )}
                </div>

                {/* Video Player */}
                {recipe.youtubeId && (
                    <div className="my-8">
                        <YouTubeEmbed
                            videoId={recipe.youtubeId}
                            title={recipe.title}
                            creatorName={recipe.videoCreatorName}
                            creatorChannelId={recipe.videoCreatorChannelId}
                        />
                    </div>
                )}

                {/* Metadata Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                    <div className="bg-white p-6 rounded-xl border-2 border-yellow-400">
                        <div className="flex justify-between mb-4">
                            <div>
                                <p className="text-sm font-semibold text-gray-600 mb-1">Prep Time:</p>
                                <p className="text-lg font-bold">{recipe.prepTime} mins</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-600 mb-1">Cook Time:</p>
                                <p className="text-lg font-bold">{recipe.cookTime} mins</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-600 mb-1">Total Time:</p>
                                <p className="text-lg font-bold">{recipe.totalTime} mins</p>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <p className="text-sm font-semibold text-gray-600 mb-1">Servings:</p>
                            <p className="text-2xl font-bold">{recipe.servings}</p>
                        </div>
                    </div>

                    {recipe.nutrition && (
                        <div className="bg-white p-6 rounded-xl border-2 border-gray-200 md:col-span-2">
                            <h3 className="text-lg font-bold mb-4">Nutrition per Serving</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Calories</p>
                                    <p className="text-xl font-bold">{recipe.nutrition.calories}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Protein</p>
                                    <p className="text-xl font-bold">{recipe.nutrition.protein}g</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Carbs</p>
                                    <p className="text-xl font-bold">{recipe.nutrition.carbs}g</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Fat</p>
                                    <p className="text-xl font-bold">{recipe.nutrition.fat}g</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Two Column Layout: Ingredients + Directions */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 my-8">
                    {/* Ingredients */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl p-6 shadow-md sticky top-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold">Ingredients</h2>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={keepAwake}
                                        onChange={() => setKeepAwake(!keepAwake)}
                                        className="rounded"
                                    />
                                    Keep Screen Awake
                                </label>
                            </div>

                            {/* Serving Adjuster */}
                            <div className="flex items-center justify-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                                <button
                                    onClick={() => setServingMultiplier(0.5)}
                                    className={`px-4 py-2 rounded-lg font-semibold ${servingMultiplier === 0.5
                                        ? "bg-gray-900 text-white"
                                        : "bg-white border-2 border-gray-300"
                                        }`}
                                >
                                    1/2X
                                </button>
                                <button
                                    onClick={() => setServingMultiplier(1)}
                                    className={`px-4 py-2 rounded-lg font-semibold ${servingMultiplier === 1
                                        ? "bg-gray-900 text-white"
                                        : "bg-white border-2 border-gray-300"
                                        }`}
                                >
                                    ✓ 1X
                                </button>
                                <button
                                    onClick={() => setServingMultiplier(2)}
                                    className={`px-4 py-2 rounded-lg font-semibold ${servingMultiplier === 2
                                        ? "bg-gray-900 text-white"
                                        : "bg-white border-2 border-gray-300"
                                        }`}
                                >
                                    2X
                                </button>
                            </div>

                            <p className="text-sm text-gray-600 text-center mb-4">
                                Original recipe ({recipe.servings} servings) → {adjustedServings} servings
                            </p>

                            <ul className="space-y-3">
                                {recipe.ingredients.map((ing) => (
                                    <li key={ing.id} className="flex flex-col gap-1">
                                        <div className="flex items-start gap-2">
                                            <span className="text-orange-500 mt-1">•</span>
                                            <span>
                                                <span className="font-semibold">
                                                    {adjustIngredient(ing.amount)} {ing.unit}
                                                </span>{" "}
                                                {ing.name}
                                            </span>
                                        </div>
                                        <IngredientAffiliateLink ingredient={ing.name} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Directions */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl p-6 shadow-md">
                            <h2 className="text-2xl font-bold mb-6">Directions</h2>

                            {directions.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="mb-6">
                                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Sparkles className="w-10 h-10 text-orange-500" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">No Cooking Directions Available</h3>
                                        <p className="text-gray-600 mb-6">
                                            This recipe doesn&apos;t have step-by-step instructions yet.
                                            <br />
                                            Click below to generate professional cooking directions with AI!
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleGenerateDirections}
                                        disabled={generatingDirections}
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-bold text-lg hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                    >
                                        {generatingDirections ? (
                                            <>
                                                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Generating Directions with AI...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-6 h-6" />
                                                Generate Cooking Directions with AI
                                            </>
                                        )}
                                    </button>

                                    <p className="text-sm text-gray-500 mt-4">
                                        Powered by Claude AI • Takes ~5 seconds
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <VoiceGuide directions={directions} />
                                    </div>

                                    <div className="space-y-6">
                                        {directions.map((dir) => (
                                            <div key={dir.stepNumber} className="flex gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                                                        {dir.stepNumber}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-gray-800 leading-relaxed mb-3">{dir.instruction}</p>
                                                    {dir.imageUrl && (
                                                        <div className="relative w-full h-64 rounded-lg overflow-hidden">
                                                            <Image
                                                                src={dir.imageUrl}
                                                                alt={`Step ${dir.stepNumber}`}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <InRecipeAd />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div id="reviews" className="no-print">
                    <ReviewSection
                        recipeSlug={recipe.slug}
                        initialRating={recipe.averageRating}
                        initialCount={recipe.ratingCount}
                    />
                </div>

                {/* AI Recipe Chat - Floating Assistant */}
                <AIRecipeChat recipeId={recipe.id} recipeTitle={recipe.title} />
            </div>
        </div>
    );
}
