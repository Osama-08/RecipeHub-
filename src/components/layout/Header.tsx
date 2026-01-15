"use client";

import { Search, Heart, Menu, User, LogOut, ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import NotificationBell from "./NotificationBell";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();
    const { t } = useLanguage();

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
                        {/* Mobile menu toggle */}
                        <button
                            type="button"
                            className="lg:hidden p-1 -ml-2 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
                            aria-label={showMobileMenu ? "Close navigation menu" : "Open navigation menu"}
                            onClick={() => setShowMobileMenu((prev) => !prev)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/logo.jpg"
                                alt="CaribbeanRecipe Logo"
                                width={40}
                                height={40}
                                className="rounded-md object-contain"
                            />
                            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                                CaribbeanRecipe
                            </span>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl mx-8 hidden md:block">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder={t('header.searchPlaceholder')}
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
                                    data-tour="saved-recipes"
                                >
                                    <Heart className="w-5 h-5" />
                                    <span className="hidden lg:inline">{t('header.myRecipes')}</span>
                                </Link>

                                {/* User Avatar & Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                                        data-tour="user-menu"
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
                                            {session.user?.name || t('header.account')}
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
                                                {t('header.settings')}
                                            </Link>
                                            <div className="border-t my-2"></div>
                                            <button
                                                onClick={() => {
                                                    setShowUserMenu(false);
                                                    if (typeof window !== 'undefined' && (window as any).startTour) {
                                                        (window as any).startTour();
                                                    }
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 transition-colors flex items-center gap-2"
                                            >
                                                🎯 Take a Tour
                                            </button>
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

            {/* Desktop Navigation Menu */}
            <nav className="border-b hidden lg:block" data-tour="navigation">
                <div className="container mx-auto px-4">
                    <ul className="flex items-center gap-8 text-sm font-medium">
                        <li>
                            <Link href="/dinners" className="block py-4 hover:text-orange-500 transition-colors">
                                {t('header.nav.dinners')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/meals" className="block py-4 hover:text-orange-500 transition-colors">
                                {t('header.nav.meals')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/ingredients" className="block py-4 hover:text-orange-500 transition-colors">
                                {t('header.nav.ingredients')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/occasions" className="block py-4 hover:text-orange-500 transition-colors">
                                {t('header.nav.occasions')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/cuisines" className="block py-4 hover:text-orange-500 transition-colors">
                                {t('header.nav.cuisines')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/tips" className="block py-4 hover:text-orange-500 transition-colors">
                                {t('header.nav.kitchenTips')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/live" className="block py-4 hover:text-orange-500 transition-colors" data-tour="live-sessions">
                                {t('header.nav.live')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/community" className="block py-4 hover:text-orange-500 transition-colors" data-tour="community">
                                {t('header.nav.kitchens')}
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Mobile Navigation Drawer */}
            {showMobileMenu && (
                <div className="lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                        onClick={() => setShowMobileMenu(false)}
                    />

                    {/* Side drawer */}
                    <div className="fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] bg-white shadow-xl border-r flex flex-col">
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                                CaribbeanRecipe
                            </span>
                            <button
                                type="button"
                                className="p-1 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
                                aria-label="Close navigation menu"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile search */}
                        <div className="px-4 py-3 border-b">
                            <form
                                onSubmit={(e) => {
                                    handleSearch(e);
                                    setShowMobileMenu(false);
                                }}
                                className="relative"
                            >
                                <input
                                    type="text"
                                    placeholder={t('header.searchRecipes')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-3 py-2 pr-10 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-sm"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-1.5 rounded-lg transition-colors"
                                >
                                    <Search className="w-4 h-4" />
                                </button>
                            </form>
                        </div>

                        {/* Nav links */}
                        <nav className="flex-1 overflow-y-auto">
                            <ul className="py-2 text-sm font-medium">
                                <li>
                                    <Link
                                        href="/dinners"
                                        className="block px-4 py-2.5 hover:bg-gray-50"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        {t('header.mobileNav.dinners')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/meals"
                                        className="block px-4 py-2.5 hover:bg-gray-50"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        {t('header.mobileNav.meals')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/ingredients"
                                        className="block px-4 py-2.5 hover:bg-gray-50"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        {t('header.mobileNav.ingredients')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/occasions"
                                        className="block px-4 py-2.5 hover:bg-gray-50"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        {t('header.mobileNav.occasions')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/cuisines"
                                        className="block px-4 py-2.5 hover:bg-gray-50"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        {t('header.mobileNav.cuisines')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/tips"
                                        className="block px-4 py-2.5 hover:bg-gray-50"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        {t('header.mobileNav.kitchenTips')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/live"
                                        className="block px-4 py-2.5 hover:bg-gray-50"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        {t('header.mobileNav.live')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/community"
                                        className="block px-4 py-2.5 hover:bg-gray-50"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        {t('header.mobileNav.kitchens')}
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                        {/* Auth shortcuts on mobile */}
                        <div className="border-t px-4 py-3 space-y-2">
                            {status === "authenticated" && session ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="block w-full text-center px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-semibold"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        {t('header.dashboard')}
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowMobileMenu(false);
                                            signOut({ callbackUrl: "/" });
                                        }}
                                        className="block w-full text-center px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold"
                                    >
                                        {t('header.logOut')}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="block w-full text-center px-4 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-semibold"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        {t('header.logIn')}
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="block w-full text-center px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        {t('header.signUp')}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay to close menu when clicking outside */}
            {(showUserMenu || showMobileMenu) && (
                <div
                    className="fixed inset-0 z-30 lg:hidden"
                    onClick={() => {
                        setShowUserMenu(false);
                        setShowMobileMenu(false);
                    }}
                ></div>
            )}
        </header>
    );
}
