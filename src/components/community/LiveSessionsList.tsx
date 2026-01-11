'use client';

import { useState } from 'react';
import LiveSessionCard from './LiveSessionCard';
import { Video, Calendar, Clock } from 'lucide-react';

interface LiveSession {
    id: string;
    title: string;
    description: string | null;
    scheduledAt: string;
    startedAt: string | null;
    endedAt: string | null;
    status: 'SCHEDULED' | 'LIVE' | 'ENDED' | 'CANCELLED';
    host: {
        id: string;
        name: string | null;
        image: string | null;
    };
}

interface LiveSessionsListProps {
    sessions: LiveSession[];
    onJoinSession?: (sessionId: string) => void;
}

export default function LiveSessionsList({ sessions, onJoinSession }: LiveSessionsListProps) {
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'LIVE' | 'SCHEDULED' | 'PAST'>('ALL');

    const filteredSessions = sessions.filter((session) => {
        if (filterStatus === 'ALL') return true;
        if (filterStatus === 'LIVE') return session.status === 'LIVE';
        if (filterStatus === 'SCHEDULED') return session.status === 'SCHEDULED';
        if (filterStatus === 'PAST') return session.status === 'ENDED' || session.status === 'CANCELLED';
        return true;
    });

    // Sort: LIVE first, then SCHEDULED, then ENDED/CANCELLED
    const sortedSessions = [...filteredSessions].sort((a, b) => {
        const statusOrder = { LIVE: 0, SCHEDULED: 1, ENDED: 2, CANCELLED: 3 };
        const statusDiff = statusOrder[a.status] - statusOrder[b.status];
        if (statusDiff !== 0) return statusDiff;

        // Within same status, sort by date
        const dateA = new Date(a.scheduledAt).getTime();
        const dateB = new Date(b.scheduledAt).getTime();
        return a.status === 'ENDED' ? dateB - dateA : dateA - dateB;
    });

    const liveCount = sessions.filter((s) => s.status === 'LIVE').length;
    const scheduledCount = sessions.filter((s) => s.status === 'SCHEDULED').length;

    return (
        <div className="space-y-4">
            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                    onClick={() => setFilterStatus('ALL')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${filterStatus === 'ALL'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    All ({sessions.length})
                </button>
                <button
                    onClick={() => setFilterStatus('LIVE')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${filterStatus === 'LIVE'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    <Video className="w-4 h-4" />
                    Live ({liveCount})
                </button>
                <button
                    onClick={() => setFilterStatus('SCHEDULED')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${filterStatus === 'SCHEDULED'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    <Calendar className="w-4 h-4" />
                    Scheduled ({scheduledCount})
                </button>
                <button
                    onClick={() => setFilterStatus('PAST')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${filterStatus === 'PAST'
                        ? 'bg-gray-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    <Clock className="w-4 h-4" />
                    Past
                </button>
            </div>

            {/* Sessions Grid */}
            {sortedSessions.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <Video className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No sessions found</h3>
                    <p className="text-gray-600">
                        {filterStatus === 'LIVE' && 'No live sessions at the moment'}
                        {filterStatus === 'SCHEDULED' && 'No upcoming sessions scheduled'}
                        {filterStatus === 'PAST' && 'No past sessions'}
                        {filterStatus === 'ALL' && 'No sessions yet'}
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {sortedSessions.map((session) => (
                        <LiveSessionCard
                            key={session.id}
                            session={session}
                            onJoin={() => {
                                if (onJoinSession) {
                                    onJoinSession(session.id);
                                } else {
                                    window.location.href = `live-sessions/${session.id}`;
                                }
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
