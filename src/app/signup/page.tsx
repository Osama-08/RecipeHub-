"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import OAuthButton from "@/components/auth/OAuthButton";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!agreedToTerms) {
            setError("Please agree to the Terms of Service and Privacy Policy");
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Something went wrong");
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <AuthLayout imageSrc="/images/auth-signup.png" imageAlt="Healthy chicken and vegetable bowl">
                <div className="text-center space-y-6 animate-fade-in">
                    <div className="flex justify-center">
                        <CheckCircle2 className="w-20 h-20 text-green-500" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email!</h2>
                        <p className="text-gray-600">
                            We&apos;ve sent a verification link to <strong>{email}</strong>
                        </p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-left">
                        <p className="text-sm text-gray-700 mb-2">
                            <strong>Next steps:</strong>
                        </p>
                        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                            <li>Open your email inbox</li>
                            <li>Click the verification link</li>
                            <li>Return here to log in</li>
                        </ol>
                    </div>
                    <Link
                        href="/login"
                        className="inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-200"
                    >
                        Go to Login
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout imageSrc="/images/auth-signup.png" imageAlt="Healthy chicken and vegetable bowl">
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h2>
                    {!showEmailForm && (
                        <p className="text-gray-600">Sign up to save and review your favorite recipes</p>
                    )}
                </div>

                {/* OAuth Buttons or Email Form */}
                {!showEmailForm ? (
                    <div className="space-y-3">
                        <OAuthButton
                            provider="email"
                            text="Sign up with Email"
                            onClick={() => setShowEmailForm(true)}
                        />
                        <OAuthButton provider="google" text="Sign up with Google" />
                    </div>
                ) : (
                    <form onSubmit={handleEmailSignup} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-fade-in">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                                placeholder="Your name"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                                placeholder="At least 8 characters"
                            />
                            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
                        </div>

                        <div className="flex items-start gap-2">
                            <input
                                id="terms"
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                            />
                            <label htmlFor="terms" className="text-sm text-gray-600">
                                By signing up, you agree to the{" "}
                                <Link href="/terms" className="text-orange-600 hover:text-orange-700">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="text-orange-600 hover:text-orange-700">
                                    Privacy Policy
                                </Link>
                                . If you live in the US you will also opt in to CaribbeanRecipe email communication.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowEmailForm(false)}
                            className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            ← Back to signup options
                        </button>
                    </form>
                )}

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                </div>

                {/* Login Link */}
                <div className="text-center">
                    <p className="text-gray-600">
                        Have an account?{" "}
                        <Link href="/login" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
