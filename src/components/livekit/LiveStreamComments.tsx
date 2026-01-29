'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
}

interface LiveStreamCommentsProps {
    sessionId: string;
}

export default function LiveStreamComments({ sessionId }: LiveStreamCommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingComments, setFetchingComments] = useState(true);
    const commentsEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`/api/live/${sessionId}/comments`, {
                cache: 'no-store',
            });
            if (res.ok) {
                const data = await res.json();
                setComments(data.comments || []);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setFetchingComments(false);
        }
    }, [sessionId]);

    useEffect(() => {
        fetchComments();
        // Poll for new comments every 3 seconds
        const interval = setInterval(fetchComments, 3000);
        return () => clearInterval(interval);
    }, [fetchComments]);

    const prevCommentCountRef = useRef(comments.length);

    useEffect(() => {
        // Only scroll to bottom if there are new comments (not on initial load or polling)
        if (comments.length > prevCommentCountRef.current) {
            scrollToBottom();
        }
        prevCommentCountRef.current = comments.length;
    }, [comments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/live/${sessionId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newComment }),
            });

            if (res.ok) {
                const data = await res.json();
                setComments([...comments, data.comment]);
                setNewComment('');
                scrollToBottom();
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-lg">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <h3 className="font-bold text-lg">Live Comments</h3>
                <p className="text-sm text-gray-500">{comments.length} comments</p>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {fetchingComments ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                ) : comments.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <p className="text-sm">Be the first to comment!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2 group">
                            {/* Avatar */}
                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-orange-400 to-red-500">
                                {comment.user.image ? (
                                    <Image
                                        src={comment.user.image}
                                        alt={comment.user.name || 'User'}
                                        width={32}
                                        height={32}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                                        {(comment.user.name || 'A')[0].toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Comment Content */}
                            <div className="flex-1 bg-gray-50 rounded-lg p-2 group-hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm">
                                        {comment.user.name || 'Anonymous'}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(comment.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-800">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={commentsEndRef} />
            </div>

            {/* Comment Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        maxLength={500}
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !newComment.trim()}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
