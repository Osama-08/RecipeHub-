import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/e-store/categories - Get all unique categories and their counts
export async function GET(request: NextRequest) {
    try {
        const documents = await prisma.cookingDocument.groupBy({
            by: ["category"],
            _count: {
                category: true,
            },
            orderBy: {
                category: "asc",
            },
        });

        const categories = documents.map((doc) => ({
            name: doc.category,
            count: doc._count.category,
        }));

        return NextResponse.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}
