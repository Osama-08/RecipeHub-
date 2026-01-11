import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { YouTubeImporter } from "@/lib/youtube-importer";

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();

        const body = await request.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json(
                { error: "YouTube URL or video ID is required" },
                { status: 400 }
            );
        }

        const importer = new YouTubeImporter();
        const parsedRecipe = await importer.importRecipe(url);

        return NextResponse.json({ recipe: parsedRecipe });
    } catch (error: unknown) {
        console.error("YouTube import error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        const status = message.includes("Unauthorized")
            ? 401
            : message.includes("Forbidden")
                ? 403
                : 500;

        return NextResponse.json(
            { error: "Failed to import recipe", details: message },
            { status }
        );
    }
}
