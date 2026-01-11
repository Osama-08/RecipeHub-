"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import RecipeCardFlip from "@/components/recipe/RecipeCardFlip";
import { Search, SlidersHorizontal } from "lucide-react";
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
        slug: string;
    };
}

function RecipesContent() {
    const searchParams = useSearchParams();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [sortBy, setSortBy] = useState("newest");

    const categories = [
        { name: "All", slug: "" },
        { name: "Breakfast", slug: "breakfast" },
        { name: "Lunch", slug: "lunch" },
        { name: "Dinner", slug: "dinner" },
        { name: "Desserts", slug: "desserts" },
        { name: "Appetizers", slug: "appetizers" },
        { name: "Snacks", slug: "snacks" },
        { name: "Italian", slug: "italian" },
        { name: "Mexican", slug: "mexican" },
        { name: "Asian", slug: "asian" },
        { name: "Mediterranean", slug: "mediterranean" },
        { name: "American", slug: "american" },
        { name: "Indian", slug: "indian" },
    ];

    useEffect(() => {
        const query = searchParams.get("search");
        if (query) {
            setSearchQuery(query);
            setPage(1);
        }
    }, [searchParams]);

    const fetchRecipes = useCallback(async () => {
        setLoading(true);
        try {
            let url = `/api/recipes?page=${page}&limit=12&sort=${sortBy}`;
            if (selectedCategory) url += `&category=${selectedCategory}`;
            if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

            const res = await fetch(url);
            const data = await res.json();
            setRecipes(data.recipes || []);
            setTotal(data.pagination?.total || 0);
        } catch (error) {
            console.error("Failed to load recipes:", error);
        }
        setLoading(false);
    }, [page, selectedCategory, sortBy, searchQuery]);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchRecipes();
    };

    return (
        <>
            {/* Page Header */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">All Recipes</h1>
                    <p className="text-xl text-white/90">
                        Discover {total.toLocaleString()}+ delicious recipes from around the world
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Search & Filters */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search recipes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </form>

                    {/* Category Filter */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                            <h3 className="font-semibold text-gray-900">Filter by Category</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.slug}
                                    onClick={() => {
                                        setSelectedCategory(cat.slug);
                                        setPage(1);
                                    }}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === cat.slug
                                        ? "bg-orange-500 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600 font-medium">Sort by:</span>
                        <div className="flex gap-2">
                            {[
                                { label: "Newest", value: "newest" },
                                { label: "Most Popular", value: "popular" },
                                { label: "Quickest", value: "quickest" },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setSortBy(option.value);
                                        setPage(1);
                                    }}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${sortBy === option.value
                                        ? "bg-orange-500 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        Showing {recipes.length} of {total.toLocaleString()} recipes
                        {selectedCategory && (
                            <span className="ml-2 text-orange-600 font-semibold">
                                in {categories.find(c => c.slug === selectedCategory)?.name}
                            </span>
                        )}
                    </p>
                </div>

                {/* Recipe Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="h-[400px] bg-gray-200 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : recipes.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-600 text-lg mb-4">No recipes found</p>
                        <Link
                            href="/recipes"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("");
                                setSortBy("newest");
                            }}
                            className="text-orange-600 font-semibold hover:underline"
                        >
                            Clear filters
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {recipes.map((recipe) => (
                                <RecipeCardFlip
                                    key={recipe.id}
                                    id={recipe.id}
                                    slug={recipe.slug}
                                    title={recipe.title}
                                    image={recipe.imageUrl}
                                    category={recipe.category?.name?.toUpperCase() || "GENERAL"}
                                    rating={recipe.averageRating}
                                    ratingCount={recipe.ratingCount}
                                    totalTime={recipe.totalTime}
                                    summary={recipe.summary}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {total > 12 && (
                            <div className="mt-12 flex justify-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-orange-500 transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold">
                                    Page {page}
                                </span>
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={recipes.length < 12}
                                    className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-orange-500 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default function RecipesPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Suspense fallback={
                <div className="min-h-screen bg-gray-50">
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-12">
                        <div className="container mx-auto px-4">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">All Recipes</h1>
                            <p className="text-xl text-white/90">Loading recipes...</p>
                        </div>
                    </div>
                    <div className="container mx-auto px-4 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="h-[400px] bg-gray-200 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>
            }>
                <RecipesContent />
            </Suspense>
        </div>
    );
}
