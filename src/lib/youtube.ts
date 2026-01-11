/**
 * Extracts the YouTube video ID from a given URL or returns the ID if already provided
 * Supports various formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 */
export function extractYouTubeVideoId(urlOrId: string): string | null {
    if (!urlOrId) return null;

    // If it's already a likely ID (11 characters, alphanumeric with some symbols)
    if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
        return urlOrId;
    }

    const patterns = [
        /(?:v=|\/|embed\/|live\/|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = urlOrId.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

/**
 * Searches for a YouTube video based on a query
 */
export async function searchYouTubeVideo(query: string): Promise<string | null> {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        console.warn('YouTube API key is missing');
        return null;
    }

    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
                query + ' recipe'
            )}&type=video&key=${apiKey}`
        );

        const data = await response.json();

        if (data.items && data.items.length > 0) {
            return data.items[0].id.videoId;
        }

        return null;
    } catch (error) {
        console.error('Error searching YouTube video:', error);
        return null;
    }
}
