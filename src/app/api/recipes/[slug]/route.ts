import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/recipes/[slug]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const recipe = await prisma.recipe.findUnique({
            where: { slug: slug },
            include: {
                ingredients: {
                    orderBy: { order: "asc" },
                },
                directions: {
                    orderBy: { stepNumber: "asc" },
                },
                nutrition: true,
                category: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                reviews: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                    take: 10,
                },
            },
        });

        if (!recipe) {
            return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
        }

        // Increment view count
        await prisma.recipe.update({
            where: { id: recipe.id },
            data: { views: { increment: 1 } },
        });

        return NextResponse.json({ recipe });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch recipe" },
            { status: 500 }
        );
    }
}
