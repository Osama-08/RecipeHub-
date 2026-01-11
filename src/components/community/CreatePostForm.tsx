'use client';

import { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';

interface CreatePostFormProps {
    onSubmit: (content: string, imageUrl: string | null) => Promise<void>;
}

export default function CreatePostForm({ onSubmit }: CreatePostFormProps) {
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [showImageInput, setShowImageInput] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(content, imageUrl || null);
            setContent('');
            setImageUrl('');
            setShowImageInput(false);
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind? Share a recipe tip, cooking story, or food photo..."
                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[120px] resize-none"
                disabled={isSubmitting}
            />

            {showImageInput && (
                <div className="mt-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Image URL"
                            className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            disabled={isSubmitting}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setShowImageInput(false);
                                setImageUrl('');
                            }}
                            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    {imageUrl && (
                        <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden">
                            <Image
                                src={imageUrl}
                                alt="Preview"
                                fill
                                className="object-cover"
                                onError={() => setImageUrl('')}
                            />
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between mt-4">
                <button
                    type="button"
                    onClick={() => setShowImageInput(!showImageInput)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={isSubmitting}
                >
                    <ImageIcon className="w-5 h-5" />
                    <span>Add Image</span>
                </button>

                <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Posting...' : 'Post'}
                </button>
            </div>
        </form>
    );
}
