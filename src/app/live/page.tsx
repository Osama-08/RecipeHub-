"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Header from "@/components/layout/Header";
import { Video, Radio, Users, Play, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface LiveSession {
    id: string;
    title: string;
    description: string | null;
    viewerCount: number;
    startedAt: string;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
}

export default function LivePage() {
    const { data: session } = useSession();
    const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLiveSessions();
        // Poll every 10 seconds for updates
        const interval = setInterval(fetchLiveSessions, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchLiveSessions = async () => {
        try {
            const res = await fetch("/api/live");
            const data = await res.json();
            setLiveSessions(data.sessions || []);
        } catch (error) {
            console.error("Error fetching live sessions:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-600 via-pink-500 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <Radio className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-5xl font-bold mb-4">Live Cooking Streams</h1>
                        <p className="text-xl text-white/90 mb-8">
                            Watch professional chefs cook live, ask questions in real-time, and learn new techniques!
                        </p>

                        {liveSessions.length > 0 && (
                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 rounded-full animate-pulse">
                                <span className="w-3 h-3 bg-white rounded-full animate-ping"></span>
                                <span className="font-bold">{liveSessions.length} Live Now</span>
                            </div>
                        )}

                        {session && (
                            <div className="mt-6">
                                <Link
                                    href="/live/go-live"
                                    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-red-50 transition-colors"
                                >
                                    <Video className="w-5 h-5" />
                                    Start Broadcasting
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Live Streams */}
            <div className="container mx-auto px-4 py-12">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading live streams...</p>
                    </div>
                ) : liveSessions.length > 0 ? (
                    <>
                        <h2 className="text-3xl font-bold mb-8">
                            🔴 Live Now ({liveSessions.length})
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {liveSessions.map((stream) => (
                                <Link
                                    key={stream.id}
                                    href={`/live/${stream.id}`}
                                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
                                >
                                    {/* Thumbnail with LIVE Badge */}
                                    <div className="relative h-48 bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                                        <Play className="w-16 h-16 text-white/50" />
                                        <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-2 animate-pulse">
                                            <span className="w-2 h-2 bg-white rounded-full"></span>
                                            <span className="text-sm font-bold">LIVE</span>
                                        </div>
                                        <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded flex items-center gap-1 text-sm">
                                            <Users className="w-4 h-4" />
                                            {stream.viewerCount || 0}
                                        </div>
                                    </div>

                                    {/* Stream Info */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg mb-2 group-hover:text-red-600 transition-colors">
                                            {stream.title}
                                        </h3>
                                        {stream.description && (
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                {stream.description}
                                            </p>
                                        )}

                                        {/* Creator */}
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                                {stream.user.image ? (
                                                    <Image
                                                        src={stream.user.image}
                                                        alt={stream.user.name || "User"}
                                                        width={32}
                                                        height={32}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500"></div>
                                                )}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">
                                                {stream.user.name || "Anonymous Chef"}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    // No Live Streams
                    <div className="max-w-2xl mx-auto text-center py-12">
                        <div className="inline-block p-4 bg-gray-100 rounded-full mb-6">
                            <Radio className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">No Live Streams Right Now</h2>
                        <p className="text-gray-600 mb-8">
                            Be the first to go live and share your cooking skills with the community!
                        </p>

                        {session ? (
                            <Link
                                href="/live/go-live"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-bold hover:from-red-600 hover:to-pink-600 transition-all"
                            >
                                <Video className="w-5 h-5" />
                                Start Your First Stream
                            </Link>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-500">Sign in to start streaming</p>
                                <Link
                                    href="/auth/signin"
                                    className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors"
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Features */}
                {!loading && (
                    <div className="mt-16 grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl p-6 text-center shadow-md">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Radio className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Go Live Instantly</h3>
                            <p className="text-gray-600 text-sm">
                                Start streaming your cooking in seconds
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 text-center shadow-md">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Real-Time Interaction</h3>
                            <p className="text-gray-600 text-sm">
                                Chat with viewers and answer questions live
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 text-center shadow-md">
                            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-8 h-8 text-pink-600" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Auto-Recording</h3>
                            <p className="text-gray-600 text-sm">
                                Streams are automatically saved for replay
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
