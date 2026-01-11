"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Youtube, Loader2, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function ImportYouTubePage() {
    const router = useRouter();
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [parsedRecipe, setParsedRecipe] = useState<any>(null);

    const handleImport = async () => {
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/admin/recipes/import-youtube", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.details || data.error || "Failed to import");
            }

            const data = await response.json();
            setParsedRecipe(data.recipe);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRecipe = () => {
        // Navigate to create page with pre-filled data
        const queryParams = new URLSearchParams({
            imported: "true",
            data: JSON.stringify(parsedRecipe),
        });
        router.push(`/admin/recipes/new?${queryParams}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/admin/recipes"
                        className="text-orange-600 hover:text-orange-700 mb-2 inline-block"
                    >
                        ← Back to Recipes
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Youtube className="w-8 h-8 text-red-600" />
                        Import Recipe from YouTube
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Paste a YouTube video URL to automatically extract recipe information
                    </p>
                </div>

                {/* Import Form */}
                {!parsedRecipe && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    YouTube Video URL or ID
                                </label>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    Supports multiple formats: full URL, short URL, or video ID
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleImport}
                                disabled={!url || loading}
                                className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Importing...
                                    </>
                                ) : (
                                    <>
                                        <Youtube className="w-5 h-5" />
                                        Import Recipe
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Instructions */}
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Paste a YouTube recipe video URL</li>
                                <li>• We&apos;ll extract the recipe from the video description</li>
                                <li>• Review and edit the imported data</li>
                                <li>• Save it as a new recipe</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Parsed Recipe Preview */}
                {parsedRecipe && (
                    <div className="space-y-6">
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-semibold">Recipe imported successfully!</span>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Imported Recipe Data
                            </h2>

                            <div className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title
                                    </label>
                                    <p className="text-gray-900">{parsedRecipe.title}</p>
                                </div>

                                {/* Video */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Video
                                    </label>
                                    <div className="relative w-full max-w-md aspect-video">
                                        <Image
                                            src={parsedRecipe.imageUrl}
                                            alt={parsedRecipe.title}
                                            fill
                                            className="rounded-lg object-cover"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">
                                        By {parsedRecipe.videoCreatorName}
                                    </p>
                                </div>

                                {/* Metadata */}
                                <div className="grid grid-cols-3 gap-4">
                                    {parsedRecipe.servings && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Servings
                                            </label>
                                            <p className="text-gray-900">{parsedRecipe.servings}</p>
                                        </div>
                                    )}
                                    {parsedRecipe.prepTime && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Prep Time
                                            </label>
                                            <p className="text-gray-900">{parsedRecipe.prepTime} min</p>
                                        </div>
                                    )}
                                    {parsedRecipe.cookTime && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Cook Time
                                            </label>
                                            <p className="text-gray-900">{parsedRecipe.cookTime} min</p>
                                        </div>
                                    )}
                                </div>

                                {/* Ingredients */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ingredients ({parsedRecipe.ingredients.length})
                                    </label>
                                    <ul className="list-disc list-inside space-y-1 text-gray-900">
                                        {parsedRecipe.ingredients.slice(0, 5).map((ing: string, i: number) => (
                                            <li key={i}>{ing}</li>
                                        ))}
                                        {parsedRecipe.ingredients.length > 5 && (
                                            <li className="text-gray-500">
                                                ... and {parsedRecipe.ingredients.length - 5} more
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                {/* Directions */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Directions ({parsedRecipe.directions.length})
                                    </label>
                                    <ol className="list-decimal list-inside space-y-2 text-gray-900">
                                        {parsedRecipe.directions.slice(0, 3).map((dir: string, i: number) => (
                                            <li key={i}>{dir}</li>
                                        ))}
                                        {parsedRecipe.directions.length > 3 && (
                                            <li className="text-gray-500">
                                                ... and {parsedRecipe.directions.length - 3} more steps
                                            </li>
                                        )}
                                    </ol>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleCreateRecipe}
                                className="flex-1 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Continue to Create Recipe
                            </button>
                            <button
                                onClick={() => {
                                    setParsedRecipe(null);
                                    setUrl("");
                                }}
                                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Import Another
                            </button>
                        </div>

                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>Note:</strong> Automated parsing may not be perfect. Please review
                                and edit the recipe data before saving.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
