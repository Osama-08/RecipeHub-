"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Play } from "lucide-react";

interface YouTubeEmbedProps {
    videoId: string;
    title: string;
    creatorName?: string | null;
    creatorChannelId?: string | null;
}

export default function YouTubeEmbed({
    videoId,
    title,
    creatorName,
    creatorChannelId,
}: YouTubeEmbedProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const channelUrl = creatorChannelId
        ? `https://www.youtube.com/channel/${creatorChannelId}`
        : null;

    if (hasError) {
        return (
            <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="text-white mb-4">
                        <svg
                            className="w-16 h-16 mx-auto mb-4 opacity-50"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                        </svg>
                    </div>
                    <p className="text-white text-lg font-semibold mb-2">
                        Video Unavailable
                    </p>
                    <p className="text-gray-400 text-sm mb-4">
                        This video may have been removed or made private
                    </p>
                    <a
                        href={videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Try Opening on YouTube
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Video Player */}
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                {!isLoaded ? (
                    <div
                        className="absolute inset-0 cursor-pointer group"
                        onClick={() => setIsLoaded(true)}
                    >
                        {/* Thumbnail */}
                        <Image
                            src={thumbnailUrl}
                            alt={title}
                            fill
                            className="object-cover"
                            onError={() => setHasError(true)}
                        />

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                                <Play className="w-10 h-10 text-white ml-1" fill="white" />
                            </div>
                        </div>

                        {/* Video Duration Badge */}
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                            Click to play
                        </div>
                    </div>
                ) : (
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                        onError={() => setHasError(true)}
                    />
                )}
            </div>

            {/* Creator Attribution */}
            {creatorName && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                {creatorName[0].toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Recipe by</p>
                            {channelUrl ? (
                                <a
                                    href={channelUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-gray-900 hover:text-orange-600 transition-colors flex items-center gap-1"
                                >
                                    {creatorName}
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            ) : (
                                <p className="font-semibold text-gray-900">{creatorName}</p>
                            )}
                        </div>
                    </div>

                    <a
                        href={videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Watch on YouTube
                    </a>
                </div>
            )}
        </div>
    );
}
