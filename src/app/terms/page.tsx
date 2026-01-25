"use client";

import React from 'react';
import { FileText, AlertTriangle, CheckCircle, Scale, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function TermsAndConditionsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mb-6 shadow-xl">
                        <FileText className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        Terms & Conditions
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Last updated: January 25, 2026
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
                    {/* Introduction */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Agreement to Terms</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            Welcome to RecipeHub. By accessing or using our service, you agree to be bound by these Terms and
                            Conditions. If you disagree with any part of these terms, you may not access the service. Please
                            read these terms carefully before using our platform.
                        </p>
                    </section>

                    {/* Account Terms */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <UserCheck className="w-6 h-6 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Account Terms</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                <h3 className="font-semibold text-gray-800 mb-2">Account Creation</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                                    <li>You must be at least 13 years old to use this service</li>
                                    <li>You must provide accurate and complete information</li>
                                    <li>You are responsible for maintaining the security of your account</li>
                                    <li>You are responsible for all activities under your account</li>
                                    <li>One person or entity may not maintain more than one free account</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                <h3 className="font-semibold text-gray-800 mb-2">Account Security</h3>
                                <p className="text-sm text-gray-700">
                                    You must immediately notify us of any unauthorized use of your account. We are not liable
                                    for any loss or damage arising from your failure to comply with security obligations.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Acceptable Use */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-purple-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Acceptable Use Policy</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You agree to use RecipeHub only for lawful purposes and in accordance with these Terms. You agree NOT to:
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                <p className="text-sm text-red-800 font-medium">❌ Post harmful or offensive content</p>
                            </div>
                            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                <p className="text-sm text-red-800 font-medium">❌ Harass or abuse other users</p>
                            </div>
                            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                <p className="text-sm text-red-800 font-medium">❌ Upload viruses or malicious code</p>
                            </div>
                            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                <p className="text-sm text-red-800 font-medium">❌ Violate intellectual property rights</p>
                            </div>
                            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                <p className="text-sm text-red-800 font-medium">❌ Spam or send unsolicited messages</p>
                            </div>
                            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                <p className="text-sm text-red-800 font-medium">❌ Scrape or collect user data</p>
                            </div>
                        </div>
                    </section>

                    {/* Content Ownership */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <Scale className="w-6 h-6 text-amber-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Content and Intellectual Property</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-amber-50 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-2">Your Content</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    You retain ownership of all recipes, images, and content you post on RecipeHub. By posting
                                    content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce,
                                    and display your content on our platform.
                                </p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-2">Our Content</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    The RecipeHub platform, including its design, features, and functionality, is owned by us
                                    and protected by copyright, trademark, and other intellectual property laws. You may not
                                    copy, modify, or distribute our content without permission.
                                </p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-2">Copyright Infringement</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    We respect intellectual property rights. If you believe your work has been copied in a way
                                    that constitutes copyright infringement, please contact us immediately with details of the
                                    alleged infringement.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Disclaimer */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-orange-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Disclaimers</h2>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                            <p className="text-gray-700 text-sm leading-relaxed mb-3">
                                <strong>AS IS BASIS:</strong> The service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis
                                without warranties of any kind, either express or implied.
                            </p>
                            <p className="text-gray-700 text-sm leading-relaxed mb-3">
                                <strong>NO WARRANTY:</strong> We do not warrant that the service will be uninterrupted,
                                timely, secure, or error-free.
                            </p>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                <strong>RECIPE ACCURACY:</strong> While we strive for accuracy, we do not guarantee the
                                correctness or safety of recipes posted by users. Always use your judgment when preparing food.
                            </p>
                        </div>
                    </section>

                    {/* Limitation of Liability */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Limitation of Liability</h2>
                        <p className="text-gray-700 leading-relaxed">
                            To the maximum extent permitted by law, RecipeHub shall not be liable for any indirect, incidental,
                            special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred
                            directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1 pl-4 mt-3">
                            <li>Your use or inability to use the service</li>
                            <li>Unauthorized access to your account or data</li>
                            <li>Any conduct or content of third parties on the service</li>
                            <li>Any content obtained from the service</li>
                        </ul>
                    </section>

                    {/* Termination */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Termination</h2>
                        <p className="text-gray-700 leading-relaxed mb-3">
                            We may terminate or suspend your account and access to the service immediately, without prior notice
                            or liability, for any reason, including breach of these Terms.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Upon termination, your right to use the service will immediately cease. All provisions of the Terms
                            which by their nature should survive termination shall survive, including ownership provisions,
                            warranty disclaimers, and limitations of liability.
                        </p>
                    </section>

                    {/* Governing Law */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Governing Law</h2>
                        <p className="text-gray-700 leading-relaxed">
                            These Terms shall be governed by and construed in accordance with applicable laws, without regard
                            to conflict of law provisions. Any disputes arising from these Terms or your use of the service
                            shall be resolved in the appropriate courts.
                        </p>
                    </section>

                    {/* Changes to Terms */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Changes to Terms</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We reserve the right to modify or replace these Terms at any time. If a revision is material, we
                            will provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a
                            material change will be determined at our sole discretion. By continuing to access or use our
                            service after revisions become effective, you agree to be bound by the revised terms.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="border-t pt-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you have any questions about these Terms and Conditions, please contact us:
                        </p>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-gray-700">
                                <strong>Email:</strong> legal@recipehub.com<br />
                                <strong>Website:</strong> www.recipehub.com/contact
                            </p>
                        </div>
                    </section>
                </div>

                {/* Back to Settings */}
                <div className="mt-8 text-center">
                    <Link
                        href="/settings"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg"
                    >
                        ← Back to Settings
                    </Link>
                </div>
            </div>
        </div>
    );
}
