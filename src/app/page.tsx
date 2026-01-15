"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import RecipeCardFlip from "@/components/recipe/RecipeCardFlip";
import { ChevronRight, TrendingUp, Users, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AnnouncementsPanel from "@/components/AnnouncementsPanel";
import { HeroAd, MiddleAd } from "@/components/ads/AdSense";
import { useTourManager } from "@/components/onboarding/useTourManager";
import RotatingBanner from "@/components/home/RotatingBanner";

// Dynamically import OnboardingTour with SSR disabled
const OnboardingTour = dynamic(
    () => import("@/components/onboarding/OnboardingTour"),
    { ssr: false }
);

const ReplayTourButton = dynamic(
    () => import("@/components/onboarding/ReplayTourButton"),
    { ssr: false }
);


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
    };
}

export default function Home() {
    const { data: session } = useSession();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    // Use the new tour manager
    const { shouldStartTour, markTourAsSeen, startTour } = useTourManager({
        pageKey: 'homepage',
        enabled: true,
    });

    useEffect(() => {
        // Fetch recipes from API
        fetch("/api/recipes?limit=9")
            .then((res) => res.json())
            .then((data) => {
                setRecipes(data.recipes || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load recipes:", err);
                setLoading(false);
            });
    }, []);

    const handleTutorialComplete = () => {
        markTourAsSeen();
    };

    const handleTutorialSkip = () => {
        markTourAsSeen();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Onboarding Tutorial */}
            <OnboardingTour
                shouldStart={shouldStartTour}
                onComplete={handleTutorialComplete}
                onSkip={handleTutorialSkip}
            />

            {/* Floating Replay Tour Button */}
            <ReplayTourButton
                onReplay={startTour}
                variant="floating"
            />

            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center overflow-hidden">
                <RotatingBanner />
                <div className="container mx-auto px-4 relative z-10 text-white">
                    <div className="max-w-3xl animate-in fade-in slide-in-from-left duration-1000">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6">
                            <span className="text-orange-400">✨</span>
                            <span className="text-sm font-medium">Your Daily Culinary Inspiration</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
                            Cook Like a <span className="text-orange-500">Pro</span> <br />
                            with AI Precision
                        </h1>
                        <p className="text-xl mb-10 text-gray-200 leading-relaxed max-w-2xl">
                            Join millions of home cooks exploring delicious recipes with AI-powered guidance,
                            live cooking streams, and a vibrant community of food enthusiasts.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="#recipes"
                                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl hover:shadow-orange-500/20"
                            >
                                Explore Recipes
                            </Link>
                            <Link
                                href="/live"
                                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-2 border-white/30 rounded-2xl font-bold text-lg transition-all hover:scale-105"
                            >
                                Watch Live
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
            </section>

            <HeroAd />

            <AnnouncementsPanel />

            {/* Stats Bar */}
            <section className="bg-white border-y">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Users className="w-6 h-6 text-orange-500" />
                                <span className="text-3xl font-bold">2.5M+</span>
                            </div>
                            <p className="text-gray-600">Active Cooks</p>
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <TrendingUp className="w-6 h-6 text-green-500" />
                                <span className="text-3xl font-bold">{recipes.length}+</span>
                            </div>
                            <p className="text-gray-600">Recipes</p>
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Video className="w-6 h-6 text-blue-500" />
                                <span className="text-3xl font-bold">1000+</span>
                            </div>
                            <p className="text-gray-600">Cooking Videos</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl font-black mb-4">Explore by Category</h2>
                        <p className="text-gray-600 text-lg">
                            From quick weekday meals to elaborate weekend feasts, find exactly what you&apos;re looking for.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: 'Dinners', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop', count: '1.2k+', delay: '0s' },
                            { name: 'Desserts', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1974&auto=format&fit=crop', count: '800+', delay: '0.1s' },
                            { name: 'Healthy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop', count: '2k+', delay: '0.2s' },
                            { name: 'Breakfast', image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1910&auto=format&fit=crop', count: '500+', delay: '0.3s' },
                        ].map((cat) => (
                            <Link
                                key={cat.name}
                                href={`/recipes?category=${cat.name.toLowerCase()}`}
                                className="group relative h-72 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-in fade-in zoom-in"
                                style={{ animationDelay: cat.delay }}
                            >
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h3 className="text-2xl font-bold mb-1">{cat.name}</h3>
                                    <p className="text-sm text-gray-300 font-medium">{cat.count} Recipes</p>
                                </div>
                                <div className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <MiddleAd />

            {/* Trending Recipes */}
            <section id="recipes" className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Trending Recipes</h2>
                            <p className="text-gray-600">
                                Most popular recipes this week
                            </p>
                        </div>
                        <Link
                            href="/recipes"
                            className="flex items-center gap-2 text-orange-600 font-semibold hover:gap-3 transition-all"
                        >
                            View All <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-[400px] bg-gray-200 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : recipes.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-600 mb-4">No recipes found. Import some recipes first!</p>
                            <Link
                                href="/api/recipes/seed"
                                className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600"
                            >
                                Import Sample Recipes
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {recipes.slice(0, 9).map((recipe) => (
                                <RecipeCardFlip
                                    key={recipe.id}
                                    id={recipe.id}
                                    slug={recipe.slug}
                                    title={recipe.title}
                                    image={recipe.imageUrl}
                                    category={recipe.category.name.toUpperCase()}
                                    rating={recipe.averageRating}
                                    ratingCount={recipe.ratingCount}
                                    totalTime={recipe.totalTime}
                                    summary={recipe.summary}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            {!session && (
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-200/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h2 className="text-4xl md:text-5xl font-black mb-6">
                                    Ready to Start Your <br /> Culinary Journey?
                                </h2>
                                <p className="text-xl mb-10 text-white/90">
                                    Create a free account today to save recipes, follow creators,
                                    and get personalized AI recommendations.
                                </p>
                                <Link
                                    href="/signup"
                                    className="inline-block px-10 py-5 bg-white text-orange-600 rounded-2xl font-black text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
                                >
                                    Sign Up For Free
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
