import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET all categories (public endpoint)
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: "asc" },
            select: {
                id: true,
                name: true,
                slug: true,
            },
        });

        return NextResponse.json({ categories });
    } catch (error: unknown) {
        console.error("Error fetching categories:", error);
        const message = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            { error: "Failed to fetch categories", details: message },
            { status: 500 }
        );
    }
}
