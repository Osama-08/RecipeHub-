"use client";

import { Search, Heart, Menu, User, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import NotificationBell from "./NotificationBell";

export default function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            {/* Top Bar */}
            <div className="border-b">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-8">
                        <button className="lg:hidden">
                            <Menu className="w-6 h-6" />
                        </button>
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                                RecipeHub
                            </span>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl mx-8 hidden md:block">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Find a recipe or ingredient"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pr-12 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center gap-4">
                        {status === "loading" ? (
                            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                        ) : session ? (
                            <>
                                {/* Notification Bell */}
                                <NotificationBell />

                                <Link
                                    href="/saved-recipes"
                                    className="flex items-center gap-2 hover:text-orange-500 transition-colors"
                                >
                                    <Heart className="w-5 h-5" />
                                    <span className="hidden lg:inline">My Recipes</span>
                                </Link>

                                {/* User Avatar & Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                                    >
                                        {session.user?.image ? (
                                            <Image
                                                src={session.user.image}
                                                alt={session.user.name || "User"}
                                                width={36}
                                                height={36}
                                                className="rounded-full border-2 border-orange-500"
                                            />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold">
                                                {session.user?.name?.[0] || session.user?.email?.[0] || "U"}
                                            </div>
                                        )}
                                        <span className="hidden lg:inline font-medium">
                                            {session.user?.name || "Account"}
                                        </span>
                                        <ChevronDown className="w-4 h-4 hidden lg:inline" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
                                            <div className="px-4 py-3 border-b">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {session.user?.name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {session.user?.email}
                                                </p>
                                            </div>
                                            {/* Show Admin Dashboard for admin users */}
                                            {typeof session.user === 'object' && session.user && 'role' in session.user && session.user.role === 'ADMIN' && (
                                                <>
                                                    <Link
                                                        href="/admin"
                                                        className="block px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-colors"
                                                        onClick={() => setShowUserMenu(false)}
                                                    >
                                                        🔧 Admin Dashboard
                                                    </Link>
                                                    <Link
                                                        href="/admin/announcements"
                                                        className="block px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-colors"
                                                        onClick={() => setShowUserMenu(false)}
                                                    >
                                                        📢 Announcements
                                                    </Link>
                                                </>
                                            )}
                                            <Link
                                                href="/dashboard"
                                                className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                Dashboard
                                            </Link>
                                            <Link
                                                href="/saved-recipes"
                                                className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                Saved Recipes
                                            </Link>
                                            <Link
                                                href="/settings"
                                                className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                Settings
                                            </Link>
                                            <div className="border-t my-2"></div>
                                            <button
                                                onClick={() => {
                                                    setShowUserMenu(false);
                                                    signOut({ callbackUrl: "/" });
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Log Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="hidden sm:flex items-center gap-2 hover:text-orange-500 transition-colors font-medium"
                                >
                                    <User className="w-5 h-5" />
                                    <span className="hidden lg:inline">Log In</span>
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg active:scale-95"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="border-b hidden lg:block">
                <div className="container mx-auto px-4">
                    <ul className="flex items-center gap-8 text-sm font-medium">
                        <li>
                            <Link href="/dinners" className="block py-4 hover:text-orange-500 transition-colors">
                                DINNERS
                            </Link>
                        </li>
                        <li>
                            <Link href="/meals" className="block py-4 hover:text-orange-500 transition-colors">
                                MEALS
                            </Link>
                        </li>
                        <li>
                            <Link href="/ingredients" className="block py-4 hover:text-orange-500 transition-colors">
                                INGREDIENTS
                            </Link>
                        </li>
                        <li>
                            <Link href="/occasions" className="block py-4 hover:text-orange-500 transition-colors">
                                OCCASIONS
                            </Link>
                        </li>
                        <li>
                            <Link href="/cuisines" className="block py-4 hover:text-orange-500 transition-colors">
                                CUISINES
                            </Link>
                        </li>
                        <li>
                            <Link href="/tips" className="block py-4 hover:text-orange-500 transition-colors">
                                KITCHEN TIPS
                            </Link>
                        </li>
                        <li>
                            <Link href="/live" className="block py-4 hover:text-orange-500 transition-colors">
                                LIVE
                            </Link>
                        </li>
                        <li>
                            <Link href="/community" className="block py-4 hover:text-orange-500 transition-colors">
                                COMMUNITY
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Overlay to close menu when clicking outside */}
            {showUserMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                ></div>
            )}
        </header>
    );
}
