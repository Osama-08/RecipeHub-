import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from '@/lib/auth';

// GET saved recipes for current user
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const savedRecipes = await prisma.savedRecipe.findMany({
            where: { userId: user.id },
            include: {
                recipe: {
                    include: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        const recipes = savedRecipes.map((sr) => sr.recipe);

        return NextResponse.json({ recipes });
    } catch (error: unknown) {
        console.error("Error fetching saved recipes:", error);
        const message = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            { error: "Failed to fetch saved recipes", details: message },
            { status: 500 }
        );
    }
}

// POST save a recipe
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const body = await request.json();
        const { recipeId } = body;

        if (!recipeId) {
            return NextResponse.json({ error: "Recipe ID is required" }, { status: 400 });
        }

        // Check if already saved
        const existing = await prisma.savedRecipe.findUnique({
            where: {
                userId_recipeId: {
                    userId: user.id,
                    recipeId,
                },
            },
        });

        if (existing) {
            return NextResponse.json({ message: "Recipe already saved" });
        }

        await prisma.savedRecipe.create({
            data: {
                userId: user.id,
                recipeId,
            },
        });

        return NextResponse.json({ message: "Recipe saved successfully" }, { status: 201 });
    } catch (error: unknown) {
        console.error("Error saving recipe:", error);
        const message = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            { error: "Failed to save recipe", details: message },
            { status: 500 }
        );
    }
}

// DELETE unsave a recipe
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const recipeId = searchParams.get("recipeId");

        if (!recipeId) {
            return NextResponse.json({ error: "Recipe ID is required" }, { status: 400 });
        }

        await prisma.savedRecipe.delete({
            where: {
                userId_recipeId: {
                    userId: user.id,
                    recipeId,
                },
            },
        });

        return NextResponse.json({ message: "Recipe unsaved successfully" });
    } catch (error: unknown) {
        console.error("Error unsaving recipe:", error);
        const message = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            { error: "Failed to unsave recipe", details: message },
            { status: 500 }
        );
    }
}
