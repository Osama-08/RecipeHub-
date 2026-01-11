"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCallback } from "react";

interface Recipe {
    id: string;
    title: string;
    slug: string;
    imageUrl: string;
    views: number;
    createdAt: string;
    category: {
        name: string;
    };
    _count: {
        ingredients: number;
        directions: number;
        reviews: number;
    };
}

export default function AdminRecipesPage() {
    const router = useRouter();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchRecipes = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "20",
                ...(searchQuery && { search: searchQuery }),
            });

            const response = await fetch(`/api/admin/recipes?${params}`);

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    router.push("/login");
                    return;
                }
                throw new Error("Failed to fetch recipes");
            }

            const data = await response.json();
            setRecipes(data.recipes);
            setTotalPages(data.pagination.pages);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        } finally {
            setLoading(false);
        }
    }, [page, searchQuery, router]);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/recipes/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete recipe");

            // Refresh list
            fetchRecipes();
        } catch (error) {
            console.error("Error deleting recipe:", error);
            alert("Failed to delete recipe");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Manage Recipes</h1>
                            <p className="text-gray-600">Create, edit, and manage your recipes</p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/admin"
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/admin/recipes/new"
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                New Recipe
                            </Link>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="mt-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search recipes..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                    </div>
                ) : recipes.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 mb-4">No recipes found</p>
                        <Link
                            href="/admin/recipes/new"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Create Your First Recipe
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Recipe Grid */}
                        <div className="grid grid-cols-1 gap-4">
                            {recipes.map((recipe) => (
                                <div
                                    key={recipe.id}
                                    className="bg-white rounded-lg border shadow-sm p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-24 h-24 flex-shrink-0">
                                            <Image
                                                src={recipe.imageUrl}
                                                alt={recipe.title}
                                                fill
                                                className="rounded-lg object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                {recipe.title}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {recipe.category.name} • {recipe._count.ingredients} ingredients •{" "}
                                                {recipe._count.directions} steps
                                            </p>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-4 h-4" />
                                                    {recipe.views} views
                                                </span>
                                                <span>{recipe._count.reviews} reviews</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/recipes/${recipe.slug}`}
                                                target="_blank"
                                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="View recipe"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </Link>
                                            <Link
                                                href={`/admin/recipes/${recipe.id}/edit`}
                                                className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                                                title="Edit recipe"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(recipe.id, recipe.title)}
                                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete recipe"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
