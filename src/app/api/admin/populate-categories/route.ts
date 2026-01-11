import { NextRequest, NextResponse } from "next/server";
import { searchRecipes, getRecipeDetails, getNutrientValue, stripHtml } from "@/lib/spoonacular";
import { prisma } from "@/lib/db";
import { generateSlug } from "@/lib/slug";

// Populate Categories with Spoonacular Recipes
// POST /api/admin/populate-categories
// Body: { category: "dinner" | "breakfast" | "lunch" | "dessert", count: 10 }

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { category = "dinner", count = 10 } = body;

        console.log(`🔄 Populating ${category} category with ${count} recipes from Spoonacular...`);

        // Map category to Spoonacular search queries
        const categoryQueries: Record<string, string> = {
            dinner: "dinner main course",
            breakfast: "breakfast",
            lunch: "lunch",
            dessert: "dessert",
            snack: "snack appetizer",
        };

        const query = categoryQueries[category] || category;

        // Fetch from Spoonacular
        const results = await searchRecipes(query, count);

        if (!results.results || results.results.length === 0) {
            return NextResponse.json({
                success: false,
                message: `No recipes found for category: ${category}`,
            }, { status: 404 });
        }

        console.log(`✅ Found ${results.results.length} recipes from Spoonacular`);

        // Find or create category in database
        let dbCategory = await prisma.category.findFirst({
            where: { name: { equals: category, mode: "insensitive" } },
        });

        if (!dbCategory) {
            dbCategory = await prisma.category.create({
                data: {
                    name: category.charAt(0).toUpperCase() + category.slice(1),
                    slug: category.toLowerCase(),
                },
            });
            console.log(`✅ Created new category: ${dbCategory.name}`);
        }

        // Import recipes
        const imported = [];
        const skipped = [];

        for (const spoonRecipe of results.results) {
            try {
                // Check if already exists
                const existing = await prisma.recipe.findFirst({
                    where: { spoonacularId: spoonRecipe.id },
                });

                if (existing) {
                    skipped.push({ id: spoonRecipe.id, title: spoonRecipe.title, reason: "Already exists" });
                    continue;
                }

                // **FETCH FULL RECIPE DETAILS** - This guarantees we get all directions!
                console.log(`📡 Fetching full details for: ${spoonRecipe.title}...`);
                const fullRecipe = await getRecipeDetails(spoonRecipe.id);

                // Search for YouTube video
                let youtubeVideoId = null;
                try {
                    const { searchYouTubeVideo } = await import("@/lib/youtube");
                    const videoId = await searchYouTubeVideo(fullRecipe.title);
                    if (videoId) {
                        youtubeVideoId = videoId; // Store just the video ID
                        console.log(`🎥 Found YouTube video: ${videoId}`);
                    }
                } catch (error) {
                    console.log(`⚠️ YouTube search skipped (API not configured or error)`);
                }

                // Generate slug
                const slug = generateSlug(fullRecipe.title);

                // Check slug uniqueness
                const slugExists = await prisma.recipe.findUnique({ where: { slug } });
                if (slugExists) {
                    skipped.push({ id: fullRecipe.id, title: fullRecipe.title, reason: "Slug conflict" });
                    continue;
                }

                // Create recipe with full data
                const recipe = await prisma.recipe.create({
                    data: {
                        spoonacularId: fullRecipe.id,
                        title: fullRecipe.title,
                        slug,
                        description: fullRecipe.summary ? stripHtml(fullRecipe.summary) : fullRecipe.title,
                        summary: fullRecipe.summary ? stripHtml(fullRecipe.summary).substring(0, 200) : undefined,
                        imageUrl: fullRecipe.image || "",
                        prepTime: Math.round((fullRecipe.readyInMinutes || 30) * 0.3),
                        cookTime: Math.round((fullRecipe.readyInMinutes || 30) * 0.7),
                        totalTime: fullRecipe.readyInMinutes || 30,
                        servings: fullRecipe.servings || 4,
                        difficulty: fullRecipe.readyInMinutes <= 30 ? "Easy" : fullRecipe.readyInMinutes <= 60 ? "Medium" : "Hard",
                        categoryId: dbCategory.id,
                        sourceUrl: fullRecipe.sourceUrl,
                        sourceName: "Spoonacular",
                        youtubeId: youtubeVideoId, // Add YouTube video ID
                    },
                });

                // Add ingredients from FULL recipe data
                if (fullRecipe.extendedIngredients && fullRecipe.extendedIngredients.length > 0) {
                    await Promise.all(
                        fullRecipe.extendedIngredients.slice(0, 20).map((ing: any, index: number) =>
                            prisma.ingredient.create({
                                data: {
                                    recipeId: recipe.id,
                                    amount: String(ing.amount || ""),
                                    unit: ing.unit || undefined,
                                    name: ing.name || ing.original,
                                    original: ing.original,
                                    order: index + 1,
                                },
                            })
                        )
                    );
                }

                // Add directions from FULL recipe data - GUARANTEED to have all steps!
                if (fullRecipe.analyzedInstructions && fullRecipe.analyzedInstructions[0]?.steps) {
                    await Promise.all(
                        fullRecipe.analyzedInstructions[0].steps.map((step: any) =>
                            prisma.direction.create({
                                data: {
                                    recipeId: recipe.id,
                                    stepNumber: step.number,
                                    instruction: step.step,
                                    imageUrl: step.image,
                                },
                            })
                        )
                    );
                    console.log(`✅ Added ${fullRecipe.analyzedInstructions[0].steps.length} direction steps from Spoonacular`);
                } else {
                    // **AI FALLBACK**: Generate directions if Spoonacular doesn't have them!
                    console.log(`🤖 No Spoonacular directions found, generating with AI...`);
                    try {
                        // Fetch ingredients for better AI generation
                        const ingredients = await prisma.ingredient.findMany({
                            where: { recipeId: recipe.id },
                        });

                        // Call AI generation endpoint
                        const aiResponse = await fetch(`http://localhost:3000/api/ai/generate-directions`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                recipeId: recipe.id,
                                title: fullRecipe.title,
                                ingredients: ingredients.map(i => ({
                                    amount: i.amount,
                                    unit: i.unit,
                                    name: i.name,
                                })),
                                servings: fullRecipe.servings,
                            }),
                        });

                        if (aiResponse.ok) {
                            const aiData = await aiResponse.json();
                            console.log(`✅ Generated ${aiData.count} AI directions`);
                        } else {
                            console.warn(`⚠️ AI direction generation failed`);
                        }
                    } catch (aiError) {
                        console.error(`❌ AI direction generation error:`, aiError);
                    }
                }

                // Add nutrition from FULL recipe data
                if (fullRecipe.nutrition?.nutrients) {
                    const nutrients = fullRecipe.nutrition.nutrients;
                    const calories = getNutrientValue(nutrients, "Calories") || 0;
                    const protein = getNutrientValue(nutrients, "Protein") || 0;
                    const carbs = getNutrientValue(nutrients, "Carbohydrates") || 0;
                    const fat = getNutrientValue(nutrients, "Fat") || 0;

                    if (calories > 0) {
                        await prisma.nutrition.create({
                            data: {
                                recipeId: recipe.id,
                                calories: Math.round(calories),
                                protein,
                                carbs,
                                fat,
                            },
                        });
                    }
                }

                imported.push({ id: recipe.id, title: recipe.title });
                console.log(`✅ Imported with full details: ${recipe.title}`);

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (error) {
                console.error(`❌ Failed to import ${spoonRecipe.title}:`, error);
                skipped.push({
                    id: spoonRecipe.id,
                    title: spoonRecipe.title,
                    reason: error instanceof Error ? error.message : "Unknown error"
                });
            }
        }

        return NextResponse.json({
            success: true,
            category: dbCategory.name,
            imported: imported.length,
            skipped: skipped.length,
            details: {
                imported,
                skipped,
            },
        });

    } catch (error: unknown) {
        console.error("❌ Category population error:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json({
            error: "Failed to populate category",
            details: errorMessage,
        }, { status: 500 });
    }
}
