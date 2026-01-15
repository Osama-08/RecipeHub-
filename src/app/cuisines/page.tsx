"use client";

import Header from "@/components/layout/Header";
import { Globe, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

const cuisines = [
    { name: "Italian", slug: "italian", flag: "🇮🇹", description: "Pasta, pizza, and Mediterranean flavors", image: "/images/pasta.png" },
    { name: "Mexican", slug: "mexican", flag: "🇲🇽", description: "Tacos, enchiladas, and spicy delights", image: "/images/pasta.png" },
    { name: "Asian", slug: "asian", flag: "🌏", description: "Chinese, Japanese, Thai, and more", image: "/images/pasta.png" },
    { name: "Mediterranean", slug: "mediterranean", flag: "🌊", description: "Fresh, healthy, and flavorful", image: "/images/pasta.png" },
    { name: "American", slug: "american", flag: "🇺🇸", description: "Classic comfort food", image: "/images/pasta.png" },
    { name: "Indian", slug: "indian", flag: "🇮🇳", description: "Rich spices and aromatic curries", image: "/images/pasta.png" },
    { name: "French", slug: "french", flag: "🇫🇷", description: "Elegant and refined cuisine", image: "/images/pasta.png" },
    { name: "Middle Eastern", slug: "middle-eastern", flag: "🌙", description: "Flavorful and aromatic", image: "/images/pasta.png" },
];

export default function CuisinesPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Globe className="w-12 h-12" />
                            <h1 className="text-5xl font-bold">{t('cuisines.title')}</h1>
                        </div>
                        <p className="text-xl text-white/90">
                            {t('cuisines.subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Cuisines Grid */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold mb-8">Explore by Cuisine</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cuisines.map((cuisine) => (
                        <Link
                            key={cuisine.slug}
                            href={`/recipes?category=${cuisine.slug}`}
                            className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                        >
                            <div className="relative h-48 bg-gradient-to-br from-orange-400 to-amber-500">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-8xl">{cuisine.flag}</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-bold mb-2 group-hover:text-orange-600 transition-colors">
                                    {cuisine.name}
                                </h3>
                                <p className="text-gray-600 mb-4">{cuisine.description}</p>
                                <div className="flex items-center text-orange-600 font-semibold">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span>{t('cuisines.viewRecipes')} →</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Featured Section */}
                <div className="mt-16">
                    <h2 className="text-3xl font-bold mb-6">Popular Around the World</h2>
                    <div className="bg-white rounded-xl p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-bold mb-4">🔥 Trending Cuisines</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <Link href="/recipes?category=italian" className="text-orange-600 hover:underline font-medium">
                                            Italian Classics
                                        </Link>
                                        <span className="text-gray-600 ml-2">- Pasta, Pizza, Risotto</span>
                                    </li>
                                    <li>
                                        <Link href="/recipes?category=asian" className="text-orange-600 hover:underline font-medium">
                                            Asian Favorites
                                        </Link>
                                        <span className="text-gray-600 ml-2">- Stir-fry, Sushi, Curry</span>
                                    </li>
                                    <li>
                                        <Link href="/recipes?category=mexican" className="text-orange-600 hover:underline font-medium">
                                            Mexican Delights
                                        </Link>
                                        <span className="text-gray-600 ml-2">- Tacos, Burritos, Quesadillas</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-4">🌟 Recommended</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <Link href="/recipes?category=mediterranean" className="text-orange-600 hover:underline font-medium">
                                            Mediterranean Diet
                                        </Link>
                                        <span className="text-gray-600 ml-2">- Healthy & Fresh</span>
                                    </li>
                                    <li>
                                        <Link href="/recipes?category=indian" className="text-orange-600 hover:underline font-medium">
                                            Indian Spices
                                        </Link>
                                        <span className="text-gray-600 ml-2">- Flavorful Curries</span>
                                    </li>
                                    <li>
                                        <Link href="/recipes?category=french" className="text-orange-600 hover:underline font-medium">
                                            French Cuisine
                                        </Link>
                                        <span className="text-gray-600 ml-2">- Elegant & Refined</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
