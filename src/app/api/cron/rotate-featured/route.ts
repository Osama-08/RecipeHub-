import { NextRequest, NextResponse } from "next/server";
import { ContentGenerator } from "@/lib/content-generator";

// Rotate Featured Content
// GET /api/cron/rotate-featured
// Rotates featured content daily

export async function GET(request: NextRequest) {
    try {
        // Optional: Add auth check for security
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET || "dev-secret-change-in-production";

        if (process.env.NODE_ENV === "production" && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("🔄 Rotating featured content...");

        const generator = new ContentGenerator();
        await generator.rotateFeaturedContent();

        console.log("✅ Featured content rotated successfully!");

        return NextResponse.json({
            success: true,
            message: "Featured content rotated successfully",
            timestamp: new Date().toISOString(),
        });
    } catch (error: unknown) {
        console.error("❌ Featured rotation error:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            {
                success: false,
                error: "Failed to rotate featured content",
                details: errorMessage
            },
            { status: 500 }
        );
    }
}
