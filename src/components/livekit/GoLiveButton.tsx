'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Video, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface GoLiveButtonProps {
    isInfluencer: boolean;
}

export default function GoLiveButton({ isInfluencer }: GoLiveButtonProps) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    if (!isInfluencer) return null;

    const handleGoLive = async () => {
        if (!title.trim()) {
            toast.error('Please enter a title for your live stream');
            return;
        }

        setIsCreating(true);

        try {
            // Create live session
            const response = await fetch('/api/livekit/create-room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description }),
            });

            if (!response.ok) {
                throw new Error('Failed to create live stream');
            }

            const data = await response.json();
            toast.success('Live stream created! Redirecting...');

            // Redirect to live stream page using session ID
            router.push(`/live/${data.session.id}`);
        } catch (error) {
            console.error('Error creating live stream:', error);
            toast.error('Failed to create live stream. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
                <Video className="w-5 h-5" />
                Go Live
            </button>

            {/* Go Live Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <Video className="w-6 h-6 text-red-600" />
                                </div>
                                <h2 className="text-2xl font-bold">Go Live</h2>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={isCreating}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Stream Title *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Cooking Delicious Pasta!"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder:text-gray-400"
                                    maxLength={100}
                                    disabled={isCreating}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description (optional)
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Tell viewers what you'll be cooking..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px] resize-y text-gray-900 placeholder:text-gray-400"
                                    maxLength={500}
                                    disabled={isCreating}
                                />
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> Your browser will request camera and microphone permissions
                                    when you go live. Make sure to allow them to start streaming.
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                    disabled={isCreating}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleGoLive}
                                    disabled={isCreating || !title.trim()}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                >
                                    <Video className="w-5 h-5" />
                                    {isCreating ? 'Creating...' : 'Start Streaming'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
