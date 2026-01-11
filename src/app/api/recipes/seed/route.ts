import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/recipes/seed
// Seed the database with sample recipes from Spoonacular
export async function GET(request: NextRequest) {
    try {
        // Sample popular recipe IDs from Spoonacular (all guaranteed to exist)
        const sampleRecipeIds = [
            654812, // Healing Cabbage Soup
            663050, // Spaghetti Carbonara
            715538, // Homemade Garlic Parmesan Bagels
            642129, // Easy Homemade Rice and Beans
            633942, // Avocado Pesto Pasta
            654959, // Pasta With Tuna
            649931, // Lentil & Chickpea Burgers
            716429, // Pasta Salad
            640803, // Creamy Tomato Soup
            715495, // Turkey Tomato Cheese Pizza
        ];

        const imported = [];
        const errors = [];

        for (const id of sampleRecipeIds) {
            try {
                // Call the import API
                const response = await fetch(
                    `${request.nextUrl.origin}/api/recipes/import`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ spoonacularId: id }),
                    }
                );

                const data = await response.json();
                if (data.success) {
                    imported.push(data.recipe.title);
                } else {
                    errors.push({ id, error: data.error });
                }

                // Respect API rate limits (150 per day for free tier)
                await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second between requests
            } catch (error: any) {
                errors.push({ id, error: error.message });
            }
        }

        return NextResponse.json({
            success: true,
            imported: imported.length,
            recipes: imported,
            errors,
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to seed recipes" },
            { status: 500 }
        );
    }
}
