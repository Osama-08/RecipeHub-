'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/layout/Header';
import Image from 'next/image';
import YouTubePlayer from '@/components/live/YouTubePlayer';
import ChatRoom from '@/components/community/ChatRoom';
import { Users, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function LiveStreamPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: session } = useSession();
    const [stream, setStream] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchStream = useCallback(async () => {
        try {
            const res = await fetch(`/api/live/${id}`);
            const data = await res.json();
            setStream(data.session);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchStream();
    }, [fetchStream]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
        );
    }

    if (!stream) {
        return (
            <div className="min-h-screen bg-gray-900">
                <Header />
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">Stream Not Found</h1>
                    <p className="text-gray-400">The live stream you&apos;re looking for doesn&apos;t exist or has ended.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <Header />

            <div className="container mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left: Video & Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <YouTubePlayer
                            videoId={stream.youtubeVideoId}
                            title={stream.title}
                        />

                        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-2">{stream.title}</h1>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{stream.viewerCount || 0} watching</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>Started {format(new Date(stream.startedAt), 'MMM d, h:mm a')}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-gray-700/50 p-3 rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-red-500 overflow-hidden">
                                        {stream.user?.image ? (
                                            <Image
                                                src={stream.user.image}
                                                alt={stream.user.name}
                                                width={40}
                                                height={40}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500"></div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold">{stream.user?.name || 'Anonymous Chef'}</p>
                                        <p className="text-xs text-gray-400">Host</p>
                                    </div>
                                </div>
                            </div>

                            {stream.description && (
                                <div className="text-gray-300 whitespace-pre-wrap border-t border-gray-700 pt-6">
                                    {stream.description}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Chat */}
                    <div className="h-[calc(100vh-140px)] sticky top-24">
                        <div className="bg-gray-800 rounded-xl shadow-lg h-full overflow-hidden border border-gray-700">
                            {/* We use a global chat room for platform streams, or per-stream if needed */}
                            <ChatRoom
                                groupSlug="global"
                                currentUserId={session?.user?.email || 'guest'}
                                isLive={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
