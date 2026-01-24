"use client";

import { useState, useEffect } from "react";
import { X, Minimize2, Maximize2, Loader2 } from "lucide-react";

interface VideoData {
    videoId: string;
    title: string;
    thumbnail: string;
    channelTitle: string;
}

interface FloatingVideoPlayerProps {
    recipeTitle: string;
}

export default function FloatingVideoPlayer({ recipeTitle }: FloatingVideoPlayerProps) {
    const [video, setVideo] = useState<VideoData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        async function fetchVideo() {
            try {
                const response = await fetch(`/api/youtube/search?query=${encodeURIComponent(recipeTitle)}`);
                const data = await response.json();

                if (data.video) {
                    setVideo(data.video);
                } else {
                    console.log("No related video found");
                }
            } catch (error) {
                console.error("Error fetching YouTube video:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchVideo();
    }, [recipeTitle]);

    const handleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        setIsMinimized(false);
    };

    if (loading) {
        return (
            <div className="fixed bottom-6 right-6 z-[9999] bg-white rounded-lg shadow-2xl border-2 border-gray-200 p-4">
                <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">Loading video...</span>
                </div>
            </div>
        );
    }

    if (!video || isClosed) {
        return null;
    }

    return (
        <>
            {/* Fullscreen Overlay */}
            {isFullscreen && (
                <div className="fixed inset-0 z-[10000] bg-black bg-opacity-95 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-7xl">
                        <button
                            onClick={handleFullscreen}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                            aria-label="Exit fullscreen"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                            <iframe
                                className="absolute inset-0 w-full h-full rounded-lg"
                                src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
                                title={video.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <div className="mt-4 text-white">
                            <h3 className="font-semibold text-lg">{video.title}</h3>
                            <p className="text-gray-300 text-sm mt-1">{video.channelTitle}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Fixed Bottom-Right Player */}
            {!isFullscreen && (
                <div className="fixed bottom-6 right-6 z-[9999] bg-white rounded-lg shadow-2xl border-2 border-orange-500 overflow-hidden transition-all duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-white text-xs font-semibold truncate">
                                Related Video
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="text-white hover:bg-white/20 p-1 rounded transition-colors"
                                aria-label={isMinimized ? "Maximize" : "Minimize"}
                            >
                                {isMinimized ? (
                                    <Maximize2 className="w-4 h-4" />
                                ) : (
                                    <Minimize2 className="w-4 h-4" />
                                )}
                            </button>
                            <button
                                onClick={() => setIsClosed(true)}
                                className="text-white hover:bg-white/20 p-1 rounded transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Video Content */}
                    {!isMinimized && (
                        <div className="bg-black">
                            <div className="relative w-[400px] h-[225px]">
                                <iframe
                                    className="absolute inset-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${video.videoId}?rel=0`}
                                    title={video.title}
                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>

                            {/* Video Info */}
                            <div className="bg-white px-3 py-2 border-t">
                                <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                                    {video.title}
                                </h4>
                                <p className="text-xs text-gray-600">{video.channelTitle}</p>
                                <button
                                    onClick={handleFullscreen}
                                    className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold py-2 rounded transition-colors"
                                >
                                    Watch Fullscreen
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Minimized Preview */}
                    {isMinimized && (
                        <div
                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => setIsMinimized(false)}
                        >
                            <div className="flex items-center gap-3 p-3 w-[300px]">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-20 h-14 object-cover rounded"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-gray-900 line-clamp-2">
                                        {video.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{video.channelTitle}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Mobile Responsive Styles */}
            <style jsx>{`
                @media (max-width: 640px) {
                    .fixed.bottom-6.right-6 {
                        bottom: 1rem;
                        right: 1rem;
                        left: 1rem;
                    }
                    .fixed.bottom-6.right-6 .w-\\[400px\\] {
                        width: 100%;
                    }
                    .fixed.bottom-6.right-6 .w-\\[300px\\] {
                        width: 100%;
                    }
                }
            `}</style>
        </>
    );
}
