import { NextRequest, NextResponse } from "next/server";
import { ContentGenerator } from "@/lib/content-generator";
import { prisma } from "@/lib/db";

// Initialize Content - Auto-populate if empty
// GET /api/admin/init-content
// Generates initial content if database is empty

export async function GET(request: NextRequest) {
    try {
        // Check if we already have content
        const [tipsCount, hacksCount, trendsCount] = await Promise.all([
            prisma.kitchenTip.count(),
            prisma.cookingHack.count(),
            prisma.trendPost.count(),
        ]);

        const totalContent = tipsCount + hacksCount + trendsCount;

        // If we have content, return status
        if (totalContent > 0) {
            return NextResponse.json({
                message: "Content already exists",
                counts: {
                    tips: tipsCount,
                    hacks: hacksCount,
                    trends: trendsCount,
                    total: totalContent,
                },
                initialized: true,
            });
        }

        console.log("🚀 Initializing content - generating initial tips, hacks, and trends...");

        const generator = new ContentGenerator();

        // Generate initial content (3 of each type)
        console.log("Generating kitchen tips...");
        const tips = await generator.batchGenerateTips(3);

        console.log("Generating cooking hacks...");
        const hacks = await generator.batchGenerateHacks(3);

        console.log("Generating food trends...");
        const trends = [];
        for (let i = 0; i < 3; i++) {
            const trend = await generator.generateTrendPost();
            trends.push(trend);
            if (i < 2) await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Mark some as featured
        if (tips.length > 0) {
            await generator.setFeatured("tip", tips[0].id, true);
        }
        if (hacks.length > 0) {
            await generator.setFeatured("hack", hacks[0].id, true);
        }
        if (trends.length > 0) {
            await generator.setFeatured("trend", trends[0].id, true);
        }

        console.log("✅ Content initialization complete!");

        return NextResponse.json({
            success: true,
            message: "Content initialized successfully",
            generated: {
                tips: tips.length,
                hacks: hacks.length,
                trends: trends.length,
                total: tips.length + hacks.length + trends.length,
            },
            items: {
                tips: tips.map(t => ({ id: t.id, title: t.title })),
                hacks: hacks.map(h => ({ id: h.id, title: h.title })),
                trends: trends.map(t => ({ id: t.id, title: t.title })),
            },
        });
    } catch (error: unknown) {
        console.error("❌ Content initialization error:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            {
                success: false,
                error: "Failed to initialize content",
                details: errorMessage
            },
            { status: 500 }
        );
    }
}

// POST - Force regenerate content
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { force = false } = body;

        if (!force) {
            return NextResponse.json({
                error: "Set force: true to regenerate all content",
            }, { status: 400 });
        }

        console.log("🔄 Force regenerating content...");

        const generator = new ContentGenerator();

        // Generate fresh content
        const tips = await generator.batchGenerateTips(3);
        const hacks = await generator.batchGenerateHacks(3);

        const trends = [];
        for (let i = 0; i < 3; i++) {
            const trend = await generator.generateTrendPost();
            trends.push(trend);
            if (i < 2) await new Promise(resolve => setTimeout(resolve, 2000));
        }

        return NextResponse.json({
            success: true,
            message: "Content regenerated",
            generated: {
                tips: tips.length,
                hacks: hacks.length,
                trends: trends.length,
            },
        });
    } catch (error: unknown) {
        console.error("❌ Content regeneration error:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            { error: "Failed to regenerate content", details: errorMessage },
            { status: 500 }
        );
    }
}
