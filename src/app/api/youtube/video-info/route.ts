import { NextRequest, NextResponse } from "next/server";

interface YoutubeVideoInfo {
    title: string;
    description: string;
    channelTitle: string;
    channelId: string;
    thumbnailUrl: string;
    publishedAt: string;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const videoId = searchParams.get("videoId");

        if (!videoId) {
            return NextResponse.json(
                { error: "Video ID is required" },
                { status: 400 }
            );
        }

        const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "YouTube API key not configured" },
                { status: 500 }
            );
        }

        // Fetch video details from YouTube Data API
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(`YouTube API error: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            return NextResponse.json(
                { error: "Video not found" },
                { status: 404 }
            );
        }

        const video = data.items[0];
        const snippet = video.snippet;

        const videoInfo: YoutubeVideoInfo = {
            title: snippet.title,
            description: snippet.description,
            channelTitle: snippet.channelTitle,
            channelId: snippet.channelId,
            thumbnailUrl: snippet.thumbnails.maxres?.url || snippet.thumbnails.high?.url || snippet.thumbnails.default.url,
            publishedAt: snippet.publishedAt,
        };

        return NextResponse.json(videoInfo);
    } catch (error: unknown) {
        console.error("YouTube API Error:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            { error: "Failed to fetch video info", details: errorMessage },
            { status: 500 }
        );
    }
}
