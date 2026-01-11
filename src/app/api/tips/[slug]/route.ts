import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET tip by slug
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const tip = await prisma.tip.findUnique({
            where: { slug: slug },
        });

        if (!tip) {
            return NextResponse.json({ error: "Tip not found" }, { status: 404 });
        }

        // Increment view count
        await prisma.tip.update({
            where: { id: tip.id },
            data: { views: { increment: 1 } },
        });

        return NextResponse.json({ tip });
    } catch (error: unknown) {
        console.error("Error fetching tip:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Failed to fetch tip", details: message },
            { status: 500 }
        );
    }
}
