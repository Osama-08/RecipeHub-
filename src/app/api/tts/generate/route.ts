import { NextRequest, NextResponse } from "next/server";
import { TTSService } from "@/lib/tts-provider";

// Simple rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const userLimit = rateLimitStore.get(ip);

    if (!userLimit || userLimit.resetTime < now) {
        rateLimitStore.set(ip, {
            count: 1,
            resetTime: now + 60 * 60 * 1000, // 1 hour
        });
        return true;
    }

    if (userLimit.count >= 50) {
        // 50 requests per hour
        return false;
    }

    userLimit.count++;
    return true;
}

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const ip = request.headers.get("x-forwarded-for") || "unknown";
        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { error: "Rate limit exceeded. Try again later." },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { text, stepNumber, voice } = body;

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        // Check if TTS is configured
        const ttsProvider = process.env.TTS_PROVIDER;
        const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
        const hasElevenLabsKey = !!process.env.ELEVENLABS_API_KEY;

        if (!ttsProvider || (!hasOpenAIKey && !hasElevenLabsKey)) {
            return NextResponse.json(
                {
                    error: "TTS service not configured. Please add API keys to .env file.",
                },
                { status: 503 }
            );
        }

        const ttsService = new TTSService();

        let audioData: string;
        if (stepNumber !== undefined) {
            audioData = await ttsService.generateStepAudio(stepNumber, text);
        } else {
            audioData = await ttsService.generateSpeech(text, { voice });
        }

        return NextResponse.json({
            audio: audioData,
            provider: ttsProvider,
        });
    } catch (error: unknown) {
        console.error("TTS generation error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            { error: "Failed to generate speech", details: message },
            { status: 500 }
        );
    }
}
