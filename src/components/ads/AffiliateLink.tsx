"use client";

import { ExternalLink } from "lucide-react";
import { useEffect } from "react";

interface AffiliateLinkProps {
    productName: string;
    searchQuery?: string;
    children: React.ReactNode;
    className?: string;
}

export default function AffiliateLink({
    productName,
    searchQuery,
    children,
    className = "",
}: AffiliateLinkProps) {
    const affiliateTag = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || "yoursite-20";
    const query = searchQuery || productName;
    const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${affiliateTag}`;

    const handleClick = () => {
        // Track affiliate link click (you can send to analytics)
        if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("event", "affiliate_click", {
                product_name: productName,
                destination: "amazon",
            });
        }
    };

    return (
        <a
            href={amazonUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={handleClick}
            className={`inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 underline ${className}`}
        >
            {children}
            <ExternalLink className="w-3 h-3" />
        </a>
    );
}

// Ingredient affiliate link component
interface IngredientAffiliateLinkProps {
    ingredient: string;
}

export function IngredientAffiliateLink({ ingredient }: IngredientAffiliateLinkProps) {
    // Only show affiliate links for commonly purchased items
    const commonItems = [
        "olive oil",
        "butter",
        "flour",
        "sugar",
        "salt",
        "pepper",
        "garlic",
        "onion",
        "chicken",
        "beef",
        "pork",
        "fish",
        "cheese",
        "milk",
        "eggs",
        "rice",
        "pasta",
        "beans",
        "tomatoes",
        "spices",
        "vanilla",
        "chocolate",
        "cocoa",
        "baking powder",
        "baking soda",
        "yeast",
    ];

    const ingredientLower = ingredient.toLowerCase();
    const isCommonItem = commonItems.some((item) => ingredientLower.includes(item));

    if (!isCommonItem) {
        return null;
    }

    return (
        <div className="mt-2 text-sm">
            <AffiliateLink productName={ingredient}>
                Buy on Amazon
            </AffiliateLink>
        </div>
    );
}
