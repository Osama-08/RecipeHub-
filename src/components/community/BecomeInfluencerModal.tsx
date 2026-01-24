'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface BecomeInfluencerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        displayName: string;
        bio: string;
        facebookUrl: string;
        instagramUrl: string;
        tiktokUrl: string;
        youtubeUrl: string;
    }) => Promise<void>;
    initialData?: {
        displayName: string;
        bio: string | null;
        facebookUrl: string | null;
        instagramUrl: string | null;
        tiktokUrl: string | null;
        youtubeUrl: string | null;
    };
    mode: 'create' | 'edit';
}

export default function BecomeInfluencerModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    mode,
}: BecomeInfluencerModalProps) {
    const [displayName, setDisplayName] = useState(initialData?.displayName || '');
    const [bio, setBio] = useState(initialData?.bio || '');
    const [facebookUrl, setFacebookUrl] = useState(initialData?.facebookUrl || '');
    const [instagramUrl, setInstagramUrl] = useState(initialData?.instagramUrl || '');
    const [tiktokUrl, setTiktokUrl] = useState(initialData?.tiktokUrl || '');
    const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrl || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit({
                displayName,
                bio,
                facebookUrl,
                instagramUrl,
                tiktokUrl,
                youtubeUrl,
            });
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {mode === 'create' ? 'Become an Influencer' : 'Edit Profile'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Display Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Display Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter your display name"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Bio
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    {/* Social Media Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Social Media Links (Optional)
                        </h3>

                        {/* Facebook */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Facebook Profile URL
                            </label>
                            <input
                                type="url"
                                value={facebookUrl}
                                onChange={(e) => setFacebookUrl(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="https://facebook.com/yourprofile"
                            />
                        </div>

                        {/* Instagram */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Instagram Profile URL
                            </label>
                            <input
                                type="url"
                                value={instagramUrl}
                                onChange={(e) => setInstagramUrl(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                placeholder="https://instagram.com/yourprofile"
                            />
                        </div>

                        {/* TikTok */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                TikTok Profile URL
                            </label>
                            <input
                                type="url"
                                value={tiktokUrl}
                                onChange={(e) => setTiktokUrl(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                                placeholder="https://tiktok.com/@yourprofile"
                            />
                        </div>

                        {/* YouTube */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                YouTube Channel URL
                            </label>
                            <input
                                type="url"
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="https://youtube.com/@yourchannel"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !displayName}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting
                                ? 'Saving...'
                                : mode === 'create'
                                    ? 'Create Profile'
                                    : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
