'use client';

import { Calendar, Clock, Users as UsersIcon, Play, Video } from 'lucide-react';
import Image from 'next/image';

interface LiveSession {
    id: string;
    title: string;
    description: string | null;
    scheduledAt: string;
    startedAt: string | null;
    endedAt: string | null;
    status: 'SCHEDULED' | 'LIVE' | 'ENDED' | 'CANCELLED';
    youtubeVideoId?: string | null;
    host: {
        id: string;
        name: string | null;
        image: string | null;
    };
}

interface LiveSessionCardProps {
    session: LiveSession;
    onJoin?: () => void;
}

export default function LiveSessionCard({ session, onJoin }: LiveSessionCardProps) {
    const getStatusBadge = () => {
        switch (session.status) {
            case 'LIVE':
                return (
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold animate-pulse flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        LIVE NOW
                    </span>
                );
            case 'SCHEDULED':
                return (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Scheduled
                    </span>
                );
            case 'ENDED':
                return (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                        Ended
                    </span>
                );
            case 'CANCELLED':
                return (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        Cancelled
                    </span>
                );
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const thumbnailUrl = session.youtubeVideoId
        ? `https://img.youtube.com/vi/${session.youtubeVideoId}/mqdefault.jpg`
        : null;

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
            {thumbnailUrl && (
                <div className="relative h-40 bg-gray-100">
                    <Image
                        src={thumbnailUrl}
                        alt={session.title}
                        fill
                        className="object-cover"
                    />
                    {session.status === 'LIVE' && (
                        <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold animate-pulse">
                            LIVE
                        </div>
                    )}
                </div>
            )}
            <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Video className="w-5 h-5 text-purple-600" />
                            <h3 className="font-bold text-lg">{session.title}</h3>
                        </div>
                        {session.description && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {session.description}
                            </p>
                        )}
                    </div>
                    {getStatusBadge()}
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <UsersIcon className="w-4 h-4" />
                        <span>Hosted by {session.host.name || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                            {session.status === 'SCHEDULED' && `Starts ${formatDate(session.scheduledAt)}`}
                            {session.status === 'LIVE' && 'Live now'}
                            {session.status === 'ENDED' && `Ended ${formatDate(session.endedAt!)}`}
                            {session.status === 'CANCELLED' && 'Cancelled'}
                        </span>
                    </div>
                </div>

                {session.status === 'LIVE' && onJoin && (
                    <button
                        onClick={onJoin}
                        className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 flex items-center justify-center gap-2 transition-all"
                    >
                        <Play className="w-5 h-5" />
                        Join Live Session
                    </button>
                )}

                {session.status === 'SCHEDULED' && (
                    <button
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 text-gray-600 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Calendar className="w-5 h-5" />
                        Scheduled
                    </button>
                )}

                {session.status === 'ENDED' && (
                    <button
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 text-gray-600 rounded-lg font-semibold cursor-not-allowed"
                    >
                        Session Ended
                    </button>
                )}
            </div>
        </div>
    );
}
