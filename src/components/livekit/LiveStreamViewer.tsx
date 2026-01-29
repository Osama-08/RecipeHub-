'use client';

import { useState } from 'react';
import {
    LiveKitRoom,
    VideoConference,
    RoomAudioRenderer,
    useParticipants,
} from '@livekit/components-react';
import { Users, UserPlus, Video } from 'lucide-react';
import Image from 'next/image';

interface LiveStreamViewerProps {
    roomName: string;
    token: string;
    title: string;
    hostName: string;
    hostImage?: string;
    canJoinAsCohost?: boolean;
    onRequestCohost?: () => void;
}

function ViewerInfo({ hostName, hostImage }: { hostName: string; hostImage?: string }) {
    const participants = useParticipants();

    return (
        <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
            <div className="flex items-center gap-3">
                {hostImage && (
                    <Image
                        src={hostImage}
                        alt={hostName}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                    />
                )}
                <div>
                    <p className="font-semibold text-white text-sm">{hostName}</p>
                    <div className="flex items-center gap-2 text-gray-300 text-xs">
                        <Users className="w-3 h-3" />
                        <span>{participants.length} watching</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LiveStreamViewer({
    roomName,
    token,
    title,
    hostName,
    hostImage,
    canJoinAsCohost,
    onRequestCohost,
}: LiveStreamViewerProps) {
    const [isJoiningAsCohost, setIsJoiningAsCohost] = useState(false);

    const handleJoinAsCohost = async () => {
        if (!onRequestCohost) return;
        setIsJoiningAsCohost(true);
        try {
            await onRequestCohost();
        } catch (error) {
            console.error('Failed to join as co-host:', error);
            alert('Failed to join as co-host. Please try again.');
        } finally {
            setIsJoiningAsCohost(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                            </div>
                            <span className="text-white font-bold">LIVE</span>
                        </div>
                        <div className="h-6 w-px bg-gray-600" />
                        <h1 className="text-white font-semibold text-lg">{title}</h1>
                    </div>

                    {canJoinAsCohost && (
                        <button
                            onClick={handleJoinAsCohost}
                            disabled={isJoiningAsCohost}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                        >
                            <UserPlus className="w-4 h-4" />
                            {isJoiningAsCohost ? 'Joining...' : 'Join as Co-host'}
                        </button>
                    )}
                </div>
            </div>

            {/* LiveKit Video Conference (Viewer Mode) */}
            <LiveKitRoom
                video={false}
                audio={false}
                token={token}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
                data-lk-theme="default"
                className="h-[calc(100vh-80px)] relative"
                style={{
                    '--lk-bg': '#111827',
                    '--lk-fg': '#ffffff',
                } as React.CSSProperties}
            >
                <ViewerInfo hostName={hostName} hostImage={hostImage} />
                <div className="h-full" style={{ position: 'relative' }}>
                    <VideoConference
                        chatMessageFormatter={undefined}
                    />
                </div>
                <RoomAudioRenderer />
            </LiveKitRoom>
        </div>
    );
}
