'use client';

import { Play } from 'lucide-react';
import Image from 'next/image';

interface RecordedStreamPlayerProps {
    recordingUrl: string;
    title: string;
    description?: string;
    hostName: string;
    hostImage?: string;
    startedAt: string;
    duration?: string;
}

export default function RecordedStreamPlayer({
    recordingUrl,
    title,
    description,
    hostName,
    hostImage,
    startedAt,
    duration,
}: RecordedStreamPlayerProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Video Player */}
            <div className="relative aspect-video bg-gray-900">
                <video
                    controls
                    className="w-full h-full"
                    poster={`https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&size=800&background=6366f1&color=fff`}
                >
                    <source src={recordingUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Stream Info */}
            <div className="p-6">
                <div className="flex items-start gap-4">
                    {hostImage && (
                        <Image
                            src={hostImage}
                            alt={hostName}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full"
                        />
                    )}
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
                        {description && (
                            <p className="text-gray-600 mb-3">{description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="font-medium text-gray-700">{hostName}</span>
                            <span>•</span>
                            <span>{formatDate(startedAt)}</span>
                            {duration && (
                                <>
                                    <span>•</span>
                                    <span>{duration}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
