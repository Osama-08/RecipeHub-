'use client';

import { useState } from 'react';
import UserAvatar from './UserAvatar';
import Image from 'next/image';
import { Heart, MessageCircle, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
    post: {
        id: string;
        content: string;
        imageUrl: string | null;
        createdAt: Date | string;
        author: {
            id: string;
            name: string | null;
            image: string | null;
        };
        _count?: {
            likes: number;
            comments: number;
        };
        likes?: Array<{ userId: string }>;
    };
    currentUserId?: string;
    onLike?: (postId: string) => Promise<void>;
    onDelete?: (postId: string) => Promise<void>;
    onCommentClick?: (postId: string) => void;
}

export default function PostCard({
    post,
    currentUserId,
    onLike,
    onDelete,
    onCommentClick,
}: PostCardProps) {
    const [isLiking, setIsLiking] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isLiked = post.likes?.some((like) => like.userId === currentUserId);
    const canDelete = currentUserId === post.author.id;
    const likeCount = post._count?.likes || post.likes?.length || 0;
    const commentCount = post._count?.comments || 0;

    const createdAt =
        typeof post.createdAt === 'string'
            ? new Date(post.createdAt)
            : post.createdAt;

    const handleLike = async () => {
        if (!onLike || isLiking) return;
        setIsLiking(true);
        try {
            await onLike(post.id);
        } finally {
            setIsLiking(false);
        }
    };

    const handleDelete = async () => {
        if (!onDelete || isDeleting) return;
        if (!confirm('Are you sure you want to delete this post?')) return;

        setIsDeleting(true);
        try {
            await onDelete(post.id);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <UserAvatar user={post.author} size="md" />
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {post.author.name || 'Anonymous'}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {formatDistanceToNow(createdAt, { addSuffix: true })}
                        </p>
                    </div>
                </div>

                {canDelete && onDelete && (
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Content */}
            <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

            {/* Image */}
            {post.imageUrl && (
                <div className="mb-4 relative w-full h-96 rounded-lg overflow-hidden">
                    <Image
                        src={post.imageUrl}
                        alt="Post image"
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                <button
                    onClick={handleLike}
                    disabled={isLiking || !onLike}
                    className={`flex items-center gap-2 transition-colors ${isLiked
                        ? 'text-red-500'
                        : 'text-gray-500 hover:text-red-500'
                        }`}
                >
                    <Heart
                        className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
                    />
                    <span className="font-medium">{likeCount}</span>
                </button>

                <button
                    onClick={() => onCommentClick?.(post.id)}
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">{commentCount}</span>
                </button>
            </div>
        </div>
    );
}
