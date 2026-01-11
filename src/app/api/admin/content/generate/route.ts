import { NextRequest, NextResponse } from "next/server";
import { ContentGenerator } from "@/lib/content-generator";

// Manual content generation trigger
// POST /api/admin/content/generate
// Body: { type: "kitchen-tip" | "cooking-hack" | "food-trend", category?: string, difficulty?: string, count?: number }

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, category, difficulty, count = 1 } = body;

        // Validate type
        if (!type || !["kitchen-tip", "cooking-hack", "food-trend"].includes(type)) {
            return NextResponse.json(
                { error: "Invalid type. Must be kitchen-tip, cooking-hack, or food-trend" },
                { status: 400 }
            );
        }

        const generator = new ContentGenerator();
        let results: any[] = [];

        // Generate content based on type
        if (type === "kitchen-tip") {
            if (count > 1) {
                const categories = category ? [category] : undefined;
                results = await generator.batchGenerateTips(count, categories);
            } else {
                const result = await generator.generateKitchenTip(category);
                results = [result];
            }
        } else if (type === "cooking-hack") {
            if (count > 1) {
                results = await generator.batchGenerateHacks(count);
            } else {
                const result = await generator.generateCookingHack(difficulty);
                results = [result];
            }
        } else if (type === "food-trend") {
            const result = await generator.generateTrendPost();
            results = [result];
        }

        return NextResponse.json({
            success: true,
            type,
            count: results.length,
            generated: results,
        });
    } catch (error: unknown) {
        console.error("Content generation error:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            { error: "Failed to generate content", details: errorMessage },
            { status: 500 }
        );
    }
}

// GET /api/admin/content/generate
// Get featured content
export async function GET() {
    try {
        const generator = new ContentGenerator();
        const featured = await generator.getFeaturedContent();

        return NextResponse.json({
            featured,
            counts: {
                tips: featured.tips.length,
                hacks: featured.hacks.length,
                trends: featured.trends.length,
            },
        });
    } catch (error: unknown) {
        console.error("Error fetching featured content:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            { error: "Failed to fetch featured content", details: errorMessage },
            { status: 500 }
        );
    }
}
