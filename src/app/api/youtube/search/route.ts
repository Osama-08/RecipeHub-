import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("query");

        if (!query) {
            return NextResponse.json(
                { error: "Query parameter is required" },
                { status: 400 }
            );
        }

        const apiKey = process.env.YOUTUBE_API_KEY;
        if (!apiKey) {
            console.error("YOUTUBE_API_KEY is not set");
            return NextResponse.json(
                { error: "YouTube API key not configured" },
                { status: 500 }
            );
        }

        // Search for cooking/recipe videos related to the query
        const searchQuery = encodeURIComponent(`${query} recipe cooking tutorial`);
        const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&videoCategoryId=26&maxResults=1&key=${apiKey}`;

        const response = await fetch(youtubeUrl);

        if (!response.ok) {
            const errorData = await response.json();
            console.error("YouTube API error:", errorData);
            return NextResponse.json(
                { error: "Failed to fetch from YouTube API" },
                { status: response.status }
            );
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            return NextResponse.json(
                { video: null, message: "No videos found" },
                { status: 200 }
            );
        }

        const video = data.items[0];
        const videoData = {
            videoId: video.id.videoId,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.medium.url,
            channelTitle: video.snippet.channelTitle,
        };

        return NextResponse.json({ video: videoData }, { status: 200 });
    } catch (error) {
        console.error("Error searching YouTube:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
