"use client";

import { Play } from "lucide-react";

interface ReplayTourButtonProps {
    onReplay: () => void;
    label?: string;
    variant?: "default" | "compact" | "floating";
    className?: string;
}

export default function ReplayTourButton({
    onReplay,
    label = "Replay Tour",
    variant = "default",
    className = ""
}: ReplayTourButtonProps) {

    if (variant === "floating") {
        return (
            <button
                onClick={onReplay}
                className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 group ${className}`}
                title="Replay Tour"
            >
                <Play className="w-4 h-4 group-hover:animate-pulse" />
                <span className="font-semibold text-sm">Tour</span>
            </button>
        );
    }

    if (variant === "compact") {
        return (
            <button
                onClick={onReplay}
                className={`flex items-center gap-2 px-3 py-2 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors ${className}`}
                title="Replay Tour"
            >
                <Play className="w-4 h-4" />
                <span className="font-medium">{label}</span>
            </button>
        );
    }

    return (
        <button
            onClick={onReplay}
            className={`flex items-center gap-2 px-4 py-2 bg-white border-2 border-orange-500 text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all hover:scale-105 ${className}`}
        >
            <Play className="w-5 h-5" />
            <span>{label}</span>
        </button>
    );
}
