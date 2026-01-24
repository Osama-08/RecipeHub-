'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Users, Video } from 'lucide-react';

interface InfluencerCardProps {
    influencer: {
        id: string;
        displayName: string;
        bio: string | null;
        user: {
            image: string | null;
            name: string | null;
        };
        videos: Array<{
            thumbnailUrl: string | null;
        }>;
        _count: {
            videos: number;
        };
    };
}

export default function InfluencerCard({ influencer }: InfluencerCardProps) {
    const thumbnailUrl =
        influencer.videos[0]?.thumbnailUrl ||
        influencer.user.image ||
        '/default-avatar.png';

    return (
        <Link href={`/influencers/${influencer.id}`}>
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
                {/* Thumbnail/Avatar */}
                <div className="relative h-48 w-full bg-gradient-to-r from-purple-200 to-pink-200">
                    <Image
                        src={thumbnailUrl}
                        alt={influencer.displayName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                        <Video className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-semibold text-gray-800">
                            {influencer._count.videos}
                        </span>
                    </div>
                </div>

                {/* Profile Info */}
                <div className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-purple-200">
                            <Image
                                src={influencer.user.image || '/default-avatar.png'}
                                alt={influencer.displayName}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition-colors">
                                {influencer.displayName}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Users className="w-3 h-3" />
                                <span>Influencer</span>
                            </div>
                        </div>
                    </div>

                    {influencer.bio && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {influencer.bio}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
