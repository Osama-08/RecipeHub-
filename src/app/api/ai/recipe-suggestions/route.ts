import { NextRequest, NextResponse } from 'next/server';
import { OpenRouterProvider } from '@/lib/openrouter-provider';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { ingredients } = await req.json();

        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return NextResponse.json(
                { error: 'Please provide a list of ingredients' },
                { status: 400 }
            );
        }

        const prompt = `You are a professional chef and recipe expert. A user has the following ingredients: ${ingredients.join(', ')}.

Please suggest 5 delicious recipes that can be made using ONLY these ingredients (or a subset of them). For each recipe, provide:
1. Recipe name
2. Brief description (1-2 sentences)
3. Difficulty level (Easy/Medium/Hard)
4. Cooking time (in minutes)
5. Which ingredients from the list are needed

Format your response as a JSON array with this structure:
[
  {
    "name": "Recipe Name",
    "description": "Brief description",
    "difficulty": "Easy|Medium|Hard",
    "cookingTime": 30,
    "ingredientsUsed": ["ingredient1", "ingredient2"]
  }
]

IMPORTANT: Return ONLY the JSON array, no additional text or markdown formatting.`;

        const openRouter = new OpenRouterProvider();
        const result = await openRouter.chat(
            [{ role: "user", content: prompt }],
            "openai/gpt-3.5-turbo",
            { temperature: 0.7, max_tokens: 1000 }
        );

        let text = result.content;

        // Clean up the response - remove markdown code blocks if present
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        try {
            const recipes = JSON.parse(text);
            return NextResponse.json({ recipes });
        } catch (parseError) {
            console.error('Failed to parse AI response:', text);
            return NextResponse.json(
                { error: 'Failed to generate recipe suggestions. Please try again.' },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error('Error generating recipe suggestions:', error);

        // Check if it's an API key error
        if (error.message?.includes('API key')) {
            return NextResponse.json(
                { error: 'AI service configuration error. Please contact administrator.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: error.message || 'Failed to generate recipe suggestions' },
            { status: 500 }
        );
    }
}
