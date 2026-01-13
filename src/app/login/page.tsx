"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import OAuthButton from "@/components/auth/OAuthButton";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout imageSrc="/images/auth-login.png" imageAlt="Delicious sausage and rice bowl">
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Log in</h2>
                    {!showEmailForm && (
                        <p className="text-gray-600">Welcome back! Choose a login method</p>
                    )}
                </div>

                {/* OAuth Buttons or Email Form */}
                {!showEmailForm ? (
                    <div className="space-y-3">
                        <OAuthButton
                            provider="email"
                            text="Log in with Email"
                            onClick={() => setShowEmailForm(true)}
                        />
                        <OAuthButton provider="google" text="Log in with Google" />
                    </div>
                ) : (
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-fade-in">
                                {error}
                            </div>
                        )}

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
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                "Log In"
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowEmailForm(false)}
                            className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            ← Back to login options
                        </button>
                    </form>
                )}

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                    <p className="text-gray-600">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                            Join now
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
