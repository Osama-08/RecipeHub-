'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Image from 'next/image';
import { Users, Globe, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { slugify } from '@/lib/slugify';

export default function CreateGroupPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'PUBLIC' as 'PUBLIC' | 'PRIVATE',
        coverImageUrl: '',
        rules: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Redirect if not authenticated
    if (status === 'unauthenticated') {
        router.push('/login');
        return null;
    }

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) {
            setError('Group name is required');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to create group');
                return;
            }

            // Redirect to the new group
            router.push(`/groups/${data.slug}`);
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const previewSlug = formData.name ? slugify(formData.name) : '';

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Back Link */}
                    <Link
                        href="/groups"
                        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Groups
                    </Link>

                    {/* Header */}
                    <div className="bg-white rounded-xl shadow-md p-8 mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="w-8 h-8 text-purple-600" />
                            <h1 className="text-3xl font-bold">Create New Group</h1>
                        </div>
                        <p className="text-gray-600">
                            Start a community around your favorite recipes and cooking styles!
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Group Name */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Group Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Pizza Lovers, Vegan Cooking Club"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                            {previewSlug && (
                                <p className="mt-2 text-sm text-gray-500">
                                    URL: <span className="font-mono text-purple-600">/groups/{previewSlug}</span>
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Tell people what this group is about..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px] resize-y"
                            />
                        </div>

                        {/* Group Type */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Group Type *
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'PUBLIC' })}
                                    className={`p-4 rounded-lg border-2 transition-all ${formData.type === 'PUBLIC'
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Globe className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                                    <div className="font-semibold">Public</div>
                                    <div className="text-sm text-gray-600">Anyone can join</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'PRIVATE' })}
                                    className={`p-4 rounded-lg border-2 transition-all ${formData.type === 'PRIVATE'
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Lock className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                                    <div className="font-semibold">Private</div>
                                    <div className="text-sm text-gray-600">Invite only</div>
                                </button>
                            </div>
                        </div>

                        {/* Cover Image URL */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Cover Image URL
                            </label>
                            <input
                                type="url"
                                value={formData.coverImageUrl}
                                onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            {formData.coverImageUrl && (
                                <div className="mt-3 relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                                    <Image
                                        src={formData.coverImageUrl}
                                        alt="Cover preview"
                                        fill
                                        className="object-cover"
                                        onError={(e) => {
                                            // next/image hide on error is tricky, but we'll stick to it
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Rules */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Group Rules (Optional)
                            </label>
                            <textarea
                                value={formData.rules}
                                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                                placeholder="e.g., Be respectful, No spam, Share recipes only..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px] resize-y"
                            />
                        </div>

                        {/* Submit Button */}
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
                                disabled={isSubmitting || !formData.name.trim()}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Group'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
