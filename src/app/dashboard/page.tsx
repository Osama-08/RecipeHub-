"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/layout/Header";
import { Loader2, ChefHat, Heart, BookOpen, Settings } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-16 flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
            </div>
        );
    }

    // Check if user is admin
    const userEmail = session?.user?.email;
    const isAdmin = session?.user && 'role' in session.user && session.user.role === 'ADMIN';

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {session?.user?.name || 'Chef'}!
                    </h1>
                    <p className="text-gray-600">
                        Manage your recipes, favorites, and cooking journey
                    </p>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Saved Recipes Card */}
                    <Link
                        href="/saved-recipes"
                        className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Heart className="w-6 h-6 text-red-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Saved Recipes</h2>
                        </div>
                        <p className="text-gray-600">
                            View and organize your favorite recipes
                        </p>
                    </Link>

                    {/* Browse Recipes Card */}
                    <Link
                        href="/recipes"
                        className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-orange-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Browse Recipes</h2>
                        </div>
                        <p className="text-gray-600">
                            Discover new recipes and cooking ideas
                        </p>
                    </Link>

                    {/* Settings Card */}
                    <Link
                        href="/settings"
                        className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Settings className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Settings</h2>
                        </div>
                        <p className="text-gray-600">
                            Manage your account and preferences
                        </p>
                    </Link>

                    {/* Admin Dashboard Card (Only for Admins) */}
                    {isAdmin && (
                        <Link
                            href="/admin"
                            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <ChefHat className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-xl font-bold">Admin Dashboard</h2>
                            </div>
                            <p className="text-white/90">
                                Manage recipes, users, and site content
                            </p>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
