import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/tips - Get all kitchen tips
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "20");
        const featured = searchParams.get("featured") === "true";

        const where: any = {};
        if (featured) {
            where.featured = true;
        }

        const tips = await prisma.kitchenTip.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: limit,
        });

        return NextResponse.json({
            success: true,
            tips,
            total: tips.length,
        });
    } catch (error: unknown) {
        console.error("Failed to fetch tips:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            { error: "Failed to fetch tips", details: errorMessage },
            { status: 500 }
        );
    }
}
