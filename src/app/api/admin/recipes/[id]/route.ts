import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { generateUniqueSlug } from "@/lib/slug";

// GET single recipe
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        const { id } = await params;

        const recipe = await prisma.recipe.findUnique({
            where: { id },
            include: {
                ingredients: { orderBy: { order: "asc" } },
                directions: { orderBy: { stepNumber: "asc" } },
                nutrition: true,
                category: true,
            },
        });

        if (!recipe) {
            return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
        }

        return NextResponse.json({ recipe });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        const status = message.includes("Unauthorized") ? 401 : message.includes("Forbidden") ? 403 : 500;

        return NextResponse.json({ error: message }, { status });
    }
}

// PUT update recipe
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        const { id } = await params;

        const body = await request.json();
        const {
            title,
            description,
            summary,
            prepTime,
            cookTime,
            servings,
            difficulty,
            imageUrl,
            categoryId,
            youtubeId,
            videoCreatorName,
            videoCreatorChannelId,
            ingredients,
            directions,
            nutrition,
        } = body;

        // Check if recipe exists
        const existingRecipe = await prisma.recipe.findUnique({
            where: { id },
        });

        if (!existingRecipe) {
            return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
        }

        // Generate slug if title changed
        let slug = existingRecipe.slug;
        if (title && title !== existingRecipe.title) {
            slug = await generateUniqueSlug(title, prisma, id);
        }

        // Update recipe (delete old relations and create new ones)
        const recipe = await prisma.recipe.update({
            where: { id },
            data: {
                slug,
                title,
                description,
                summary,
                prepTime: prepTime ? parseInt(prepTime) : undefined,
                cookTime: cookTime ? parseInt(cookTime) : undefined,
                totalTime: prepTime && cookTime ? parseInt(prepTime) + parseInt(cookTime) : undefined,
                servings: servings ? parseInt(servings) : undefined,
                difficulty,
                imageUrl,
                categoryId,
                youtubeId: youtubeId || null,
                videoCreatorName: videoCreatorName || null,
                videoCreatorChannelId: videoCreatorChannelId || null,
                videoType: youtubeId ? "youtube" : null,
                ingredients: ingredients
                    ? {
                        deleteMany: {},
                        create: ingredients.map((ing: any, index: number) => ({
                            amount: ing.amount,
                            unit: ing.unit || null,
                            name: ing.name,
                            original: `${ing.amount}${ing.unit ? " " + ing.unit : ""} ${ing.name}`,
                            optional: ing.optional || false,
                            order: index,
                        })),
                    }
                    : undefined,
                directions: directions
                    ? {
                        deleteMany: {},
                        create: directions.map((dir: any) => ({
                            stepNumber: dir.stepNumber,
                            instruction: dir.instruction,
                            imageUrl: dir.imageUrl || null,
                        })),
                    }
                    : undefined,
            },
            include: {
                ingredients: true,
                directions: true,
                nutrition: true,
                category: true,
            },
        });

        // Update nutrition separately if provided
        if (nutrition) {
            await prisma.nutrition.upsert({
                where: { recipeId: id },
                update: {
                    calories: parseInt(nutrition.calories),
                    protein: parseFloat(nutrition.protein),
                    carbs: parseFloat(nutrition.carbs),
                    fat: parseFloat(nutrition.fat),
                    saturatedFat: nutrition.saturatedFat ? parseFloat(nutrition.saturatedFat) : null,
                    fiber: nutrition.fiber ? parseFloat(nutrition.fiber) : null,
                    sugar: nutrition.sugar ? parseFloat(nutrition.sugar) : null,
                    sodium: nutrition.sodium ? parseInt(nutrition.sodium) : null,
                    cholesterol: nutrition.cholesterol ? parseInt(nutrition.cholesterol) : null,
                },
                create: {
                    recipeId: id,
                    calories: parseInt(nutrition.calories),
                    protein: parseFloat(nutrition.protein),
                    carbs: parseFloat(nutrition.carbs),
                    fat: parseFloat(nutrition.fat),
                    saturatedFat: nutrition.saturatedFat ? parseFloat(nutrition.saturatedFat) : null,
                    fiber: nutrition.fiber ? parseFloat(nutrition.fiber) : null,
                    sugar: nutrition.sugar ? parseFloat(nutrition.sugar) : null,
                    sodium: nutrition.sodium ? parseInt(nutrition.sodium) : null,
                    cholesterol: nutrition.cholesterol ? parseInt(nutrition.cholesterol) : null,
                },
            });
        }

        return NextResponse.json({ recipe });
    } catch (error: unknown) {
        console.error("Recipe update error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        const status = message.includes("Unauthorized") ? 401 : message.includes("Forbidden") ? 403 : 500;

        return NextResponse.json({ error: message }, { status });
    }
}

// DELETE recipe
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        const { id } = await params;

        const recipe = await prisma.recipe.findUnique({
            where: { id },
        });

        if (!recipe) {
            return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
        }
        // Delete recipe (cascade will handle related records)
        await prisma.recipe.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Recipe deleted successfully" });
    } catch (error: unknown) {
        console.error("Recipe deletion error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        const status = message.includes("Unauthorized") ? 401 : message.includes("Forbidden") ? 403 : 500;

        return NextResponse.json({ error: message }, { status });
    }
}
