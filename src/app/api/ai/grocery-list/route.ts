import { NextRequest, NextResponse } from "next/server";
import { OpenRouterProvider } from "@/lib/openrouter-provider";
import { prisma } from "@/lib/db";

// Generate Grocery List
// POST /api/ai/grocery-list
// Body: { recipeIds: string[] }

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { recipeIds } = body;

        if (!recipeIds || !Array.isArray(recipeIds) || recipeIds.length === 0) {
            return NextResponse.json(
                { error: "recipeIds array is required" },
                { status: 400 }
            );
        }

        // Fetch recipes from database
        const recipes = await prisma.recipe.findMany({
            where: { id: { in: recipeIds } },
            include: { ingredients: { orderBy: { order: "asc" } } },
        });

        if (recipes.length === 0) {
            return NextResponse.json(
                { error: "No recipes found with provided IDs" },
                { status: 404 }
            );
        }

        // Generate grocery list using AI
        const openRouter = new OpenRouterProvider();
        const groceryData = await openRouter.generateGroceryList(
            recipes.map((r) => ({
                title: r.title,
                ingredients: r.ingredients.map((ing) => ({
                    amount: ing.amount,
                    unit: ing.unit || undefined,
                    name: ing.name,
                })),
            }))
        );

        //Format for display
        let formattedList = "";
        Object.entries(groceryData.byCategory).forEach(([category, items]: [string, any]) => {
            formattedList += `**${category.toUpperCase()}**\n`;
            items.forEach((item: any) => {
                formattedList += `- ${item.amount} ${item.item}\n`;
            });
            formattedList += `\n`;
        });

        return NextResponse.json({
            recipes: recipes.map((r) => ({ id: r.id, title: r.title })),
            groceryList: groceryData,
            formattedList,
            totalItems: groceryData.totalItems,
        });
    } catch (error: unknown) {
        console.error("Grocery list generation error:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            { error: "Failed to generate grocery list", details: errorMessage },
            { status: 500 }
        );
    }
}
