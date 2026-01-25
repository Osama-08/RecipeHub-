"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import { Loader2, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to send reset email");
                return;
            }

            setSuccess(true);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout imageSrc="/images/auth-signup.png" imageAlt="Fresh ingredients and recipes">
            <div className="space-y-6">
                {/* Logo */}
                <div className="text-center">
                    <Link href="/">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                            CaribbeanRecipe
                        </h1>
                    </Link>
                </div>

                {/* Title */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                    <p className="text-gray-600">
                        {success
                            ? "Check your email for reset instructions"
                            : "Enter your email to receive a password reset link"}
                    </p>
                </div>

                {/* Success Message */}
                {success ? (
                    <div className="space-y-4">
                        <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg text-center animate-fade-in">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-green-900 mb-2">
                                Email Sent!
                            </h3>
                            <p className="text-green-700 text-sm mb-4">
                                If an account exists with <strong>{email}</strong>, you&apos;ll receive a password reset link shortly.
                            </p>
                            <p className="text-green-600 text-xs">
                                Please check your spam folder if you don&apos;t see it in your inbox.
                            </p>
                        </div>

                        <Link
                            href="/login"
                            className="block w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-200 text-center"
                        >
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    /* Form */
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-fade-in">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sending Reset Link...
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </button>

                        <Link
                            href="/login"
                            className="block text-center py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            ← Back to Login
                        </Link>
                    </form>
                )}
            </div>
        </AuthLayout>
    );
}
