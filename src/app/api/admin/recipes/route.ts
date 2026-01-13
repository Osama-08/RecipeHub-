import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { generateUniqueSlug } from "@/lib/slug";

// GET all recipes (admin view with pagination)
export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const search = searchParams.get("search") || "";

        const skip = (page - 1) * limit;

        const whereClause = search
            ? {
                OR: [
                    { title: { contains: search, mode: "insensitive" as const } },
                    { description: { contains: search, mode: "insensitive" as const } },
                ],
            }
            : {};

        const [recipes, total] = await Promise.all([
            prisma.recipe.findMany({
                where: whereClause,
                include: {
                    category: true,
                    author: {
                        select: { id: true, name: true },
                    },
                    _count: {
                        select: {
                            ingredients: true,
                            directions: true,
                            reviews: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.recipe.count({ where: whereClause }),
        ]);

        return NextResponse.json({
            recipes,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        const status = message.includes("Unauthorized") ? 401 : message.includes("Forbidden") ? 403 : 500;

        return NextResponse.json({ error: message }, { status });
    }
}

// POST create new recipe
export async function POST(request: NextRequest) {
    try {
        const admin = await requireAdmin();

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

        // Validate required fields
        if (!title || !description || !prepTime || !cookTime || !servings || !imageUrl || !categoryId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Generate unique slug
        const slug = await generateUniqueSlug(title, prisma);

        // Create recipe with all related data
        const recipe = await prisma.recipe.create({
            data: {
                slug,
                title,
                description,
                summary,
                prepTime: parseInt(prepTime),
                cookTime: parseInt(cookTime),
                totalTime: parseInt(prepTime) + parseInt(cookTime),
                servings: parseInt(servings),
                difficulty: difficulty || "Medium",
                imageUrl,
                categoryId,
                authorId: admin.id,
                youtubeId: youtubeId || null,
                videoCreatorName: videoCreatorName || null,
                videoCreatorChannelId: videoCreatorChannelId || null,
                videoType: youtubeId ? "youtube" : null,
                sourceName: "CaribbeanRecipe",
                ingredients: {
                    create: ingredients.map((ing: any, index: number) => ({
                        amount: ing.amount,
                        unit: ing.unit || null,
                        name: ing.name,
                        original: `${ing.amount}${ing.unit ? " " + ing.unit : ""} ${ing.name}`,
                        optional: ing.optional || false,
                        order: index,
                    })),
                },
                directions: {
                    create: directions.map((dir: any) => ({
                        stepNumber: dir.stepNumber,
                        instruction: dir.instruction,
                        imageUrl: dir.imageUrl || null,
                    })),
                },
                ...(nutrition && {
                    nutrition: {
                        create: {
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
                    },
                }),
            },
            include: {
                ingredients: true,
                directions: true,
                nutrition: true,
                category: true,
            },
        });

        return NextResponse.json({ recipe }, { status: 201 });
    } catch (error: unknown) {
        console.error("Recipe creation error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        const status = message.includes("Unauthorized") ? 401 : message.includes("Forbidden") ? 403 : 500;

        return NextResponse.json({ error: message }, { status });
    }
}
