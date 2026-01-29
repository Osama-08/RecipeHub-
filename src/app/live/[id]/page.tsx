"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import { Loader2, Radio, X } from "lucide-react";
import { toast } from "sonner";
import LiveStreamComments from "@/components/livekit/LiveStreamComments";
import LiveStreamEngagement from "@/components/livekit/LiveStreamEngagement";
import Image from "next/image";

interface LiveSession {
    id: string;
    title: string;
    description?: string;
    roomName: string;
    endedAt?: string;
    viewerCount: number;
    user: {
        id: string;
        name: string;
        image?: string;
    };
}

export default function LiveStreamPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { data: session, status: sessionStatus } = useSession();

    const [liveSession, setLiveSession] = useState<LiveSession | null>(null);
    const [token, setToken] = useState<string>('');
    const [role, setRole] = useState<'host' | 'cohost' | 'viewer'>('viewer');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [isEnding, setIsEnding] = useState(false);

    useEffect(() => {
        if (sessionStatus === 'loading') return;
        if (sessionStatus === 'unauthenticated') {
            router.push('/login');
            return;
        }

        async function fetchSessionAndToken() {
            try {
                // Fetch session details by ID
                const sessionRes = await fetch(`/api/live/${id}`);
                if (!sessionRes.ok) throw new Error('Failed to fetch session');

                const { session: currentSession } = await sessionRes.json();

                if (!currentSession) {
                    setError('Live stream not found');
                    return;
                }

                // Check if this is a new LiveKit stream or old YouTube stream
                if (!currentSession.roomName) {
                    setError('This stream uses the old format. Please use the new live streaming system.');
                    return;
                }

                if (currentSession.endedAt) {
                    setError('This live stream has ended');
                    if (currentSession.recordingUrl) {
                        toast.error('Stream has ended. Recording may be available soon.');
                    }
                    return;
                }

                setLiveSession(currentSession);

                // Get LiveKit token
                const tokenRes = await fetch('/api/livekit/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        roomName: currentSession.roomName,
                        role: 'viewer', // Default to viewer
                    }),
                });

                if (!tokenRes.ok) {
                    const errorData = await tokenRes.json();
                    throw new Error(errorData.error || 'Failed to get access token');
                }

                const tokenData = await tokenRes.json();
                setToken(tokenData.token);
                setRole(tokenData.role);
            } catch (err: unknown) {
                console.error('Error fetching session:', err);
                const message = err instanceof Error ? err.message : 'Unknown error';
                setError(message);
            } finally {
                setLoading(false);
            }
        }

        fetchSessionAndToken();
    }, [id, sessionStatus, router]);

    const handleEndStream = async () => {
        if (!liveSession) return;
        setIsEnding(true);

        try {
            const res = await fetch(`/api/live/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success('Stream ended successfully!');
                router.push('/live');
            } else {
                throw new Error('Failed to end stream');
            }
        } catch (error) {
            console.error('Error ending stream:', error);
            toast.error('Failed to end stream');
        } finally {
            setIsEnding(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg">Loading stream...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Stream Not Available</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/live')}
                        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Browse Live Streams
                    </button>
                </div>
            </div>
        );
    }

    const isHost = liveSession && session?.user?.id && liveSession.user.id === session.user.id;

    // Debug logging
    console.log('Host check:', {
        hasLiveSession: !!liveSession,
        sessionUserId: session?.user?.id,
        liveSessionUserId: liveSession?.user.id,
        isHost
    });

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Modern Header */}
            <header className="bg-gray-800 border-b border-gray-700">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/live')}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                ← Back
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500 rounded-full">
                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                    <span className="text-white text-sm font-bold">LIVE</span>
                                </div>
                                <h1 className="text-xl font-bold text-white">{liveSession?.title}</h1>
                            </div>
                        </div>

                        {isHost && (
                            <button
                                onClick={handleEndStream}
                                disabled={isEnding}
                                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 font-semibold"
                            >
                                {isEnding ? 'Ending...' : 'End Stream'}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content - Modern Grid Layout */}
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Video Player (Larger) */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Video Player */}
                        <div className="bg-black rounded-xl overflow-hidden aspect-video">
                            {token && liveSession ? (
                                <LiveKitRoom
                                    video={role === 'host'}
                                    audio={role === 'host'}
                                    token={token}
                                    serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
                                    data-lk-theme="default"
                                    className="h-full"
                                    style={{
                                        '--lk-bg': '#000000',
                                        '--lk-fg': '#ffffff',
                                    } as React.CSSProperties}
                                >
                                    <VideoConference chatMessageFormatter={undefined} />
                                    <RoomAudioRenderer />
                                </LiveKitRoom>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                                </div>
                            )}
                        </div>

                        {/* Stream Info */}
                        <div className="bg-gray-800 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                {/* Host Avatar */}
                                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-orange-400 to-red-500">
                                    {liveSession?.user.image ? (
                                        <Image
                                            src={liveSession.user.image}
                                            alt={liveSession.user.name || 'Host'}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                                            {(liveSession?.user.name || 'H')[0].toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                {/* Host Info */}
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-white mb-1">
                                        {liveSession?.title}
                                    </h2>
                                    <p className="text-gray-400">{liveSession?.user.name}</p>
                                    {liveSession?.description && (
                                        <p className="text-gray-300 mt-2">{liveSession.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-4">
                        {/* Engagement Stats */}
                        {liveSession && (
                            <LiveStreamEngagement
                                sessionId={liveSession.id}
                                viewerCount={liveSession.viewerCount}
                            />
                        )}

                        {/* Comments */}
                        <div className="h-[600px]">
                            {liveSession && <LiveStreamComments sessionId={liveSession.id} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
