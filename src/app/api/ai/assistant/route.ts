import { NextRequest, NextResponse } from "next/server";
import { AIOrchestrator } from "@/lib/ai-orchestrator";

// General AI Cooking Assistant
// POST /api/ai/assistant
// Body: { message: string, conversationHistory?: Array<{role, content}> }

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, conversationHistory } = body;

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        const orchestrator = new AIOrchestrator();

        // Handle the request intelligently
        const response = await orchestrator.handleRequest(message, {
            conversationHistory: conversationHistory || [],
        });

        return NextResponse.json({
            ...response,
            timestamp: new Date().toISOString(),
        });
    } catch (error: unknown) {
        console.error("AI Assistant Error:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            { error: "Failed to get AI response", details: errorMessage },
            { status: 500 }
        );
    }
}
