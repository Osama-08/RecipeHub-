'use client';

import UserAvatar from './UserAvatar';
import Image from 'next/image';

interface Message {
    id: string;
    content: string;
    imageUrl: string | null;
    author: {
        id: string;
        name: string | null;
        image: string | null;
    };
    createdAt: string;
    readBy: string[];
}

interface MessageBubbleProps {
    message: Message;
    isOwnMessage: boolean;
    currentUserId: string;
}

export default function MessageBubble({ message, isOwnMessage, currentUserId }: MessageBubbleProps) {
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
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
            {!isOwnMessage && (
                <div className="flex-shrink-0">
                    <UserAvatar user={message.author} size="sm" />
                </div>
            )}

            <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
                {!isOwnMessage && (
                    <span className="text-xs font-semibold text-gray-700 mb-1 px-1">
                        {message.author.name || 'Anonymous'}
                    </span>
                )}

                <div
                    className={`rounded-2xl px-4 py-2 ${isOwnMessage
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                        }`}
                >
                    {message.content && (
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    )}

                    {message.imageUrl && (
                        <div className="mt-2 relative w-64 h-48 rounded-lg overflow-hidden">
                            <Image
                                src={message.imageUrl}
                                alt="Attachment"
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 mt-1 px-1">
                    <span className="text-xs text-gray-500">
                        {formatTime(message.createdAt)}
                    </span>
                    {isOwnMessage && message.readBy.length > 1 && (
                        <span className="text-xs text-gray-500">
                            • Seen by {message.readBy.length - 1}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
