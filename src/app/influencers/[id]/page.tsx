'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/layout/Header';
import SocialMediaButtons from '@/components/community/SocialMediaButtons';
import VideoUploadModal from '@/components/community/VideoUploadModal';
import BecomeInfluencerModal from '@/components/community/BecomeInfluencerModal';
import Image from 'next/image';
import { Star, Video, Trash2, Edit, Play } from 'lucide-react';
import { use } from 'react';

interface InfluencerVideo {
    id: string;
    title: string;
    description: string | null;
    videoType: string;
    youtubeId: string | null;
    videoUrl: string | null;
    thumbnailUrl: string | null;
    views: number;
    createdAt: string;
}

interface InfluencerData {
    id: string;
    displayName: string;
    bio: string | null;
    facebookUrl: string | null;
    instagramUrl: string | null;
    tiktokUrl: string | null;
    youtubeUrl: string | null;
    user: {
        id: string;
        name: string | null;
        image: string | null;
        email: string;
    };
    videos: InfluencerVideo[];
    _count: {
        videos: number;
    };
}

export default function InfluencerDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const { data: session } = useSession();
    const [influencer, setInfluencer] = useState<InfluencerData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<InfluencerVideo | null>(null);
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user?.email) {
            setCurrentUserEmail(session.user.email);
        }
    }, [session]);

    useEffect(() => {
        fetchInfluencer();
    }, [resolvedParams.id]);

    const fetchInfluencer = async () => {
        try {
            const res = await fetch(`/api/influencers/${resolvedParams.id}`);
            const data = await res.json();
            setInfluencer(data.influencer);
        } catch (error) {
            console.error('Error fetching influencer:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePostVideo = async (videoData: any) => {
        try {
            const res = await fetch('/api/influencers/videos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(videoData),
            });

            if (res.ok) {
                await fetchInfluencer();
            }
        } catch (error) {
            console.error('Error posting video:', error);
        }
    };

    const handleDeleteVideo = async (videoId: string) => {
        if (!confirm('Are you sure you want to delete this video?')) return;

        try {
            const res = await fetch(`/api/influencers/videos/${videoId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                await fetchInfluencer();
            }
        } catch (error) {
            console.error('Error deleting video:', error);
        }
    };

    const handleUpdateProfile = async (data: any) => {
        try {
            const res = await fetch('/api/influencers/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                await fetchInfluencer();
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading influencer...</p>
                </div>
            </div>
        );
    }

    if (!influencer) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Influencer not found</h1>
                </div>
            </div>
        );
    }

    const isOwner = currentUserEmail === influencer.user.email;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto flex items-center gap-6">
                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                            <Image
                                src={influencer.user.image || '/default-avatar.png'}
                                alt={influencer.displayName}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-4xl font-bold">{influencer.displayName}</h1>
                                {isOwner && (
                                    <button
                                        onClick={() => setShowEditModal(true)}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-white/90 mb-3">
                                <div className="flex items-center gap-1">
                                    <Video className="w-4 h-4" />
                                    <span>{influencer._count.videos} videos</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4" />
                                    <span>Influencer</span>
                                </div>
                            </div>
                            {influencer.bio && (
                                <p className="text-white/90 text-sm md:text-base">{influencer.bio}</p>
                            )}
                        </div>
                    </div>

                    {/* Social Media & Actions */}
                    <div className="max-w-4xl mx-auto mt-6 flex flex-wrap items-center gap-4">
                        <SocialMediaButtons
                            facebookUrl={influencer.facebookUrl}
                            instagramUrl={influencer.instagramUrl}
                            tiktokUrl={influencer.tiktokUrl}
                            youtubeUrl={influencer.youtubeUrl}
                        />
                        {isOwner && (
                            <button
                                onClick={() => setShowVideoModal(true)}
                                className="px-6 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                            >
                                <Video className="w-5 h-5" />
                                <span>Post Video</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Videos Grid */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Videos</h2>

                    {influencer.videos.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <Video className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No videos yet</h3>
                            <p className="text-gray-600">
                                {isOwner
                                    ? 'Start sharing your cooking videos with the community!'
                                    : 'This influencer hasn\'t posted any videos yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {influencer.videos.map((video) => (
                                <div
                                    key={video.id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
                                    onClick={() => setSelectedVideo(video)}
                                >
                                    {/* Video Thumbnail */}
                                    <div className="relative h-48 bg-gray-200">
                                        {video.thumbnailUrl ? (
                                            <Image
                                                src={video.thumbnailUrl}
                                                alt={video.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <Video className="w-12 h-12 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>

                                    {/* Video Info */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-800 mb-1 line-clamp-2">
                                            {video.title}
                                        </h3>
                                        {video.description && (
                                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                                {video.description}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">
                                                {video.views} views
                                            </span>
                                            {isOwner && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteVideo(video.id);
                                                    }}
                                                    className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Video Player Modal */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedVideo(null)}
                >
                    <div
                        className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {selectedVideo.videoType === 'youtube' && selectedVideo.youtubeId ? (
                            <div className="aspect-video">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
                                    title={selectedVideo.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            <div className="aspect-video bg-black flex items-center justify-center">
                                <p className="text-white">Video player not available</p>
                            </div>
                        )}
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {selectedVideo.title}
                            </h2>
                            {selectedVideo.description && (
                                <p className="text-gray-600">{selectedVideo.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <VideoUploadModal
                isOpen={showVideoModal}
                onClose={() => setShowVideoModal(false)}
                onSubmit={handlePostVideo}
            />

            {influencer && (
                <BecomeInfluencerModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSubmit={handleUpdateProfile}
                    initialData={influencer}
                    mode="edit"
                />
            )}
        </div>
    );
}
