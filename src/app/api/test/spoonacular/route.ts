import { NextRequest, NextResponse } from "next/server";
import { searchRecipes, getRecipeDetails } from "@/lib/spoonacular";

// Test Spoonacular API Connection
// GET /api/test/spoonacular?query=pasta

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("query") || "pasta";

        console.log(`🧪 Testing Spoonacular API with query: "${query}"`);

        // Check if API key exists
        const apiKey = process.env.SPOONACULAR_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                success: false,
                error: "SPOONACULAR_API_KEY not found in environment variables",
                hint: "Add SPOONACULAR_API_KEY to your .env file",
            }, { status: 500 });
        }

        console.log(`✅ API Key found: ${apiKey.substring(0, 8)}...`);

        // Try to fetch recipes
        const results = await searchRecipes(query, 5);

        console.log(`✅ Spoonacular returned ${results.totalResults} total results`);
        console.log(`✅ Retrieved ${results.results.length} recipes`);

        return NextResponse.json({
            success: true,
            query,
            totalResults: results.totalResults,
            recipesReturned: results.results.length,
            recipes: results.results.map((r: any) => ({
                id: r.id,
                title: r.title,
                image: r.image,
                readyInMinutes: r.readyInMinutes,
            })),
            message: "Spoonacular API is working correctly! ✅",
        });
    } catch (error: unknown) {
        console.error("❌ Spoonacular test failed:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json({
            success: false,
            error: "Spoonacular API test failed",
            details: errorMessage,
            possibleCauses: [
                "Invalid API key",
                "API key quota exceeded",
                "Network error",
                "Spoonacular service down",
            ],
        }, { status: 500 });
    }
}
