"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

interface AdSenseProps {
    slot: string;
    format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
    responsive?: boolean;
    className?: string;
}

export default function AdSense({
    slot,
    format = "auto",
    responsive = true,
    className = "",
}: AdSenseProps) {
    useEffect(() => {
        if (typeof window === "undefined") return;

        const timer = setTimeout(() => {
            try {
                // Only push if there's an unprocessed ad element for this slot
                const insElements = document.querySelectorAll(`ins.adsbygoogle[data-ad-slot="${slot}"]`);
                const unprocessedElements = Array.from(insElements).filter(
                    el => !el.getAttribute('data-adsbygoogle-status')
                );

                if (unprocessedElements.length > 0) {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                }
            } catch (e) {
                // Silently handle AdSense errors to avoid console noise for users
                if (process.env.NODE_ENV === 'development') {
                    console.warn("AdSense push issue:", e);
                }
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [slot]); // Re-run if slot changes

    const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

    if (!clientId || !slot) {
        // Don't render ads if AdSense is not configured OR slot is missing
        return null;
    }

    return (
        <div className={`adsense-container w-full max-w-7xl mx-auto overflow-hidden my-4 ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client={clientId}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? "true" : "false"}
            />
        </div>
    );
}

// Pre-configured ad components for common placements

export function HeroAd() {
    return (
        <div className="container mx-auto px-4 py-8">
            <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest mb-2 font-medium">Advertisement</p>
            <AdSense
                slot={process.env.NEXT_PUBLIC_ADSENSE_HOME_HERO_SLOT || ""}
                format="horizontal"
            />
        </div>
    );
}

export function MiddleAd() {
    return (
        <div className="container mx-auto px-4 py-8">
            <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest mb-2 font-medium">Sponsored Content</p>
            <AdSense
                slot={process.env.NEXT_PUBLIC_ADSENSE_HOME_MID_SLOT || ""}
                format="auto"
            />
        </div>
    );
}

export function InRecipeAd() {
    return (
        <div className="my-12">
            <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest mb-2 font-medium">Advertisement</p>
            <AdSense
                slot={process.env.NEXT_PUBLIC_ADSENSE_IN_RECIPE_SLOT || ""}
                format="fluid"
                responsive={true}
            />
        </div>
    );
}
