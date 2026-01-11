import { NextRequest, NextResponse } from "next/server";
import { AIOrchestrator } from "@/lib/ai-orchestrator";

// Smart Recipe Search with Natural Language
// POST /api/recipes/smart-search
// Body: { query: string, filters?: { cuisine, diet, occasion } }

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { query } = body;

        if (!query) {
            return NextResponse.json(
                { error: "Query is required" },
                { status: 400 }
            );
        }

        const orchestrator = new AIOrchestrator();

        // Use orchestrator to handle recipe search intelligently
        const response = await orchestrator.handleRequest(query);

        return NextResponse.json(response);
    } catch (error: unknown) {
        console.error("Smart search error:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            { error: "Failed to search recipes", details: errorMessage },
            { status: 500 }
        );
    }
}
