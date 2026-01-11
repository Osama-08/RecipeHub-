'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/layout/Header';
import Image from 'next/image';
import YouTubePlayer from '@/components/live/YouTubePlayer';
import ChatRoom from '@/components/community/ChatRoom';
import { Users, Clock, Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function GroupLiveSessionPage({ params }: { params: Promise<{ slug: string, sessionId: string }> }) {
    const { slug, sessionId } = use(params);
    const { data: session } = useSession();
    const [liveSession, setLiveSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchSession = useCallback(async () => {
        try {
            const res = await fetch(`/api/groups/${slug}/live-sessions/${sessionId}`);
            const data = await res.json();
            setLiveSession(data);
        } catch (error) {
            console.error('Error fetching session:', error);
        } finally {
            setLoading(false);
        }
    }, [slug, sessionId]);

    useEffect(() => {
        fetchSession();
    }, [fetchSession]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
        );
    }

    if (!liveSession) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-3xl font-bold mb-4">Session Not Found</h1>
                    <p className="text-gray-600">This live session doesn&apos;t exist or is no longer available.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto px-4 py-6">
                <Link
                    href={`/groups/${slug}`}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to {liveSession.group?.name || 'Group'}
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Video & Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <YouTubePlayer
                            videoId={liveSession.youtubeVideoId}
                            title={liveSession.title}
                        />

                        <div className="bg-white rounded-xl p-8 shadow-md">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${liveSession.status === 'LIVE' ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {liveSession.status}
                                        </span>
                                        <h1 className="text-3xl font-bold text-gray-900">{liveSession.title}</h1>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                                {liveSession.status === 'SCHEDULED'
                                                    ? `Scheduled for ${format(new Date(liveSession.scheduledAt), 'MMM d, h:mm a')}`
                                                    : `Started ${format(new Date(liveSession.startedAt || liveSession.createdAt), 'MMM d, h:mm a')}`
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-200">
                                        {liveSession.host?.image ? (
                                            <Image
                                                src={liveSession.host.image}
                                                alt={liveSession.host.name}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-500"></div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-bold">{liveSession.host?.name || 'Anonymous Chef'}</p>
                                        <p className="text-xs text-gray-500">Session Host</p>
                                    </div>
                                </div>
                            </div>

                            {liveSession.description && (
                                <div className="text-gray-700 whitespace-pre-wrap border-t border-gray-100 pt-8 leading-relaxed">
                                    {liveSession.description}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Group Chat */}
                    <div className="h-[calc(100vh-140px)] sticky top-24">
                        <div className="bg-white rounded-xl shadow-lg h-full overflow-hidden border border-gray-200">
                            <ChatRoom
                                groupSlug={slug}
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
