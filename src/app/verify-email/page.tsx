"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link");
            return;
        }

        // Verify the email
        fetch('/api/auth/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setStatus("success");
                    setMessage(data.message);
                } else {
                    setStatus("error");
                    setMessage(data.error || "Verification failed");
                }
            })
            .catch(() => {
                setStatus("error");
                setMessage("Something went wrong. Please try again.");
            });
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6 animate-fade-in">
                {/* Logo */}
                <Link href="/">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                        CaribbeanRecipe
                    </h1>
                </Link>

                {/* Status Icon */}
                <div className="flex justify-center">
                    {status === "loading" && <Loader2 className="w-20 h-20 text-orange-500 animate-spin" />}
                    {status === "success" && <CheckCircle2 className="w-20 h-20 text-green-500" />}
                    {status === "error" && <XCircle className="w-20 h-20 text-red-500" />}
                </div>

                {/* Message */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {status === "loading" && "Verifying Your Email..."}
                        {status === "success" && "Email Verified!"}
                        {status === "error" && "Verification Failed"}
                    </h2>
                    <p className="text-gray-600">{message}</p>
                </div>

                {/* Action Button */}
                {status !== "loading" && (
                    <div className="pt-4">
                        {status === "success" ? (
                            <Link
                                href="/login"
                                className="inline-block w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-200"
                            >
                                Continue to Login
                            </Link>
                        ) : (
                            <div className="space-y-3">
                                <Link
                                    href="/signup"
                                    className="inline-block w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-200"
                                >
                                    Try Signing Up Again
                                </Link>
                                <Link
                                    href="/"
                                    className="inline-block w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Back to Home
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
                    <Link href="/">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                            CaribbeanRecipe
                        </h1>
                    </Link>
                    <Loader2 className="w-20 h-20 text-orange-500 animate-spin mx-auto" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Email...</h2>
                    <p className="text-gray-600">Please wait...</p>
                </div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
