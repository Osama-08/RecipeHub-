'use client';

interface YouTubePlayerProps {
    videoId: string;
    title?: string;
    autoplay?: boolean;
}

export default function YouTubePlayer({ videoId, title, autoplay = true }: YouTubePlayerProps) {
    if (!videoId) {
        return (
            <div className="aspect-video bg-gray-900 flex items-center justify-center rounded-xl">
                <p className="text-white/60">No video provided</p>
            </div>
        );
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}`;

    return (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
            <iframe
                src={embedUrl}
                title={title || "YouTube video player"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
            ></iframe>
        </div>
    );
}
