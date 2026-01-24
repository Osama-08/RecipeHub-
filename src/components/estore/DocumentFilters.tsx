"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface DocumentFiltersProps {
    categories: { name: string; count: number }[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onSearchSubmit: () => void;
}

export default function DocumentFilters({
    categories,
    selectedCategory,
    onCategoryChange,
    searchQuery,
    onSearchChange,
    onSearchSubmit,
}: DocumentFiltersProps) {
    const [showFilters, setShowFilters] = useState(false);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearchSubmit();
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by title, author, or description..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full px-4 py-3 pl-12 pr-4 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* Mobile Filter Toggle */}
            <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 text-gray-700 font-medium mb-4"
            >
                <SlidersHorizontal className="w-5 h-5" />
                {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            {/* Category Filters */}
            <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                    Categories
                </h3>
                <div className="space-y-2">
                    <button
                        onClick={() => onCategoryChange("all")}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedCategory === "all"
                                ? "bg-orange-500 text-white font-semibold"
                                : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                            }`}
                    >
                        All Categories
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => onCategoryChange(cat.name)}
                            className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${selectedCategory === cat.name
                                    ? "bg-orange-500 text-white font-semibold"
                                    : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                                }`}
                        >
                            <span>{cat.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === cat.name
                                    ? "bg-white/20"
                                    : "bg-gray-200"
                                }`}>
                                {cat.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
