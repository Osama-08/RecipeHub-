import { NextRequest, NextResponse } from "next/server";
import { searchRecipes } from "@/lib/spoonacular";
import { prisma } from "@/lib/db";

// Dynamic Recipe Fetching by Category/Occasion/Cuisine
// GET /api/recipes/filter?category=dinner&cuisine=italian&occasion=quick

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const category = searchParams.get("category");
        const cuisine = searchParams.get("cuisine");
        const occasion = searchParams.get("occasion");
        const limit = parseInt(searchParams.get("limit") || "12");
        const page = parseInt(searchParams.get("page") || "1");

        console.log(`🔍 Filtering recipes:`, { category, cuisine, occasion, limit, page });

        // Build database query
        const where: any = {};

        if (category) {
            const categoryRecord = await prisma.category.findFirst({
                where: {
                    OR: [
                        { name: { equals: category, mode: "insensitive" } },
                        { slug: { equals: category, mode: "insensitive" } }
                    ]
                }
            });
            if (categoryRecord) {
                where.categoryId = categoryRecord.id;
            }
        }

        if (cuisine) {
            where.cuisine = { equals: cuisine, mode: "insensitive" };
        }

        if (occasion) {
            where.occasion = { equals: occasion, mode: "insensitive" };
        }

        // Fetch from database
        const [dbRecipes, totalDb] = await Promise.all([
            prisma.recipe.findMany({
                where,
                include: {
                    category: true,
                    nutrition: true,
                    _count: { select: { reviews: true } }
                },
                take: limit,
                skip: (page - 1) * limit,
                orderBy: { createdAt: "desc" }
            }),
            prisma.recipe.count({ where })
        ]);

        // If we have enough from database, return them
        if (dbRecipes.length >= limit / 2) {
            return NextResponse.json({
                success: true,
                recipes: dbRecipes,
                total: totalDb,
                page,
                limit,
                source: "database",
                filters: { category, cuisine, occasion }
            });
        }

        // Otherwise, supplement with Spoonacular
        let spoonacularRecipes: any[] = [];

        if (category || cuisine) {
            try {
                const query = [category, cuisine].filter(Boolean).join(" ");
                const spoonResults = await searchRecipes(query, limit - dbRecipes.length);
                spoonacularRecipes = spoonResults.results;
            } catch (error) {
                console.error("Spoonacular fetch error:", error);
            }
        }

        // Merge results
        const allRecipes = [...dbRecipes, ...spoonacularRecipes];

        return NextResponse.json({
            success: true,
            recipes: allRecipes,
            total: totalDb + spoonacularRecipes.length,
            page,
            limit,
            source: dbRecipes.length > 0 ? "mixed" : "spoonacular",
            filters: { category, cuisine, occasion },
            breakdown: {
                database: dbRecipes.length,
                spoonacular: spoonacularRecipes.length
            }
        });

    } catch (error: unknown) {
        console.error("Recipe filter error:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json({
            error: "Failed to filter recipes",
            details: errorMessage
        }, { status: 500 });
    }
}
