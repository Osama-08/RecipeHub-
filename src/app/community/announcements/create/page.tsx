'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Image from 'next/image';
import { Megaphone, Image as ImageIcon, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';

export default function CreateAnnouncementPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [showImageInput, setShowImageInput] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Check if user is admin
    const isAdmin = session?.user?.role === 'ADMIN';

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        router.push('/login');
        return null;
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <Lock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
                            <p className="text-gray-600 mb-6">
                                Only administrators can create announcements.
                            </p>
                            <Link
                                href="/community"
                                className="inline-block px-6 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600"
                            >
                                Back to Community
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!content.trim()) {
            setError('Announcement content is required');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/community/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: `📢 ANNOUNCEMENT: ${content}`,
                    imageUrl: imageUrl.trim() || null,
                }),
            });

            if (res.ok) {
                router.push('/community');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to create announcement');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Back Link */}
                    <Link
                        href="/community"
                        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Community
                    </Link>

                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl shadow-lg p-8 mb-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <Megaphone className="w-8 h-8" />
                            <h1 className="text-3xl font-bold">Create Announcement</h1>
                        </div>
                        <p className="text-white/90">
                            Share important updates with the entire community
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                {error}
                            </div>
                        )}

                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                            <p className="font-semibold mb-1">ℹ️ Announcement Tips:</p>
                            <ul className="list-disc list-inside space-y-1 text-blue-600">
                                <li>Announcements will be prefixed with 📢 ANNOUNCEMENT</li>
                                <li>Keep it concise and clear</li>
                                <li>Use announcements for important updates only</li>
                            </ul>
                        </div>

                        {/* Content */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Announcement Content *
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Enter your announcement message..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[150px] resize-y"
                                required
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                {content.length} characters
                            </p>
                        </div>

                        {/* Image URL */}
                        <div className="mb-6">
                            <button
                                type="button"
                                onClick={() => setShowImageInput(!showImageInput)}
                                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-2"
                            >
                                <ImageIcon className="w-5 h-5" />
                                {showImageInput ? 'Remove Image' : 'Add Image (Optional)'}
                            </button>

                            {showImageInput && (
                                <div>
                                    <input
                                        type="url"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    {imageUrl && (
                                        <div className="mt-3 relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
                                            <Image
                                                src={imageUrl}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                                onError={(e) => {
                                                    // Note: next/image doesn't handle hide on error as easily, 
                                                    // but we'll stick to standard Image usage
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !content.trim()}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                <Megaphone className="w-5 h-5" />
                                {isSubmitting ? 'Publishing...' : 'Publish Announcement'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
