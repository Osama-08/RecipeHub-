"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import DocumentCard from "@/components/estore/DocumentCard";
import DocumentFilters from "@/components/estore/DocumentFilters";
import { BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Document {
    id: string;
    slug: string;
    title: string;
    description?: string;
    category: string;
    fileType: string;
    fileSize: number;
    downloads: number;
    views: number;
    coverImageUrl?: string;
    author?: string;
    featured: boolean;
}

interface Category {
    name: string;
    count: number;
}

export default function EStorePage() {
    const { data: session } = useSession();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const isAdmin = session?.user && 'role' in session.user && session.user.role === 'ADMIN';

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [selectedCategory, page]);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/e-store/categories");
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "12",
            });

            if (selectedCategory !== "all") {
                params.append("category", selectedCategory);
            }

            if (searchQuery) {
                params.append("search", searchQuery);
            }

            const res = await fetch(`/api/e-store/documents?${params}`);
            const data = await res.json();
            setDocuments(data.documents);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = () => {
        setPage(1);
        fetchDocuments();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-orange-500 to-amber-500 text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">Cooking Resources Library</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                            Cooking E Store
                        </h1>
                        <p className="text-xl text-white/90 leading-relaxed mb-8">
                            Explore our curated collection of cooking books, guides, and documents.
                            Download valuable resources to enhance your culinary skills!
                        </p>
                        {isAdmin && (
                            <Link
                                href="/e-store/admin"
                                className="inline-block px-8 py-4 bg-white text-orange-600 rounded-2xl font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
                            >
                                📚 Manage Documents
                            </Link>
                        )}
                    </div>
                </div>
                {/* Decorative bottom curve */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-50" style={{ clipPath: 'ellipse(50% 100% at 50% 100%)' }} />
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Filters Sidebar */}
                        <div className="lg:col-span-1">
                            <DocumentFilters
                                categories={categories}
                                selectedCategory={selectedCategory}
                                onCategoryChange={setSelectedCategory}
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                                onSearchSubmit={handleSearchSubmit}
                            />
                        </div>

                        {/* Documents Grid */}
                        <div className="lg:col-span-3">
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {[...Array(6)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-96 bg-gray-200 rounded-2xl animate-pulse"
                                        />
                                    ))}
                                </div>
                            ) : documents.length === 0 ? (
                                <div className="text-center py-20">
                                    <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        No Documents Found
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        {searchQuery
                                            ? "Try adjusting your search or filters"
                                            : "No documents available yet. Check back soon!"}
                                    </p>
                                    {isAdmin && (
                                        <Link
                                            href="/e-store/admin"
                                            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                                        >
                                            Upload First Document
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {documents.map((doc) => (
                                            <DocumentCard key={doc.id} {...doc} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-2 mt-12">
                                            <button
                                                onClick={() => setPage(Math.max(1, page - 1))}
                                                disabled={page === 1}
                                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                            >
                                                Previous
                                            </button>
                                            <span className="px-4 py-2 text-gray-700 font-medium">
                                                Page {page} of {totalPages}
                                            </span>
                                            <button
                                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                                disabled={page === totalPages}
                                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
