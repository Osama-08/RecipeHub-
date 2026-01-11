'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import MessageBubble from './MessageBubble';
import { Send, Image as ImageIcon, Users } from 'lucide-react';

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

interface ChatRoomProps {
    groupSlug: string;
    currentUserId: string;
    memberCount?: number;
    isLive?: boolean;
}

export default function ChatRoom({ groupSlug, currentUserId, memberCount, isLive = false }: ChatRoomProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [showImageInput, setShowImageInput] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch messages
    const fetchMessages = useCallback(async () => {
        try {
            const res = await fetch(`/api/groups/${groupSlug}/messages?limit=50`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages || []);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setIsLoading(false);
        }
    }, [groupSlug]);

    // Start polling for new messages
    useEffect(() => {
        fetchMessages();

        // Poll every 3 seconds for new messages
        pollingIntervalRef.current = setInterval(() => {
            fetchMessages();
        }, 3000);

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [fetchMessages]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() && !imageUrl.trim()) return;

        setIsSending(true);

        try {
            const res = await fetch(`/api/groups/${groupSlug}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newMessage.trim(),
                    imageUrl: imageUrl.trim() || null,
                }),
            });

            if (res.ok) {
                const newMsg = await res.json();
                setMessages((prev) => [...prev, newMsg]);
                setNewMessage('');
                setImageUrl('');
                setShowImageInput(false);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-xl border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-800">Group Chat</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{memberCount ?? 0} members</span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <p className="text-lg font-semibold mb-2">No messages yet</p>
                        <p className="text-sm">Be the first to send a message!</p>
                    </div>
                ) : (
                    <>
                        {messages.map((message) => (
                            <MessageBubble
                                key={message.id}
                                message={message}
                                isOwnMessage={message.author.id === currentUserId}
                                currentUserId={currentUserId}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <form onSubmit={handleSendMessage} className="space-y-3">
                    {showImageInput && (
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Paste image URL..."
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        />
                    )}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setShowImageInput(!showImageInput)}
                            className={`p-3 rounded-lg transition-colors ${showImageInput
                                ? 'bg-purple-100 text-purple-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <ImageIcon className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            disabled={isSending}
                        />
                        <button
                            type="submit"
                            disabled={(!newMessage.trim() && !imageUrl.trim()) || isSending}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Send className="w-5 h-5" />
                            {isSending ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
