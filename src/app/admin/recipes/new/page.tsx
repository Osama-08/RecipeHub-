"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";

export default function NewRecipePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [summary, setSummary] = useState("");
    const [prepTime, setPrepTime] = useState("");
    const [cookTime, setCookTime] = useState("");
    const [servings, setServings] = useState("4");
    const [difficulty, setDifficulty] = useState("Medium");
    const [imageUrl, setImageUrl] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [occasion, setOccasion] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [youtubeId, setYoutubeId] = useState("");
    const [videoCreatorName, setVideoCreatorName] = useState("");
    const [videoCreatorChannelId, setVideoCreatorChannelId] = useState("");

    // Ingredients list
    const [ingredients, setIngredients] = useState([
        { amount: "", unit: "", name: "", optional: false },
    ]);

    // Directions list
    const [directions, setDirections] = useState([
        { stepNumber: 1, instruction: "", imageUrl: "" },
    ]);

    // Nutrition
    const [nutrition, setNutrition] = useState({
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        saturatedFat: "",
        fiber: "",
        sugar: "",
        sodium: "",
    });

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("/api/categories");
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.categories);
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    // Check for imported YouTube data
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const imported = params.get("imported");
        const dataStr = params.get("data");

        if (imported === "true" && dataStr) {
            try {
                const data = JSON.parse(decodeURIComponent(dataStr));

                // Pre-fill basic information
                if (data.title) setTitle(data.title);
                if (data.description) setDescription(data.description);
                if (data.imageUrl) setImageUrl(data.imageUrl);
                if (data.servings) setServings(String(data.servings));
                if (data.prepTime) setPrepTime(String(data.prepTime));
                if (data.cookTime) setCookTime(String(data.cookTime));

                // Pre-fill YouTube data
                if (data.youtubeId) setYoutubeId(data.youtubeId);
                if (data.videoCreatorName) setVideoCreatorName(data.videoCreatorName);
                if (data.videoCreatorChannelId) setVideoCreatorChannelId(data.videoCreatorChannelId);

                // Pre-fill ingredients
                if (data.ingredients && Array.isArray(data.ingredients) && data.ingredients.length > 0) {
                    const formattedIngredients = data.ingredients.map((ing: string) => {
                        // Try to parse "amount unit name" format
                        const parts = ing.trim().split(/\s+/);
                        if (parts.length >= 2) {
                            const amount = parts[0];
                            const unit = parts[1];
                            const name = parts.slice(2).join(" ");
                            return {
                                amount: isNaN(Number(amount)) ? "" : amount,
                                unit: isNaN(Number(amount)) ? parts[0] : unit,
                                name: isNaN(Number(amount)) ? parts.slice(1).join(" ") : name,
                                optional: false,
                            };
                        }
                        return {
                            amount: "",
                            unit: "",
                            name: ing,
                            optional: false,
                        };
                    });
                    setIngredients(formattedIngredients);
                }

                // Pre-fill directions
                if (data.directions && Array.isArray(data.directions) && data.directions.length > 0) {
                    const formattedDirections = data.directions.map((dir: string, index: number) => ({
                        stepNumber: index + 1,
                        instruction: dir,
                        imageUrl: "",
                    }));
                    setDirections(formattedDirections);
                }

                // Clear the URL parameters
                window.history.replaceState({}, "", "/admin/recipes/new");
            } catch (err) {
                console.error("Failed to parse imported data:", err);
            }
        }
    }, []);

    const addIngredient = () => {
        setIngredients([...ingredients, { amount: "", unit: "", name: "", optional: false }]);
    };

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const updateIngredient = (index: number, field: string, value: string | boolean) => {
        const updated = [...ingredients];
        updated[index] = { ...updated[index], [field]: value };
        setIngredients(updated);
    };

    const addDirection = () => {
        setDirections([
            ...directions,
            { stepNumber: directions.length + 1, instruction: "", imageUrl: "" },
        ]);
    };

    const removeDirection = (index: number) => {
        const updated = directions.filter((_, i) => i !== index);
        // Renumber steps
        const renumbered = updated.map((dir, i) => ({ ...dir, stepNumber: i + 1 }));
        setDirections(renumbered);
    };

    const updateDirection = (index: number, field: string, value: string) => {
        const updated = [...directions];
        updated[index] = { ...updated[index], [field]: value };
        setDirections(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Validate
            if (!title || !description || !prepTime || !cookTime || !imageUrl || !categoryId) {
                throw new Error("Please fill in all required fields");
            }

            if (ingredients.filter((ing) => ing.name).length === 0) {
                throw new Error("Please add at least one ingredient");
            }

            if (directions.filter((dir) => dir.instruction).length === 0) {
                throw new Error("Please add at least one direction");
            }

            const response = await fetch("/api/admin/recipes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    summary,
                    prepTime,
                    cookTime,
                    servings,
                    difficulty,
                    imageUrl,
                    categoryId,
                    occasion: occasion || null,
                    cuisine: cuisine || null,
                    youtubeId: youtubeId || null,
                    videoCreatorName: videoCreatorName || null,
                    videoCreatorChannelId: videoCreatorChannelId || null,
                    ingredients: ingredients.filter((ing) => ing.name),
                    directions: directions.filter((dir) => dir.instruction),
                    nutrition: nutrition.calories ? nutrition : null,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to create recipe");
            }

            const data = await response.json();
            router.push(`/recipes/${data.recipe.slug}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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
                    <h1 className="text-3xl font-bold text-gray-900">Create New Recipe</h1>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Summary (for recipe card)
                                </label>
                                <textarea
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Short description for the recipe card back"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Prep Time (minutes) *
                                    </label>
                                    <input
                                        type="number"
                                        value={prepTime}
                                        onChange={(e) => setPrepTime(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cook Time (minutes) *
                                    </label>
                                    <input
                                        type="number"
                                        value={cookTime}
                                        onChange={(e) => setCookTime(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Servings *
                                    </label>
                                    <input
                                        type="number"
                                        value={servings}
                                        onChange={(e) => setServings(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Difficulty *
                                    </label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option>Easy</option>
                                        <option>Medium</option>
                                        <option>Hard</option>
                                    </select>
                                </div>
                            </div>

                            <ImageUpload
                                value={imageUrl}
                                onChange={setImageUrl}
                                label="Recipe Image *"
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category *
                                </label>
                                {loadingCategories ? (
                                    <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                                        Loading categories...
                                    </div>
                                ) : categories.length === 0 ? (
                                    <div className="px-4 py-2 border border-red-300 rounded-lg bg-red-50 text-red-700">
                                        No categories found. Please create categories first in Prisma Studio.
                                    </div>
                                ) : (
                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                    >
                                        <option value="">Select a category...</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Occasion (Optional)
                                </label>
                                <select
                                    value={occasion}
                                    onChange={(e) => setOccasion(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">None</option>
                                    <option value="Quick & Easy">Quick & Easy</option>
                                    <option value="Holiday Favorites">Holiday Favorites</option>
                                    <option value="Party Food">Party Food</option>
                                    <option value="Date Night">Date Night</option>
                                    <option value="Family Meals">Family Meals</option>
                                    <option value="Meal Prep">Meal Prep</option>
                                    <option value="Spring">Spring</option>
                                    <option value="Summer">Summer</option>
                                    <option value="Fall">Fall</option>
                                    <option value="Winter">Winter</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cuisine (Optional)
                                </label>
                                <select
                                    value={cuisine}
                                    onChange={(e) => setCuisine(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">None</option>
                                    <option value="Italian">Italian</option>
                                    <option value="Mexican">Mexican</option>
                                    <option value="Asian">Asian</option>
                                    <option value="Mediterranean">Mediterranean</option>
                                    <option value="American">American</option>
                                    <option value="Indian">Indian</option>
                                    <option value="French">French</option>
                                    <option value="Middle Eastern">Middle Eastern</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* YouTube Video */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            YouTube Video (Optional)
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    YouTube URL
                                </label>
                                <input
                                    type="url"
                                    value={youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : ""}
                                    onChange={(e) => {
                                        const url = e.target.value;
                                        // Extract video ID from URL
                                        const patterns = [
                                            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
                                            /youtube\.com\/embed\/([^&\n?#]+)/,
                                        ];
                                        let extractedId = "";
                                        for (const pattern of patterns) {
                                            const match = url.match(pattern);
                                            if (match && match[1]) {
                                                extractedId = match[1];
                                                break;
                                            }
                                        }
                                        setYoutubeId(extractedId);
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/dQw4w9WgXcQ"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Paste full YouTube URL - Video ID will be extracted automatically
                                </p>
                            </div>

                            {youtubeId && (
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="aspect-video bg-black">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${youtubeId}`}
                                            title="YouTube video preview"
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                    <div className="p-3 bg-gray-50 text-sm text-gray-600">
                                        Video ID: <span className="font-mono">{youtubeId}</span>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Creator Name
                                </label>
                                <input
                                    type="text"
                                    value={videoCreatorName}
                                    onChange={(e) => setVideoCreatorName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Chef John"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Creator Channel ID (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={videoCreatorChannelId}
                                    onChange={(e) => setVideoCreatorChannelId(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="UCj0V0aG4LcdHmdPJ7aTtSCQ"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Found in the channel URL after @username or /channel/
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Ingredients *</h2>
                            <button
                                type="button"
                                onClick={addIngredient}
                                className="px-3 py-1 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" />
                                Add
                            </button>
                        </div>
                        <div className="space-y-3">
                            {ingredients.map((ing, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Amount"
                                        value={ing.amount}
                                        onChange={(e) =>
                                            updateIngredient(index, "amount", e.target.value)
                                        }
                                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Unit"
                                        value={ing.unit}
                                        onChange={(e) =>
                                            updateIngredient(index, "unit", e.target.value)
                                        }
                                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Name *"
                                        value={ing.name}
                                        onChange={(e) =>
                                            updateIngredient(index, "name", e.target.value)
                                        }
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeIngredient(index)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Directions */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Directions *</h2>
                            <button
                                type="button"
                                onClick={addDirection}
                                className="px-3 py-1 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" />
                                Add Step
                            </button>
                        </div>
                        <div className="space-y-4">
                            {directions.map((dir, index) => (
                                <div key={index} className="border-l-4 border-orange-500 pl-4">
                                    <div className="flex items-start gap-2">
                                        <span className="font-bold text-orange-600 mt-2">
                                            {dir.stepNumber}.
                                        </span>
                                        <div className="flex-1 space-y-2">
                                            <textarea
                                                placeholder="Step instruction *"
                                                value={dir.instruction}
                                                onChange={(e) =>
                                                    updateDirection(index, "instruction", e.target.value)
                                                }
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                            <ImageUpload
                                                value={dir.imageUrl || ""}
                                                onChange={(value) => updateDirection(index, "imageUrl", value)}
                                                label="Step Image (Optional)"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeDirection(index)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Nutrition (Optional) */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Nutrition Facts (Optional)
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">Per serving</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Calories
                                </label>
                                <input
                                    type="number"
                                    value={nutrition.calories}
                                    onChange={(e) =>
                                        setNutrition({ ...nutrition, calories: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Protein (g)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={nutrition.protein}
                                    onChange={(e) =>
                                        setNutrition({ ...nutrition, protein: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Carbs (g)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={nutrition.carbs}
                                    onChange={(e) =>
                                        setNutrition({ ...nutrition, carbs: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fat (g)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={nutrition.fat}
                                    onChange={(e) =>
                                        setNutrition({ ...nutrition, fat: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Recipe"
                            )}
                        </button>
                        <Link
                            href="/admin/recipes"
                            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-center"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
