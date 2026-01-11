import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
    getRecipeDetails,
    getRecipeInstructions,
    generateSlug,
    stripHtml,
    getNutrientValue,
    estimatePrepCookTime,
    determineDifficulty,
} from "@/lib/spoonacular";
import { searchYouTubeVideo } from "@/lib/youtube";

// POST /api/recipes/import
// Import a recipe from Spoonacular by ID
export async function POST(request: NextRequest) {
    try {
        const { spoonacularId } = await request.json();

        if (!spoonacularId) {
            return NextResponse.json(
                { error: "Spoonacular ID is required" },
                { status: 400 }
            );
        }

        // Check if recipe already exists
        const existing = await prisma.recipe.findUnique({
            where: { spoonacularId },
        });

        if (existing) {
            return NextResponse.json(
                { success: true, recipe: existing, alreadyExists: true },
                { status: 200 }
            );
        }

        // Fetch recipe details from Spoonacular
        const spoonacularRecipe = await getRecipeDetails(spoonacularId);
        const instructions = await getRecipeInstructions(spoonacularId);

        // Search for YouTube video (disabled - add manually or use Spoonacular videos)
        const youtubeId = null; // await searchYouTubeVideo(spoonacularRecipe.title);

        // Get or create category
        const categoryName = "General"; // You can extract from Spoonacular tags later
        let category = await prisma.category.findUnique({
            where: { slug: "general" },
        });

        if (!category) {
            category = await prisma.category.create({
                data: {
                    name: categoryName,
                    slug: "general",
                },
            });
        }

        // Extract nutrition data
        const nutrients = spoonacularRecipe.nutrition?.nutrients || [];
        const calories = Math.round(getNutrientValue(nutrients, "Calories") || 0);
        const protein = getNutrientValue(nutrients, "Protein") || 0;
        const carbs = getNutrientValue(nutrients, "Carbohydrates") || 0;
        const fat = getNutrientValue(nutrients, "Fat") || 0;
        const fiber = getNutrientValue(nutrients, "Fiber");
        const sugar = getNutrientValue(nutrients, "Sugar");
        const sodium = getNutrientValue(nutrients, "Sodium");

        // Estimate prep and cook time
        const { prep, cook } = estimatePrepCookTime(
            spoonacularRecipe.readyInMinutes
        );

        // Determine difficulty
        const difficulty = determineDifficulty(
            spoonacularRecipe.readyInMinutes,
            spoonacularRecipe.extendedIngredients?.length || 0
        );

        // Create recipe with all related data
        const recipe = await prisma.recipe.create({
            data: {
                spoonacularId,
                slug: generateSlug(spoonacularRecipe.title),
                title: spoonacularRecipe.title,
                description: stripHtml(spoonacularRecipe.summary || ""),
                summary: stripHtml(
                    spoonacularRecipe.summary?.substring(0, 200) + "..." || ""
                ),
                prepTime: prep,
                cookTime: cook,
                totalTime: spoonacularRecipe.readyInMinutes,
                servings: spoonacularRecipe.servings,
                difficulty,
                imageUrl: spoonacularRecipe.image,
                youtubeId,
                videoType: youtubeId ? "youtube" : null,
                sourceUrl: spoonacularRecipe.sourceUrl,
                sourceName: "Spoonacular",
                categoryId: category.id,

                // Create ingredients
                ingredients: {
                    create:
                        spoonacularRecipe.extendedIngredients?.map((ing, index) => {
                            const ingNutrients = ing.nutrition?.nutrients || [];
                            return {
                                amount: ing.amount.toString(),
                                unit: ing.unit || null,
                                name: ing.name,
                                original: ing.original,
                                order: index,
                                calories: getNutrientValue(ingNutrients, "Calories"),
                                protein: getNutrientValue(ingNutrients, "Protein"),
                                carbs: getNutrientValue(ingNutrients, "Carbohydrates"),
                                fat: getNutrientValue(ingNutrients, "Fat"),
                            };
                        }) || [],
                },

                // Create directions
                directions: {
                    create:
                        instructions[0]?.steps?.map((step: any) => ({
                            stepNumber: step.number,
                            instruction: step.step,
                            imageUrl: step.image || null,
                        })) || [],
                },

                // Create nutrition
                nutrition: {
                    create: {
                        calories,
                        protein,
                        carbs,
                        fat,
                        fiber,
                        sugar,
                        sodium: sodium ? Math.round(sodium) : null,
                    },
                },
            },
            include: {
                ingredients: true,
                directions: true,
                nutrition: true,
                category: true,
            },
        });

        return NextResponse.json({ success: true, recipe }, { status: 201 });
    } catch (error: any) {
        console.error("Recipe import error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to import recipe" },
            { status: 500 }
        );
    }
}
