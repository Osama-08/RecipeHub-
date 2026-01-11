'use client';

import { useState } from 'react';
import UserAvatar from './UserAvatar';
import { MessageSquare, Send, Trash2 } from 'lucide-react';

interface Comment {
    id: string;
    content: string;
    author: {
        id: string;
        name: string | null;
        image: string | null;
    };
    createdAt: string;
}

interface CommentSectionProps {
    postId: string;
    comments: Comment[];
    currentUserId?: string;
    onAddComment: (content: string) => Promise<void>;
    onDeleteComment: (commentId: string) => Promise<void>;
}

export default function CommentSection({
    postId,
    comments,
    currentUserId,
    onAddComment,
    onDeleteComment,
}: CommentSectionProps) {
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            await onAddComment(newComment.trim());
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm('Delete this comment?')) return;

        try {
            await onDeleteComment(commentId);
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-4">
            {/* Comments Header */}
            <div className="flex items-center gap-2 text-gray-700">
                <MessageSquare className="w-5 h-5" />
                <h4 className="font-semibold">
                    Comments ({comments.length})
                </h4>
            </div>

            {/* Add Comment Form */}
            {currentUserId && (
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={isSubmitting}
                    />
                    <button
                        type="submit"
                        disabled={!newComment.trim() || isSubmitting}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                </form>
            )}

            {/* Comments List */}
            <div className="space-y-3">
                {comments.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 text-sm">
                        No comments yet. Be the first to comment!
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <UserAvatar user={comment.author} size="sm" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-sm">
                                                {comment.author.name || 'Anonymous'}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {formatTime(comment.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-gray-800 text-sm break-words">
                                            {comment.content}
                                        </p>
                                    </div>
                                    {currentUserId === comment.author.id && (
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="p-1 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                                            title="Delete comment"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
