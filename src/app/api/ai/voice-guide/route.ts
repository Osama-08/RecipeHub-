import { NextRequest, NextResponse } from "next/server";
import { OpenRouterProvider } from "@/lib/openrouter-provider";

// AI Voice Guidance for Recipe Directions
// POST /api/ai/voice-guide
// Body: { recipeId: string, stepNumber: number }

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { direction, stepNumber } = body;

        if (!direction) {
            return NextResponse.json(
                { error: "Direction text is required" },
                { status: 400 }
            );
        }

        const openRouter = new OpenRouterProvider();

        // Use AI to enhance the direction with detailed guidance
        const messages = [
            {
                role: "system" as const,
                content: `You are a professional cooking instructor. Your job is to explain cooking steps in detail.
        
        When given a cooking instruction:
        1. Read the instruction clearly
        2. Provide additional helpful details and tips
        3. Explain techniques if needed
        4. Keep it concise but informative (2-3 sentences max)
        5. Be encouraging and friendly
        
        Format: Start by reading the step, then add your helpful details.`,
            },
            {
                role: "user" as const,
                content: `Step ${stepNumber}: ${direction}\n\nProvide detailed guidance for this cooking step.`,
            },
        ];

        const result = await openRouter.chat(messages, "openai/gpt-4-turbo", {
            max_tokens: 200,
            temperature: 0.7,
        });

        const guidance = result.content;

        return NextResponse.json({
            success: true,
            stepNumber,
            originalDirection: direction,
            enhancedGuidance: guidance,
            shouldReadAloud: true,
        });
    } catch (error: unknown) {
        console.error("Voice guidance generation error:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            { error: "Failed to generate voice guidance", details: errorMessage },
            { status: 500 }
        );
    }
}
