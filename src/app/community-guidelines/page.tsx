"use client";

import React from 'react';
import { Users, Heart, Shield, AlertCircle, MessageCircle, Flag, Award } from 'lucide-react';
import Link from 'next/link';

export default function CommunityGuidelinesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-xl">
                        <Users className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        Community Guidelines
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Building a positive and supportive cooking community together
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
                    {/* Introduction */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Heart className="w-6 h-6 text-purple-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Welcome to Our Community</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            RecipeHub is a place where food lovers from around the world come together to share their passion
                            for cooking. These guidelines help ensure our community remains welcoming, respectful, and inspiring
                            for everyone. By participating in our community, you agree to follow these guidelines.
                        </p>
                    </section>

                    {/* Core Values */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-pink-100 rounded-lg">
                                <Award className="w-6 h-6 text-pink-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Our Core Values</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                                <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                                    <Heart className="w-5 h-5" />
                                    Respect & Kindness
                                </h3>
                                <p className="text-sm text-gray-700">
                                    Treat everyone with respect and kindness, regardless of skill level or background
                                </p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                                <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    Authenticity
                                </h3>
                                <p className="text-sm text-gray-700">
                                    Share genuine recipes and experiences from your own cooking journey
                                </p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                                <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5" />
                                    Constructive Feedback
                                </h3>
                                <p className="text-sm text-gray-700">
                                    Provide helpful, constructive feedback that encourages improvement
                                </p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                                <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Inclusivity
                                </h3>
                                <p className="text-sm text-gray-700">
                                    Welcome and celebrate diverse cuisines, cultures, and cooking styles
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Do's */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Shield className="w-6 h-6 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Community Do&apos;s ✅</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                <div className="text-green-600 text-xl mt-0.5">✓</div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Be Respectful and Kind</h3>
                                    <p className="text-sm text-gray-700">
                                        Treat all members with respect. Remember that everyone has different skill levels and
                                        backgrounds. Encourage beginners and celebrate successes.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                <div className="text-green-600 text-xl mt-0.5">✓</div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Share Authentic Recipes</h3>
                                    <p className="text-sm text-gray-700">
                                        Post recipes you&apos;ve personally tried, tested, and enjoyed. Include accurate measurements,
                                        clear instructions, and helpful tips.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                <div className="text-green-600 text-xl mt-0.5">✓</div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Give Credit Where Due</h3>
                                    <p className="text-sm text-gray-700">
                                        If you&apos;re sharing a recipe inspired by someone else, credit the original source. Respect
                                        intellectual property and copyright.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                <div className="text-green-600 text-xl mt-0.5">✓</div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Provide Constructive Feedback</h3>
                                    <p className="text-sm text-gray-700">
                                        When commenting on recipes, be helpful and constructive. Share suggestions for improvement
                                        in a positive, encouraging manner.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                <div className="text-green-600 text-xl mt-0.5">✓</div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Report Inappropriate Content</h3>
                                    <p className="text-sm text-gray-700">
                                        Help keep our community safe by reporting content that violates these guidelines. Use the
                                        report feature responsibly.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Don'ts */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Community Don&apos;ts ❌</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                                <div className="text-red-600 text-xl mt-0.5">✗</div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">No Harassment or Bullying</h3>
                                    <p className="text-sm text-gray-700">
                                        Do not engage in harassment, bullying, or personal attacks. This includes hateful comments
                                        about race, ethnicity, religion, gender, sexual orientation, or disability.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                                <div className="text-red-600 text-xl mt-0.5">✗</div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">No Spam or Self-Promotion</h3>
                                    <p className="text-sm text-gray-700">
                                        Do not spam the community with excessive promotional content, links to external sites, or
                                        advertisements. Focus on sharing valuable recipes and cooking experiences.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                                <div className="text-red-600 text-xl mt-0.5">✗</div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">No Inappropriate Content</h3>
                                    <p className="text-sm text-gray-700">
                                        Do not post NSFW content, graphic images, or anything that violates community standards.
                                        Keep all content family-friendly and appropriate.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                                <div className="text-red-600 text-xl mt-0.5">✗</div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">No Plagiarism</h3>
                                    <p className="text-sm text-gray-700">
                                        Do not copy recipes from other sources and claim them as your own. Always give proper credit
                                        and attribution.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                                <div className="text-red-600 text-xl mt-0.5">✗</div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">No Misinformation</h3>
                                    <p className="text-sm text-gray-700">
                                        Do not share recipes or cooking advice that could be dangerous or harmful. Be responsible
                                        with food safety information.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Reporting */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Flag className="w-6 h-6 text-orange-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Reporting Violations</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you see content or behavior that violates these guidelines, please report it using the report
                            feature. Our moderation team will review all reports and take appropriate action.
                        </p>
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <p className="text-sm text-orange-800">
                                <strong>📧 Report Content:</strong> Use the flag icon on posts and comments, or email us at
                                <strong> community@recipehub.com</strong> for serious violations.
                            </p>
                        </div>
                    </section>

                    {/* Consequences */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <AlertCircle className="w-6 h-6 text-purple-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Consequences of Violations</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Violations of these guidelines may result in:
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                                <span className="text-yellow-600 font-bold">1.</span>
                                <p className="text-sm text-gray-700">Warning and content removal</p>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                                <span className="text-orange-600 font-bold">2.</span>
                                <p className="text-sm text-gray-700">Temporary suspension of account</p>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                                <span className="text-red-600 font-bold">3.</span>
                                <p className="text-sm text-gray-700">Permanent ban from the platform</p>
                            </div>
                        </div>
                    </section>

                    {/* Updates */}
                    <section className="border-t pt-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Updates to Guidelines</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We may update these Community Guidelines from time to time. Continued use of RecipeHub after changes
                            indicates your acceptance of the updated guidelines. Please review them periodically.
                        </p>
                    </section>

                    {/* Closing */}
                    <section className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 text-center">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Thank You! 🙏</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Thank you for being part of our community and helping us create a positive space where everyone
                            can share their love of cooking. Together, we can make RecipeHub a welcoming and inspiring place
                            for food lovers around the world!
                        </p>
                    </section>
                </div>

                {/* Back to Settings */}
                <div className="mt-8 text-center">
                    <Link
                        href="/settings"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
                    >
                        ← Back to Settings
                    </Link>
                </div>
            </div>
        </div>
    );
}
