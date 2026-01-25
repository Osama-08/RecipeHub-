"use client";

import React from 'react';
import { Shield, Lock, Eye, Database, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl mb-6 shadow-xl">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
                        Privacy Policy
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
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Eye className="w-6 h-6 text-orange-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            Welcome to RecipeHub. We respect your privacy and are committed to protecting your personal data.
                            This privacy policy will inform you about how we look after your personal data when you visit our
                            website and tell you about your privacy rights and how the law protects you.
                        </p>
                    </section>

                    {/* Data We Collect */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Database className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Data We Collect</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="pl-6 border-l-4 border-orange-200">
                                <h3 className="font-semibold text-gray-800 mb-2">Personal Information</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    <li>Name and email address</li>
                                    <li>Profile information and bio</li>
                                    <li>Account credentials (encrypted)</li>
                                </ul>
                            </div>
                            <div className="pl-6 border-l-4 border-blue-200">
                                <h3 className="font-semibold text-gray-800 mb-2">Content Data</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    <li>Recipes you create and share</li>
                                    <li>Comments and community posts</li>
                                    <li>Saved recipes and favorites</li>
                                    <li>Photos and images you upload</li>
                                </ul>
                            </div>
                            <div className="pl-6 border-l-4 border-purple-200">
                                <h3 className="font-semibold text-gray-800 mb-2">Usage Data</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    <li>Pages you visit and features you use</li>
                                    <li>Time spent on the platform</li>
                                    <li>Device and browser information</li>
                                    <li>IP address and location data</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* How We Use Your Data */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">How We Use Your Data</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-3">
                            We use your personal data for the following purposes:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
                            <li>To provide and maintain our service</li>
                            <li>To notify you about changes to our service</li>
                            <li>To provide customer support</li>
                            <li>To gather analysis or valuable information to improve our service</li>
                            <li>To monitor the usage of our service</li>
                            <li>To detect, prevent and address technical issues</li>
                            <li>To provide you with personalized recipe recommendations</li>
                            <li>To send you newsletters and marketing communications (with your consent)</li>
                        </ul>
                    </section>

                    {/* Data Security */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Lock className="w-6 h-6 text-purple-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Data Security</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            The security of your data is important to us. We use industry-standard encryption and security
                            measures to protect your personal information. However, no method of transmission over the Internet
                            or electronic storage is 100% secure, and we cannot guarantee absolute security.
                        </p>
                        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <p className="text-sm text-purple-800">
                                <strong>🔒 Security Measures:</strong> We use SSL/TLS encryption, secure password hashing,
                                regular security audits, and access controls to protect your data.
                            </p>
                        </div>
                    </section>

                    {/* Your Rights */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <Shield className="w-6 h-6 text-amber-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Your Privacy Rights</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-3">
                            You have the following rights regarding your personal data:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-2">Access & Portability</h3>
                                <p className="text-sm text-gray-600">
                                    Request a copy of your personal data in a portable format
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-2">Correction</h3>
                                <p className="text-sm text-gray-600">
                                    Update or correct your personal information
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-2">Deletion</h3>
                                <p className="text-sm text-gray-600">
                                    Request deletion of your account and data
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-2">Opt-Out</h3>
                                <p className="text-sm text-gray-600">
                                    Unsubscribe from marketing communications
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Cookies */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Cookies and Tracking</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We use cookies and similar tracking technologies to track activity on our service and hold certain
                            information. You can instruct your browser to refuse all cookies or to indicate when a cookie is
                            being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
                        </p>
                    </section>

                    {/* Third-Party Services */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Third-Party Services</h2>
                        <p className="text-gray-700 leading-relaxed mb-3">
                            We may employ third-party services for various purposes:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1 pl-4">
                            <li>Authentication providers (Google OAuth)</li>
                            <li>Email service providers</li>
                            <li>Analytics services</li>
                            <li>Cloud storage providers</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-3">
                            These third parties have access to your personal data only to perform tasks on our behalf and are
                            obligated not to disclose or use it for any other purpose.
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Mail className="w-6 h-6 text-orange-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Contact Us</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you have any questions about this Privacy Policy, please contact us:
                        </p>
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <p className="text-gray-700">
                                <strong>Email:</strong> privacy@recipehub.com<br />
                                <strong>Website:</strong> www.recipehub.com/contact
                            </p>
                        </div>
                    </section>

                    {/* Updates */}
                    <section className="border-t pt-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Changes to This Policy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting
                            the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. You are advised to review
                            this Privacy Policy periodically for any changes.
                        </p>
                    </section>
                </div>

                {/* Back to Settings */}
                <div className="mt-8 text-center">
                    <Link
                        href="/settings"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg"
                    >
                        ← Back to Settings
                    </Link>
                </div>
            </div>
        </div>
    );
}
