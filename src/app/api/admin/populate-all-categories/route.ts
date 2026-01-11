import { NextRequest, NextResponse } from "next/server";

// Bulk Populate All Categories
// POST /api/admin/populate-all-categories
// Populates all main categories with recipes from Spoonacular

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { recipesPerCategory = 10 } = body;

        console.log(`🚀 Starting bulk category population...`);

        const categories = [
            { name: "dinner", query: "dinner main course" },
            { name: "breakfast", query: "breakfast" },
            { name: "lunch", query: "lunch" },
            { name: "dessert", query: "dessert" },
            { name: "snack", query: "snack appetizer" },
        ];

        const results: any[] = [];
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

        for (const category of categories) {
            console.log(`\n📦 Populating ${category.name}...`);

            try {
                const response = await fetch(`${baseUrl}/api/admin/populate-categories`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        category: category.name,
                        count: recipesPerCategory
                    })
                });

                const data = await response.json();

                results.push({
                    category: category.name,
                    success: response.ok,
                    imported: data.imported || 0,
                    skipped: data.skipped || 0,
                    error: data.error
                });

                console.log(`✅ ${category.name}: ${data.imported} imported, ${data.skipped} skipped`);

                // Wait 2 seconds between categories to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (error) {
                console.error(`❌ Failed to populate ${category.name}:`, error);
                results.push({
                    category: category.name,
                    success: false,
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        }

        const totalImported = results.reduce((sum, r) => sum + (r.imported || 0), 0);
        const totalSkipped = results.reduce((sum, r) => sum + (r.skipped || 0), 0);

        return NextResponse.json({
            success: true,
            message: `Bulk population complete!`,
            totalImported,
            totalSkipped,
            categories: results
        });

    } catch (error: unknown) {
        console.error("❌ Bulk population error:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json({
            error: "Failed to populate categories",
            details: errorMessage
        }, { status: 500 });
    }
}
