'use client';

import { useState, useEffect, useCallback } from 'react';
import { ThumbsUp, ThumbsDown, Users, Eye } from 'lucide-react';

interface LiveStreamEngagementProps {
    sessionId: string;
    viewerCount: number;
}

export default function LiveStreamEngagement({ sessionId, viewerCount }: LiveStreamEngagementProps) {
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [userLike, setUserLike] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch(`/api/live/${sessionId}/like`, {
                cache: 'no-store',
            });
            if (res.ok) {
                const data = await res.json();
                setLikes(data.likes || 0);
                setDislikes(data.dislikes || 0);
                setUserLike(data.userLike);
            }
        } catch (error) {
            console.error('Error fetching engagement stats:', error);
        }
    }, [sessionId]);

    useEffect(() => {
        fetchStats();
        // Poll every 5 seconds
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, [fetchStats]);

    const handleLikeToggle = async (isLike: boolean) => {
        if (loading) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/live/${sessionId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isLike }),
            });

            if (res.ok) {
                await fetchStats(); // Refresh stats
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            {/* Viewer Count */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <Users className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Watching Now</p>
                        <p className="text-xl font-bold">{viewerCount}</p>
                    </div>
                </div>
            </div>

            {/* Like/Dislike Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => handleLikeToggle(true)}
                    disabled={loading}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${userLike === true
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-50 hover:bg-green-50 text-gray-700'
                        } disabled:opacity-50`}
                >
                    <ThumbsUp className={`w-6 h-6 ${userLike === true ? 'fill-current' : ''}`} />
                    <span className="text-lg font-bold">{likes}</span>
                    <span className="text-xs">Likes</span>
                </button>

                <button
                    onClick={() => handleLikeToggle(false)}
                    disabled={loading}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${userLike === false
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-50 hover:bg-red-50 text-gray-700'
                        } disabled:opacity-50`}
                >
                    <ThumbsDown className={`w-6 h-6 ${userLike === false ? 'fill-current' : ''}`} />
                    <span className="text-lg font-bold">{dislikes}</span>
                    <span className="text-xs">Dislikes</span>
                </button>
            </div>

            {/* Engagement Stats */}
            <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Eye className="w-4 h-4" />
                        <span>Total Engagement</span>
                    </div>
                    <span className="font-bold">{likes + dislikes}</span>
                </div>
            </div>
        </div>
    );
}
