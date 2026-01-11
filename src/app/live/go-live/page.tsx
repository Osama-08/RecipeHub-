"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { Video, Radio, Camera, Mic, MicOff, VideoOff, Loader2 } from "lucide-react";

export default function GoLivePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isLive, setIsLive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cameraEnabled, setCameraEnabled] = useState(true);
    const [micEnabled, setMicEnabled] = useState(true);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [sessionId, setSessionId] = useState("");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [duration, setDuration] = useState(0); // Duration in seconds
    const [startTime, setStartTime] = useState<number | null>(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status, router]);

    // Initialize camera - only once
    useEffect(() => {
        let mounted = true;

        const initCamera = async () => {
            if (status !== "authenticated" || stream) return;

            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: "user"
                    },
                    audio: true,
                });

                if (!mounted) {
                    mediaStream.getTracks().forEach(track => track.stop());
                    return;
                }

                setStream(mediaStream);
            } catch (error) {
                console.error("Error accessing camera:", error);
                if (mounted) {
                    alert("Please allow camera and microphone access to go live.");
                }
            }
        };

        initCamera();

        return () => {
            mounted = false;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [status, stream]); // Only depend on status and stream

    // Assign stream to video element when stream is ready
    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
            // Force play to ensure it starts
            videoRef.current.play().catch(err => {
                console.error("Error playing video:", err);
            });
        }
    }, [stream]);

    // Duration timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLive && startTime) {
            interval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                setDuration(elapsed);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isLive, startTime]);

    const toggleCamera = () => {
        if (stream) {
            stream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setCameraEnabled(!cameraEnabled);
        }
    };

    const toggleMic = () => {
        if (stream) {
            stream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setMicEnabled(!micEnabled);
        }
    };

    const handleGoLive = async () => {
        if (!title.trim()) {
            alert("Please enter a title for your stream");
            return;
        }

        setLoading(true);
        try {
            // Create live session in database for YouTube
            const res = await fetch("/api/live", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    youtubeUrl,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to create live session");
            }

            const data = await res.json();
            setSessionId(data.session.id);
            setStartTime(Date.now());
            setIsLive(true);
        } catch (error) {
            console.error("Error starting stream:", error);
            alert("Failed to start stream. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleEndStream = async () => {
        if (!sessionId) return;

        setLoading(true);
        try {
            await fetch(`/api/live/${sessionId}`, {
                method: "PATCH",
            });

            // Stop camera/mic
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            router.push("/live");
        } catch (error) {
            console.error("Error ending stream:", error);
            alert("Failed to end stream.");
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
        );
    }

    if (status === "unauthenticated") {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {!isLive ? (
                        // Pre-stream Setup
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Camera Preview */}
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4">Camera Preview</h2>
                                <div className="bg-black rounded-xl overflow-hidden aspect-video relative">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover mirror"
                                    />

                                    {/* Controls */}
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                                        <button
                                            onClick={toggleCamera}
                                            className={`p-4 rounded-full transition-colors ${cameraEnabled
                                                ? "bg-gray-700 hover:bg-gray-600"
                                                : "bg-red-600 hover:bg-red-700"
                                                }`}
                                        >
                                            {cameraEnabled ? (
                                                <Video className="w-6 h-6 text-white" />
                                            ) : (
                                                <VideoOff className="w-6 h-6 text-white" />
                                            )}
                                        </button>
                                        <button
                                            onClick={toggleMic}
                                            className={`p-4 rounded-full transition-colors ${micEnabled
                                                ? "bg-gray-700 hover:bg-gray-600"
                                                : "bg-red-600 hover:bg-red-700"
                                                }`}
                                        >
                                            {micEnabled ? (
                                                <Mic className="w-6 h-6 text-white" />
                                            ) : (
                                                <MicOff className="w-6 h-6 text-white" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Stream Details */}
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4">Stream Details</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-white mb-2 font-medium">
                                            Stream Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g., Making Perfect Pasta Carbonara"
                                            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            maxLength={100}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white mb-2 font-medium">
                                            YouTube Live URL *
                                        </label>
                                        <input
                                            type="text"
                                            value={youtubeUrl}
                                            onChange={(e) => setYoutubeUrl(e.target.value)}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white mb-2 font-medium">
                                            Description (Optional)
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Tell viewers what you'll be cooking..."
                                            rows={4}
                                            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            maxLength={500}
                                        />
                                    </div>

                                    <button
                                        onClick={handleGoLive}
                                        disabled={loading || !title.trim()}
                                        className="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg font-bold text-lg hover:from-red-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Starting Stream...
                                            </>
                                        ) : (
                                            <>
                                                <Radio className="w-5 h-5" />
                                                Go Live
                                            </>
                                        )}
                                    </button>

                                    <p className="text-gray-400 text-sm text-center">
                                        Your stream will be visible to all users on the platform
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Live Streaming View
                        <div className="space-y-6">
                            <div className="flex items-center justify-between bg-red-600 px-6 py-4 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                                        <span className="text-white font-bold text-lg">LIVE</span>
                                    </div>
                                    <span className="text-white/90">|</span>
                                    <span className="text-white">{title}</span>
                                </div>
                                <button
                                    onClick={handleEndStream}
                                    disabled={loading}
                                    className="px-6 py-2 bg-white text-red-600 rounded-lg font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
                                >
                                    {loading ? "Ending..." : "End Stream"}
                                </button>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <div className="bg-black rounded-xl overflow-hidden aspect-video relative">
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            muted
                                            playsInline
                                            className="w-full h-full object-cover mirror"
                                        />

                                        {/* Controls */}
                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                                            <button
                                                onClick={toggleCamera}
                                                className={`p-4 rounded-full transition-colors ${cameraEnabled
                                                    ? "bg-gray-700/80 hover:bg-gray-600/80"
                                                    : "bg-red-600 hover:bg-red-700"
                                                    }`}
                                            >
                                                {cameraEnabled ? (
                                                    <Video className="w-6 h-6 text-white" />
                                                ) : (
                                                    <VideoOff className="w-6 h-6 text-white" />
                                                )}
                                            </button>
                                            <button
                                                onClick={toggleMic}
                                                className={`p-4 rounded-full transition-colors ${micEnabled
                                                    ? "bg-gray-700/80 hover:bg-gray-600/80"
                                                    : "bg-red-600 hover:bg-red-700"
                                                    }`}
                                            >
                                                {micEnabled ? (
                                                    <Mic className="w-6 h-6 text-white" />
                                                ) : (
                                                    <MicOff className="w-6 h-6 text-white" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-800 rounded-xl p-6">
                                    <h3 className="text-white font-bold mb-4">Stream Info</h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <span className="text-gray-400">Status:</span>
                                            <span className="text-green-400 ml-2 font-bold">● Live</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Viewers:</span>
                                            <span className="text-white ml-2">0</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Duration:</span>
                                            <span className="text-white ml-2">
                                                {Math.floor(duration / 60).toString().padStart(2, '0')}:
                                                {(duration % 60).toString().padStart(2, '0')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-800 rounded-xl p-6">
                                <p className="text-gray-300 text-center">
                                    💡 <strong>Tip:</strong> Interact with your viewers, answer questions, and make your cooking session engaging!
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .mirror {
                    transform: scaleX(-1);
                }
            `}</style>
        </div>
    );
}
