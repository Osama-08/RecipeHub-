import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { AIRecipeAssistant } from "@/lib/ai-provider";

// Rate limiting: simple in-memory store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const userLimit = rateLimitStore.get(userId);

    if (!userLimit || userLimit.resetTime < now) {
        // Reset: 50 requests per hour
        rateLimitStore.set(userId, {
            count: 1,
            resetTime: now + 60 * 60 * 1000,
        });
        return true;
    }

    if (userLimit.count >= 50) {
        return false;
    }

    userLimit.count++;
    return true;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { recipeId, message, conversationId, userId } = body;

        // Validate inputs
        if (!recipeId || !message) {
            return NextResponse.json(
                { error: "Recipe ID and message are required" },
                { status: 400 }
            );
        }

        // TODO: Get real user ID from session
        const effectiveUserId = userId || "anonymous";

        // Check rate limit
        if (!checkRateLimit(effectiveUserId)) {
            return NextResponse.json(
                { error: "Rate limit exceeded. Try again later." },
                { status: 429 }
            );
        }

        // Fetch recipe data
        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            include: {
                ingredients: {
                    orderBy: { order: "asc" },
                    select: {
                        amount: true,
                        unit: true,
                        name: true,
                    },
                },
                directions: {
                    orderBy: { stepNumber: "asc" },
                    select: {
                        stepNumber: true,
                        instruction: true,
                    },
                },
                nutrition: {
                    select: {
                        calories: true,
                        protein: true,
                        carbs: true,
                        fat: true,
                    },
                },
            },
        });

        if (!recipe) {
            return NextResponse.json(
                { error: "Recipe not found" },
                { status: 404 }
            );
        }

        // Load conversation history if conversationId provided
        let conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = [];

        if (conversationId) {
            const conversation = await prisma.aIConversation.findUnique({
                where: { id: conversationId },
            });

            if (conversation) {
                conversationHistory = JSON.parse(conversation.messages);
            }
        }

        // Initialize AI assistant with OpenRouter
        const openRouter = new (await import("@/lib/openrouter-provider")).OpenRouterProvider();

        // Get AI response using OpenRouter with recipe context
        const { response, tokensUsed } = await openRouter.chatWithRecipeContext(
            {
                title: recipe.title,
                ingredients: recipe.ingredients.map(ing => ({
                    amount: ing.amount,
                    unit: ing.unit || undefined,
                    name: ing.name
                })),
                directions: recipe.directions,
                nutrition: recipe.nutrition || undefined,
                servings: recipe.servings,
                prepTime: recipe.prepTime,
                cookTime: recipe.cookTime,
            },
            message,
            conversationHistory
        );

        // Update conversation history
        const updatedHistory = [
            ...conversationHistory,
            { role: "user" as const, content: message },
            { role: "assistant" as const, content: response },
        ];

        // Save conversation
        let finalConversationId = conversationId;

        if (conversationId) {
            await prisma.aIConversation.update({
                where: { id: conversationId },
                data: { messages: JSON.stringify(updatedHistory) },
            });
        } else {
            // Create new conversation only if user is authenticated
            // For anonymous users, we'll just return the response without saving
            if (userId && userId !== "anonymous") {
                const newConversation = await prisma.aIConversation.create({
                    data: {
                        userId: userId,
                        messages: JSON.stringify(updatedHistory),
                    },
                });
                finalConversationId = newConversation.id;
            }
        }

        return NextResponse.json({
            response,
            conversationId: finalConversationId,
            tokensUsed,
        });
    } catch (error: unknown) {
        console.error("AI Chat Error:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            { error: "Failed to get AI response", details: errorMessage },
            { status: 500 }
        );
    }
}
