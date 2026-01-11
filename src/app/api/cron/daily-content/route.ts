import { NextRequest, NextResponse } from "next/server";
import { ContentGenerator } from "@/lib/content-generator";
import { prisma } from "@/lib/db";

// Auto Content Generation Cron Job
// GET /api/cron/daily-content
// Generates 1 tip, 1 hack, 1 trend daily

export async function GET(request: NextRequest) {
    try {
        // Optional: Add auth check for security
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET || "dev-secret-change-in-production";

        // In production, verify this is a legitimate cron call
        if (process.env.NODE_ENV === "production" && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const generator = new ContentGenerator();

        console.log("🤖 Starting automated daily content generation...");

        // Generate daily content package
        const results = await generator.generateDailyContent();

        console.log("✅ Daily content generated successfully!");

        return NextResponse.json({
            success: true,
            message: "Daily content generated successfully",
            generated: {
                tip: {
                    id: results.tip.id,
                    title: results.tip.title,
                },
                hack: {
                    id: results.hack.id,
                    title: results.hack.title,
                },
                trend: {
                    id: results.trend.id,
                    title: results.trend.title,
                },
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error: unknown) {
        console.error("❌ Daily content generation error:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            {
                success: false,
                error: "Failed to generate daily content",
                details: errorMessage
            },
            { status: 500 }
        );
    }
}
