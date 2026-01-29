'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    LiveKitRoom,
    VideoConference,
    RoomAudioRenderer,
    ControlBar,
    useTracks,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { Video, Users, Clock, X } from 'lucide-react';

interface LiveStreamHostProps {
    roomName: string;
    sessionId: string;
    token: string;
    title: string;
    onEndStream: () => Promise<void>;
}

export default function LiveStreamHost({
    roomName,
    sessionId,
    token,
    title,
    onEndStream,
}: LiveStreamHostProps) {
    const router = useRouter();
    const [duration, setDuration] = useState(0);
    const [isEnding, setIsEnding] = useState(false);
    const [showEndConfirm, setShowEndConfirm] = useState(false);

    // Duration timer
    useEffect(() => {
        const interval = setInterval(() => {
            setDuration((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatDuration = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleEndStream = async () => {
        setIsEnding(true);
        try {
            await onEndStream();
            router.push('/live'); // Redirect to live streams page
        } catch (error) {
            console.error('Failed to end stream:', error);
            alert('Failed to end stream. Please try again.');
        } finally {
            setIsEnding(false);
            setShowEndConfirm(false);
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

                    <div className="flex items-center gap-6">
                        {/* Duration */}
                        <div className="flex items-center gap-2 text-gray-300">
                            <Clock className="w-4 h-4" />
                            <span className="font-mono text-sm">{formatDuration(duration)}</span>
                        </div>

                        {/* End Stream Button */}
                        <button
                            onClick={() => setShowEndConfirm(true)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                            disabled={isEnding}
                        >
                            {isEnding ? 'Ending...' : 'End Stream'}
                        </button>
                    </div>
                </div>
            </div>

            {/* LiveKit Video Conference */}
            <LiveKitRoom
                video={true}
                audio={true}
                token={token}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
                data-lk-theme="default"
                className="h-[calc(100vh-80px)]"
                style={{
                    '--lk-bg': '#111827',
                    '--lk-fg': '#ffffff',
                } as React.CSSProperties}
            >
                {/* Clean video conference without extra controls */}
                <div className="h-full" style={{ position: 'relative' }}>
                    <VideoConference
                        chatMessageFormatter={undefined}
                    />
                </div>
                <RoomAudioRenderer />
            </LiveKitRoom>

            {/* End Stream Confirmation Modal */}
            {showEndConfirm && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6 border border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-red-500/20 rounded-full">
                                <Video className="w-6 h-6 text-red-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">End Live Stream?</h2>
                        </div>

                        <p className="text-gray-300 mb-6">
                            Are you sure you want to end this live stream? This will disconnect all viewers and
                            save the recording.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowEndConfirm(false)}
                                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                                disabled={isEnding}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEndStream}
                                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                                disabled={isEnding}
                            >
                                {isEnding ? 'Ending...' : 'End Stream'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
