"use client";

import Image from "next/image";
import { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
    imageSrc: string;
    imageAlt: string;
}

export default function AuthLayout({ children, imageSrc, imageAlt }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex">
            {/* Left Side - Food Image */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-amber-600/20 z-10"></div>
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    className="object-cover animate-fade-in"
                    priority
                />
                <div className="absolute bottom-0 left-0 right-0 p-12 z-20 bg-gradient-to-t from-black/60 to-transparent">
                    <h2 className="text-white text-3xl font-bold mb-2 animate-slide-up">
                        Join Our Food Community
                    </h2>
                    <p className="text-white/90 text-lg animate-slide-up" style={{ animationDelay: "0.2s" }}>
                        Discover delicious recipes, connect with home cooks, and get AI-powered cooking guidance.
                    </p>
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md animate-fade-in" style={{ animationDelay: "0.3s" }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
