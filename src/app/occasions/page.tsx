"use client";

import Header from "@/components/layout/Header";
import { Calendar, PartyPopper, Clock, Heart } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const occasions = [
    {
        name: "Quick & Easy",
        slug: "quick",
        icon: Clock,
        color: "from-blue-500 to-cyan-500",
        description: "Meals ready in 30 minutes or less",
        image: "⚡"
    },
    {
        name: "Holiday Favorites",
        slug: "holiday",
        icon: Calendar,
        color: "from-red-500 to-pink-500",
        description: "Perfect for Christmas, Thanksgiving, Easter",
        image: "🎄"
    },
    {
        name: "Party Food",
        slug: "party",
        icon: PartyPopper,
        color: "from-purple-500 to-pink-500",
        description: "Impress your guests with these crowd-pleasers",
        image: "🎉"
    },
    {
        name: "Date Night",
        slug: "romantic",
        icon: Heart,
        color: "from-rose-500 to-red-500",
        description: "Romantic recipes for two",
        image: "💝"
    },
    {
        name: "Family Meals",
        slug: "family",
        icon: Heart,
        color: "from-orange-500 to-amber-500",
        description: "Kid-friendly and family favorites",
        image: "👨‍👩‍👧‍👦"
    },
    {
        name: "Meal Prep",
        slug: "meal-prep",
        icon: Calendar,
        color: "from-green-500 to-emerald-500",
        description: "Make ahead and save time",
        image: "📦"
    },
];

export default function OccasionsPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        <Calendar className="w-12 h-12 mb-4" />
                        <h1 className="text-5xl font-bold mb-4">{t('occasions.title')}</h1>
                        <p className="text-xl text-white/90">
                            {t('occasions.subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Occasions Grid */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold mb-8">Browse by Occasion</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {occasions.map((occasion) => {
                        const Icon = occasion.icon;
                        return (
                            <Link
                                key={occasion.slug}
                                href={`/recipes?sort=quickest`}
                                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className={`relative h-40 bg-gradient-to-br ${occasion.color} flex items-center justify-center`}>
                                    <span className="text-7xl">{occasion.image}</span>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Icon className="w-6 h-6 text-gray-600" />
                                        <h3 className="text-2xl font-bold group-hover:text-orange-600 transition-colors">
                                            {occasion.name}
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">{occasion.description}</p>
                                    <div className="text-orange-600 font-semibold">
                                        {t('occasions.viewRecipes')} →
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Seasonal Section */}
                <div className="mt-16">
                    <h2 className="text-3xl font-bold mb-6">Seasonal Favorites</h2>
                    <div className="grid md:grid-cols-4 gap-4">
                        <Link href="/recipes" className="bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-xl p-6 text-center hover:scale-105 transition-transform">
                            <div className="text-5xl mb-3">🌸</div>
                            <h3 className="font-bold text-xl">Spring</h3>
                            <p className="text-sm text-white/90">Fresh & Light</p>
                        </Link>
                        <Link href="/recipes" className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-xl p-6 text-center hover:scale-105 transition-transform">
                            <div className="text-5xl mb-3">☀️</div>
                            <h3 className="font-bold text-xl">Summer</h3>
                            <p className="text-sm text-white/90">BBQ & Grilling</p>
                        </Link>
                        <Link href="/recipes" className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl p-6 text-center hover:scale-105 transition-transform">
                            <div className="text-5xl mb-3">🍂</div>
                            <h3 className="font-bold text-xl">Fall</h3>
                            <p className="text-sm text-white/90">Cozy & Warm</p>
                        </Link>
                        <Link href="/recipes" className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white rounded-xl p-6 text-center hover:scale-105 transition-transform">
                            <div className="text-5xl mb-3">❄️</div>
                            <h3 className="font-bold text-xl">Winter</h3>
                            <p className="text-sm text-white/90">Hearty & Comforting</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
