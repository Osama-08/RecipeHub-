// YouTube Recipe Importer
// Fetches video data and extracts recipe information

interface VideoInfo {
    id: string;
    title: string;
    description: string;
    channelTitle: string;
    channelId: string;
    thumbnailUrl: string;
}

interface ParsedRecipe {
    title: string;
    description: string;
    youtubeId: string;
    videoCreatorName: string;
    videoCreatorChannelId: string;
    imageUrl: string;
    ingredients: string[];
    directions: string[];
    servings?: number;
    prepTime?: number;
    cookTime?: number;
}

export class YouTubeImporter {
    private apiKey: string;

    constructor() {
        this.apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "";
        if (!this.apiKey) {
            throw new Error("YouTube API key not found");
        }
    }

    /**
     * Extract video ID from various YouTube URL formats
     */
    extractVideoId(url: string): string | null {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
            /youtube\.com\/embed\/([^&\n?#]+)/,
            /youtube\.com\/v\/([^&\n?#]+)/,
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }

        // If it's just an ID (11 characters)
        if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
            return url;
        }

        return null;
    }

    /**
     * Fetch video information from YouTube API
     */
    async fetchVideoInfo(videoId: string): Promise<VideoInfo> {
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${this.apiKey}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`YouTube API error: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            throw new Error("Video not found");
        }

        const video = data.items[0];
        const snippet = video.snippet;

        return {
            id: videoId,
            title: snippet.title,
            description: snippet.description,
            channelTitle: snippet.channelTitle,
            channelId: snippet.channelId,
            thumbnailUrl: snippet.thumbnails.maxres?.url || snippet.thumbnails.high.url,
        };
    }

    /**
     * Parse recipe data from video description
     */
    parseRecipeFromDescription(videoInfo: VideoInfo): ParsedRecipe {
        const description = videoInfo.description;
        const lines = description.split("\n");

        const parsed: ParsedRecipe = {
            title: videoInfo.title,
            description: description.substring(0, 500), // First 500 chars
            youtubeId: videoInfo.id,
            videoCreatorName: videoInfo.channelTitle,
            videoCreatorChannelId: videoInfo.channelId,
            imageUrl: videoInfo.thumbnailUrl,
            ingredients: [],
            directions: [],
        };

        let inIngredientsSection = false;
        let inDirectionsSection = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineLower = line.toLowerCase();

            // Detect ingredients section
            if (
                lineLower.includes("ingredient") ||
                lineLower.includes("what you need") ||
                lineLower === "ingredients:"
            ) {
                inIngredientsSection = true;
                inDirectionsSection = false;
                continue;
            }

            // Detect directions section
            if (
                lineLower.includes("direction") ||
                lineLower.includes("instruction") ||
                lineLower.includes("method") ||
                lineLower.includes("steps") ||
                lineLower === "directions:"
            ) {
                inDirectionsSection = true;
                inIngredientsSection = false;
                continue;
            }

            // Parse servings
            const servingsMatch = line.match(/(?:serves?|servings?:?)\s*(\d+)/i);
            if (servingsMatch) {
                parsed.servings = parseInt(servingsMatch[1]);
            }

            // Parse prep time
            const prepMatch = line.match(/(?:prep\s*time:?)\s*(\d+)\s*(?:min|minute)/i);
            if (prepMatch) {
                parsed.prepTime = parseInt(prepMatch[1]);
            }

            // Parse cook time
            const cookMatch = line.match(/(?:cook\s*time:?)\s*(\d+)\s*(?:min|minute)/i);
            if (cookMatch) {
                parsed.cookTime = parseInt(cookMatch[1]);
            }

            // Parse ingredients
            if (inIngredientsSection && line && line.length > 0) {
                // Skip section headers and timestamps
                if (
                    !lineLower.includes("http") &&
                    !lineLower.includes("timestamp") &&
                    !lineLower.match(/^\d+:\d+/) &&
                    line.length < 100
                ) {
                    // Clean up bullet points and numbers
                    const cleaned = line.replace(/^[-•*\d.)\s]+/, "").trim();
                    if (cleaned) {
                        parsed.ingredients.push(cleaned);
                    }
                }
            }

            // Parse directions
            if (inDirectionsSection && line && line.length > 0) {
                // Skip section headers and timestamps
                if (
                    !lineLower.includes("http") &&
                    !lineLower.includes("timestamp") &&
                    !lineLower.match(/^\d+:\d+/)
                ) {
                    // Clean up bullet points and numbers
                    const cleaned = line.replace(/^[-•*\d.)\s]+/, "").trim();
                    if (cleaned && cleaned.length > 10) {
                        // Minimum length for a direction
                        parsed.directions.push(cleaned);
                    }
                }
            }

            // Stop parsing after links section
            if (lineLower.includes("social media") || lineLower.includes("follow me")) {
                break;
            }
        }

        return parsed;
    }

    /**
     * Main import method
     */
    async importRecipe(urlOrId: string): Promise<ParsedRecipe> {
        const videoId = this.extractVideoId(urlOrId);

        if (!videoId) {
            throw new Error("Invalid YouTube URL or video ID");
        }

        const videoInfo = await this.fetchVideoInfo(videoId);
        const parsed = this.parseRecipeFromDescription(videoInfo);

        return parsed;
    }
}
