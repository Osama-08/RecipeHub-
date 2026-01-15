"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { Lightbulb, ChefHat, Loader2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface KitchenTip {
    id: string;
    title: string;
    content: string;
    category: string;
    difficulty?: string;
    featured: boolean;
    createdAt: string;
}

export default function KitchenTipsPage() {
    const { t } = useLanguage();
    const [tips, setTips] = useState<KitchenTip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/tips?limit=20")
            .then((res) => res.json())
            .then((data) => {
                setTips(data.tips || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load tips:", err);
                setLoading(false);
            });
    }, []);

    // Group tips by category
    const groupedTips = tips.reduce((acc, tip) => {
        const category = tip.category || "General";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(tip);
        return acc;
    }, {} as Record<string, KitchenTip[]>);

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            "Knife Skills": "bg-blue-500",
            "Seasoning": "bg-red-500",
            "Temperature": "bg-orange-500",
            "Timing": "bg-green-500",
            "Storage": "bg-purple-500",
            "General": "bg-gray-500",
        };
        return colors[category] || "bg-amber-500";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        <ChefHat className="w-12 h-12 mb-4" />
                        <h1 className="text-5xl font-bold mb-4">{t('tips.title')}</h1>
                        <p className="text-xl text-white/90">
                            {t('tips.subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tips Content */}
            <div className="container mx-auto px-4 py-12">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
                        <span className="ml-3 text-xl text-gray-600">Loading tips...</span>
                    </div>
                ) : tips.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-md">
                        <Lightbulb className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                        <h2 className="text-2xl font-bold mb-4 text-gray-700">No Tips Available Yet</h2>
                        <p className="text-gray-600 mb-6">
                            Our AI is preparing fresh kitchen tips for you!
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600"
                        >
                            Refresh Page
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-3xl font-bold mb-8">Browse Tips by Category</h2>

                        {Object.entries(groupedTips).map(([category, categoryTips]) => (
                            <div key={category} className="mb-12">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`${getCategoryColor(category)} p-3 rounded-lg`}>
                                        <Lightbulb className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold">{category}</h3>
                                    <span className="ml-auto text-gray-500 text-sm">
                                        {categoryTips.length} tip{categoryTips.length !== 1 ? "s" : ""}
                                    </span>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {categoryTips.map((tip) => (
                                        <div
                                            key={tip.id}
                                            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer group border-l-4 border-orange-500"
                                        >
                                            {tip.featured && (
                                                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-xs font-bold rounded-full mb-3">
                                                    ⭐ Featured
                                                </span>
                                            )}
                                            <h4 className="font-bold text-lg mb-3 group-hover:text-orange-600 transition-colors">
                                                {tip.title}
                                            </h4>
                                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                                                {tip.content}
                                            </p>
                                            {tip.difficulty && (
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <span className="text-xs text-gray-500 font-medium">
                                                        Level: <span className="text-orange-600">{tip.difficulty}</span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* CTA */}
                        <div className="mt-12 text-center bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 shadow-md border-2 border-orange-200">
                            <h3 className="text-2xl font-bold mb-4">Ready to Cook?</h3>
                            <p className="text-gray-700 mb-6">
                                Put these tips to use with our delicious recipes
                            </p>
                            <Link
                                href="/recipes"
                                className="inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-bold hover:from-orange-600 hover:to-amber-600 transition-all"
                            >
                                Browse Recipes
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
