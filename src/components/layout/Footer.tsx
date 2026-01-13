"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <span className="text-3xl font-black tracking-tighter text-white">
                                Recipe<span className="text-orange-500">Hub</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed">
                            Discover amazing recipes with AI-powered cooking assistance, automated content generation, and a vibrant community of food lovers.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">
                                <Youtube className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/recipes" className="hover:text-orange-500 transition-colors">Browse Recipes</Link>
                            </li>
                            <li>
                                <Link href="/live" className="hover:text-orange-500 transition-colors">Live Cooking</Link>
                            </li>
                            <li>
                                <Link href="/community" className="hover:text-orange-500 transition-colors">Community Feed</Link>
                            </li>
                            <li>
                                <Link href="/kitchen-tips" className="hover:text-orange-500 transition-colors">Kitchen Tips</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Categories</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/recipes?category=dinners" className="hover:text-orange-500 transition-colors">Dinners</Link>
                            </li>
                            <li>
                                <Link href="/recipes?category=meals" className="hover:text-orange-500 transition-colors">Meals</Link>
                            </li>
                            <li>
                                <Link href="/recipes?category=cuisines" className="hover:text-orange-500 transition-colors">Cuisines</Link>
                            </li>
                            <li>
                                <Link href="/recipes?category=occasions" className="hover:text-orange-500 transition-colors">Occasions</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                                <span>123 Culinary Ave, Foodie City, FC 54321</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-orange-500 shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-orange-500 shrink-0" />
                                <span>contact@recipehub.ai</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>© 2026 CaribbeanRecipe AI. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
