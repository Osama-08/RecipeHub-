'use client';

import { useState } from 'react';

interface Emoji {
    emoji: string;
    label: string;
}

const COMMON_EMOJIS: Emoji[] = [
    { emoji: '👍', label: 'Thumbs up' },
    { emoji: '❤️', label: 'Heart' },
    { emoji: '😂', label: 'Laughing' },
    { emoji: '😮', label: 'Wow' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '🎉', label: 'Party' },
    { emoji: '🔥', label: 'Fire' },
    { emoji: '👏', label: 'Clap' },
];

interface EmojiPickerProps {
    onEmojiSelect: (emoji: string) => void;
    userReactions?: string[]; // Emojis the current user has reacted with
}

export default function EmojiPicker({ onEmojiSelect, userReactions = [] }: EmojiPickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleEmojiClick = (emoji: string) => {
        onEmojiSelect(emoji);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                title="React"
            >
                😊 React
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Emoji Popup */}
                    <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-20 min-w-[200px]">
                        <div className="grid grid-cols-4 gap-1">
                            {COMMON_EMOJIS.map(({ emoji, label }) => {
                                const isActive = userReactions.includes(emoji);
                                return (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => handleEmojiClick(emoji)}
                                        className={`text-2xl p-2 rounded hover:bg-gray-100 transition-colors ${isActive ? 'bg-purple-50 ring-2 ring-purple-500' : ''
                                            }`}
                                        title={label}
                                    >
                                        {emoji}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
