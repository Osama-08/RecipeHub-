import { NextRequest, NextResponse } from "next/server";
import { OpenRouterProvider } from "@/lib/openrouter-provider";
import { prisma } from "@/lib/db";

// POST /api/ai/generate-directions
// Generate cooking directions for a recipe using AI
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { recipeId, title, ingredients, servings } = body;

        if (!title) {
            return NextResponse.json(
                { error: "Recipe title is required" },
                { status: 400 }
            );
        }

        console.log(`🤖 Generating AI directions for: ${title}`);

        const openRouter = new OpenRouterProvider();

        // Build ingredients text
        const ingredientsText = ingredients?.length
            ? ingredients.map((ing: any) => `- ${ing.amount} ${ing.unit || ''} ${ing.name}`.trim()).join('\n')
            : "Standard ingredients for this recipe";

        // Create detailed prompt for recipe directions
        const prompt = `You are a professional chef writing clear, detailed cooking instructions.

Recipe: ${title}
Servings: ${servings || 4}

Ingredients:
${ingredientsText}

Generate a complete, step-by-step cooking instruction guide. Return ONLY a JSON array of direction steps.

Each step should have:
- stepNumber: number (starting from 1)
- instruction: string (detailed, clear instruction)

Format:
[
  {"stepNumber": 1, "instruction": "Preheat oven to 350°F (175°C)."},
  {"stepNumber": 2, "instruction": "In a large bowl, combine..."}
]

Requirements:
- 5-12 steps (appropriate for the recipe)
- Clear, actionable instructions
- Include temperatures, times, and techniques
- Professional chef-level detail
- NO markdown, ONLY JSON array

Generate now:`;

        // GPT-3.5-turbo - Cheapest model (~$0.0005 per request)
        const result = await openRouter.chat(
            [{ role: "user", content: prompt }],
            "openai/gpt-3.5-turbo",
            { temperature: 0.7, max_tokens: 400 }
        );

        // Parse the JSON response
        let directions;
        try {
            const content = result.content;

            // Try to extract JSON array from response
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                directions = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("No JSON array found in response");
            }
        } catch (parseError) {
            console.error("Failed to parse directions:", parseError);
            console.error("AI Response:", result.content);
            return NextResponse.json(
                { error: "Failed to parse AI-generated directions", details: result.content },
                { status: 500 }
            );
        }

        // If recipeId provided, save to database
        if (recipeId && Array.isArray(directions)) {
            console.log(`💾 Saving ${directions.length} directions to database...`);

            // Delete existing directions
            await prisma.direction.deleteMany({
                where: { recipeId },
            });

            // Create new directions
            await Promise.all(
                directions.map((step: any) =>
                    prisma.direction.create({
                        data: {
                            recipeId,
                            stepNumber: step.stepNumber,
                            instruction: step.instruction,
                        },
                    })
                )
            );

            console.log(`✅ Directions saved for recipe: ${recipeId}`);
        }

        return NextResponse.json({
            success: true,
            directions,
            count: directions.length,
            generated: true,
        });

    } catch (error: unknown) {
        console.error("Direction generation error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            { error: "Failed to generate directions", details: errorMessage },
            { status: 500 }
        );
    }
}
