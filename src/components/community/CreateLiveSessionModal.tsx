'use client';

import { useState } from 'react';
import { X, Calendar, Video } from 'lucide-react';

interface CreateLiveSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        title: string;
        description: string;
        scheduledAt: string;
        videoType: string;
    }) => Promise<void>;
    isAdmin: boolean;
}

export default function CreateLiveSessionModal({
    isOpen,
    onClose,
    onSubmit,
    isAdmin,
}: CreateLiveSessionModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        scheduledAt: '',
        videoType: 'youtube',
        videoUrl: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen || !isAdmin) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }

        if (!formData.scheduledAt) {
            setError('Scheduled time is required');
            return;
        }

        // Check if scheduled time is in the future
        const scheduledDate = new Date(formData.scheduledAt);
        if (scheduledDate < new Date()) {
            setError('Scheduled time must be in the future');
            return;
        }

        setIsSubmitting(true);

        try {
            await onSubmit(formData);
            // Reset form
            setFormData({
                title: '',
                description: '',
                scheduledAt: '',
                videoType: 'youtube',
                videoUrl: '',
            });
            onClose();
        } catch (err) {
            setError('Failed to create session. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Video className="w-6 h-6 text-purple-600" />
                        <h2 className="text-2xl font-bold">Schedule Live Session</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Session Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Pizza Making 101"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Tell members what this session is about..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px] resize-y"
                        />
                    </div>

                    {/* Scheduled Date/Time */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Scheduled Date & Time *
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.scheduledAt}
                            onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    {/* YouTube URL */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            YouTube Live URL or Video ID
                        </label>
                        <input
                            type="text"
                            value={formData.videoUrl}
                            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                            placeholder="e.g., https://www.youtube.com/watch?v=..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Paste the link to your YouTube Live stream
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            <Calendar className="w-5 h-5" />
                            {isSubmitting ? 'Creating...' : 'Schedule Session'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
