'use client';

import { useState } from 'react';
import { X, Youtube, Upload } from 'lucide-react';

interface VideoUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        title: string;
        description: string;
        videoType: 'youtube' | 'uploaded';
        youtubeId?: string;
        videoUrl?: string;
        thumbnailUrl?: string;
    }) => Promise<void>;
}

export default function VideoUploadModal({
    isOpen,
    onClose,
    onSubmit,
}: VideoUploadModalProps) {
    const [activeTab, setActiveTab] = useState<'youtube' | 'upload'>('youtube');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const extractYoutubeId = (url: string): string | null => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (activeTab === 'youtube') {
                const youtubeId = extractYoutubeId(youtubeUrl);
                if (!youtubeId) {
                    alert('Invalid YouTube URL');
                    setIsSubmitting(false);
                    return;
                }

                await onSubmit({
                    title,
                    description,
                    videoType: 'youtube',
                    youtubeId,
                    thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
                });
            } else {
                // For uploaded videos, you'll need to implement file upload with UploadThing
                // This is a simplified version
                alert('Video upload feature coming soon!');
            }

            // Reset form
            setTitle('');
            setDescription('');
            setYoutubeUrl('');
            setVideoFile(null);
            onClose();
        } catch (error) {
            console.error('Error uploading video:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Post a Video</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('youtube')}
                        className={`flex-1 px-6 py-3 font-semibold transition-colors ${activeTab === 'youtube'
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Youtube className="w-5 h-5" />
                            <span>YouTube Video</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`flex-1 px-6 py-3 font-semibold transition-colors ${activeTab === 'upload'
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Upload className="w-5 h-5" />
                            <span>Upload Video</span>
                        </div>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Video Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter video title"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            placeholder="Describe your video..."
                        />
                    </div>

                    {/* YouTube Tab Content */}
                    {activeTab === 'youtube' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                YouTube Video URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Paste the full YouTube video URL
                            </p>
                        </div>
                    )}

                    {/* Upload Tab Content */}
                    {activeTab === 'upload' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Upload Video File <span className="text-red-500">*</span>
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                <p className="text-gray-600 mb-2">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-sm text-gray-500">MP4, WebM (max 32MB)</p>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                    id="video-upload"
                                />
                                <label
                                    htmlFor="video-upload"
                                    className="mt-4 inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 cursor-pointer transition-colors"
                                >
                                    Choose File
                                </label>
                                {videoFile && (
                                    <p className="mt-2 text-sm text-green-600">
                                        Selected: {videoFile.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

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
                            disabled={
                                isSubmitting ||
                                !title ||
                                (activeTab === 'youtube' ? !youtubeUrl : !videoFile)
                            }
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? 'Posting...' : 'Post Video'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
