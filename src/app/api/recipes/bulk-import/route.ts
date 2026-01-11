import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
    getRandomRecipes,
    generateSlug,
    stripHtml,
    getNutrientValue,
    estimatePrepCookTime,
    determineDifficulty,
    getRecipeInstructions,
} from "@/lib/spoonacular";

// POST /api/recipes/bulk-import
// Bulk import recipes from Spoonacular by tags/cuisine
export async function POST(request: NextRequest) {
    try {
        const { tags, count = 10 } = await request.json();

        if (!tags) {
            return NextResponse.json(
                { error: "Tags parameter is required" },
                { status: 400 }
            );
        }

        console.log(`Importing ${count} recipes with tags: ${tags}`);

        // Fetch random recipes from Spoonacular with specified tags
        const { recipes: spoonacularRecipes } = await getRandomRecipes(count, tags);

        const importedRecipes = [];
        const errors = [];

        for (const spoonacularRecipe of spoonacularRecipes) {
            try {
                // Check if recipe already exists
                const existing = await prisma.recipe.findUnique({
                    where: { spoonacularId: spoonacularRecipe.id },
                });

                if (existing) {
                    console.log(`Recipe ${spoonacularRecipe.title} already exists, skipping...`);
                    continue;
                }

                // Get detailed instructions
                const instructions = await getRecipeInstructions(spoonacularRecipe.id);

                // Determine category from tags
                let categoryName = "General";
                const recipeTags = tags.toLowerCase();

                if (recipeTags.includes("breakfast")) categoryName = "Breakfast";
                else if (recipeTags.includes("lunch")) categoryName = "Lunch";
                else if (recipeTags.includes("dinner") || recipeTags.includes("main")) categoryName = "Dinner";
                else if (recipeTags.includes("dessert")) categoryName = "Desserts";
                else if (recipeTags.includes("appetizer")) categoryName = "Appetizers";
                else if (recipeTags.includes("snack")) categoryName = "Snacks";
                else if (recipeTags.includes("italian")) categoryName = "Italian";
                else if (recipeTags.includes("mexican")) categoryName = "Mexican";
                else if (recipeTags.includes("asian") || recipeTags.includes("chinese") || recipeTags.includes("japanese") || recipeTags.includes("thai")) categoryName = "Asian";
                else if (recipeTags.includes("mediterranean")) categoryName = "Mediterranean";
                else if (recipeTags.includes("american")) categoryName = "American";
                else if (recipeTags.includes("indian")) categoryName = "Indian";

                // Get or create category
                let category = await prisma.category.findUnique({
                    where: { slug: generateSlug(categoryName) },
                });

                if (!category) {
                    category = await prisma.category.create({
                        data: {
                            name: categoryName,
                            slug: generateSlug(categoryName),
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
                const { prep, cook } = estimatePrepCookTime(spoonacularRecipe.readyInMinutes);

                // Determine difficulty
                const difficulty = determineDifficulty(
                    spoonacularRecipe.readyInMinutes,
                    spoonacularRecipe.extendedIngredients?.length || 0
                );

                // Create recipe
                const recipe = await prisma.recipe.create({
                    data: {
                        spoonacularId: spoonacularRecipe.id,
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
                        youtubeId: null, // No YouTube for bulk imports
                        videoType: null,
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
                        nutrition: calories > 0 ? {
                            create: {
                                calories,
                                protein,
                                carbs,
                                fat,
                                fiber,
                                sugar,
                                sodium: sodium ? Math.round(sodium) : null,
                            },
                        } : undefined,
                    },
                });

                importedRecipes.push({
                    id: recipe.id,
                    title: recipe.title,
                    category: categoryName,
                });

                console.log(`✓ Imported: ${recipe.title} (${categoryName})`);
            } catch (error: any) {
                console.error(`✗ Failed to import ${spoonacularRecipe.title}:`, error.message);
                errors.push({
                    title: spoonacularRecipe.title,
                    error: error.message,
                });
            }
        }

        return NextResponse.json(
            {
                success: true,
                imported: importedRecipes.length,
                recipes: importedRecipes,
                errors: errors.length > 0 ? errors : undefined,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Bulk import error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to bulk import recipes" },
            { status: 500 }
        );
    }
}
