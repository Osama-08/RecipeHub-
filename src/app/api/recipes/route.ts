import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { searchRecipes } from "@/lib/spoonacular";

// GET /api/recipes - Get all recipes with pagination and filtering
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "12");
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const sort = searchParams.get("sort") || "newest";

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

        // Fix category filtering
        if (category) {
            // Find category by name or slug (case-insensitive)
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

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                {
                    ingredients: {
                        some: {
                            name: { contains: search, mode: "insensitive" }
                        }
                    }
                }
            ];
        }

        // Sorting
        let orderBy: any = { createdAt: "desc" };
        if (sort === "popular") {
            orderBy = { views: "desc" };
        } else if (sort === "quickest") {
            orderBy = { totalTime: "asc" };
        }

        const [recipes, total] = await Promise.all([
            prisma.recipe.findMany({
                where,
                include: {
                    category: true,
                    nutrition: true,
                    _count: { select: { reviews: true } }
                },
                orderBy,
                skip,
                take: limit,
            }),
            prisma.recipe.count({ where }),
        ]);

        // If very few recipes found, supplement with Spoonacular
        if (recipes.length < 6 && (category || search)) {
            try {
                const query = search || category || "";
                console.log(`📡 Fetching recipes for "${query}" from Spoonacular...`);
                const spoonResults = await searchRecipes(query, limit - recipes.length);

                // Add Spoonacular recipes to results
                const enhancedRecipes = [
                    ...recipes,
                    ...spoonResults.results.slice(0, limit - recipes.length).map((r: any) => ({
                        id: `spoon-${r.id}`,
                        slug: r.slug || r.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                        title: r.title,
                        imageUrl: r.image,
                        summary: r.summary || "",
                        averageRating: (r.spoonacularScore / 20) || 0,
                        ratingCount: r.ratingsCount || 0,
                        totalTime: r.readyInMinutes || 0,
                        category: {
                            name: category || (r.dishTypes && r.dishTypes[0]) || "General",
                            slug: (category || (r.dishTypes && r.dishTypes[0]) || "general").toLowerCase()
                        }
                    }))
                ];

                return NextResponse.json({
                    recipes: enhancedRecipes,
                    pagination: {
                        page,
                        limit,
                        total: total + (spoonResults.totalResults || 0),
                        totalPages: Math.ceil((total + (spoonResults.totalResults || 0)) / limit),
                    },
                    source: "mixed"
                });
            } catch (error) {
                console.error("Spoonacular fallback error:", error);
            }
        }

        return NextResponse.json({
            recipes,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            source: "database"
        });
    } catch (error: any) {
        console.error("Recipe fetch error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch recipes" },
            { status: 500 }
        );
    }
}
