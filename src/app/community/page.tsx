'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/layout/Header';
import CreatePostForm from '@/components/community/CreatePostForm';
import PostCard from '@/components/community/PostCard';
import InfluencerCard from '@/components/community/InfluencerCard';
import BecomeInfluencerModal from '@/components/community/BecomeInfluencerModal';
import Link from 'next/link';
import { Users, MessageSquare, Video, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Post {
    id: string;
    content: string;
    imageUrl: string | null;
    createdAt: string;
    author: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
    };
    likes: Array<{ userId: string }>;
    _count: {
        likes: number;
        comments: number;
    };
}

interface Influencer {
    id: string;
    displayName: string;
    bio: string | null;
    user: {
        id: string;
        name: string | null;
        image: string | null;
        email: string;
    };
    videos: Array<{
        thumbnailUrl: string | null;
    }>;
    _count: {
        videos: number;
    };
}

type TabType = 'posts' | 'groups' | 'influencers';

export default function CommunityPage() {
    const { data: session } = useSession();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<TabType>('posts');
    const [posts, setPosts] = useState<Post[]>([]);
    const [influencers, setInfluencers] = useState<Influencer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [showInfluencerModal, setShowInfluencerModal] = useState(false);
    const [userInfluencer, setUserInfluencer] = useState<any>(null);

    // Fetch current user ID
    useEffect(() => {
        if (session?.user?.email) {
            fetch('/api/auth/session')
                .then((res) => res.json())
                .then((data) => {
                    if (data.user?.id) {
                        setCurrentUserId(data.user.id);
                    }
                });
        }
    }, [session]);

    // Fetch user's influencer profile
    useEffect(() => {
        if (session?.user) {
            fetch('/api/influencers/profile')
                .then((res) => res.json())
                .then((data) => {
                    setUserInfluencer(data.influencer);
                })
                .catch((error) => console.error('Error fetching influencer profile:', error));
        }
    }, [session]);

    // Fetch posts
    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/community/posts');
            const data = await res.json();
            setPosts(data.posts || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // Fetch influencers
    const fetchInfluencers = async () => {
        try {
            const res = await fetch('/api/influencers');
            const data = await res.json();
            setInfluencers(data.influencers || []);
        } catch (error) {
            console.error('Error fetching influencers:', error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            if (activeTab === 'posts') {
                await fetchPosts();
            } else if (activeTab === 'influencers') {
                await fetchInfluencers();
            }
            setIsLoading(false);
        };
        loadData();
    }, [activeTab]);

    const handleCreatePost = async (content: string, imageUrl: string | null) => {
        try {
            const res = await fetch('/api/community/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, imageUrl }),
            });

            if (res.ok) {
                await fetchPosts();
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleLike = async (postId: string) => {
        try {
            await fetch(`/api/community/posts/${postId}/like`, {
                method: 'POST',
            });
            await fetchPosts();
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleDelete = async (postId: string) => {
        try {
            await fetch(`/api/community/posts/${postId}`, {
                method: 'DELETE',
            });
            setPosts(posts.filter((p) => p.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleCreateInfluencerProfile = async (data: any) => {
        try {
            const res = await fetch('/api/influencers/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                const result = await res.json();
                setUserInfluencer(result.influencer);
                await fetchInfluencers();
            }
        } catch (error) {
            console.error('Error creating influencer profile:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <Users className="w-12 h-12 mx-auto mb-3" />
                        <h1 className="text-4xl font-bold mb-2">{t('community.title')}</h1>
                        <p className="text-lg text-white/90">
                            {t('community.subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="container mx-auto px-4">
                    <div className="flex gap-1 max-w-3xl mx-auto">
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`flex-1 px-6 py-4 font-semibold transition-all ${activeTab === 'posts'
                                    ? 'text-purple-600 border-b-2 border-purple-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                <span>Posts</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('groups')}
                            className={`flex-1 px-6 py-4 font-semibold transition-all ${activeTab === 'groups'
                                    ? 'text-purple-600 border-b-2 border-purple-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Users className="w-5 h-5" />
                                <span>Groups</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('influencers')}
                            className={`flex-1 px-6 py-4 font-semibold transition-all ${activeTab === 'influencers'
                                    ? 'text-purple-600 border-b-2 border-purple-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Star className="w-5 h-5" />
                                <span>Influencers</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Posts Tab */}
                    {activeTab === 'posts' && (
                        <>
                            {/* Admin Announcement Link */}
                            {session?.user?.role === 'ADMIN' && (
                                <Link
                                    href="/community/announcements/create"
                                    className="block bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl p-4 text-center hover:shadow-lg transition-shadow"
                                >
                                    <Users className="w-8 h-8 mx-auto mb-2" />
                                    <h3 className="font-bold">{t('community.createAnnouncement')}</h3>
                                    <p className="text-sm text-white/90">{t('community.adminOnly')}</p>
                                </Link>
                            )}

                            {/* Create Post */}
                            {session ? (
                                <CreatePostForm onSubmit={handleCreatePost} />
                            ) : (
                                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                                    <p className="text-gray-600 mb-4">
                                        {t('community.signInPrompt')}
                                    </p>
                                    <Link
                                        href="/login"
                                        className="inline-block px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600"
                                    >
                                        {t('community.signIn')}
                                    </Link>
                                </div>
                            )}

                            {/* Posts Feed */}
                            {isLoading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                                    <p className="text-gray-600 mt-4">{t('community.loadingPosts')}</p>
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                    <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {t('community.noPostsTitle')}
                                    </h3>
                                    <p className="text-gray-600">
                                        {t('community.noPostsDesc')}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {posts.map((post) => (
                                        <PostCard
                                            key={post.id}
                                            post={post}
                                            currentUserId={currentUserId || undefined}
                                            onLike={handleLike}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* Groups Tab */}
                    {activeTab === 'groups' && (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <Users className="w-16 h-16 mx-auto text-purple-500 mb-4" />
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                Browse Groups
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Join cooking groups and connect with other food enthusiasts
                            </p>
                            <Link
                                href="/groups"
                                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600"
                            >
                                View All Groups
                            </Link>
                        </div>
                    )}

                    {/* Influencers Tab */}
                    {activeTab === 'influencers' && (
                        <>
                            {/* Become Influencer Button */}
                            {session && !userInfluencer && (
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 text-center">
                                    <Star className="w-12 h-12 mx-auto mb-3" />
                                    <h3 className="text-xl font-bold mb-2">Become an Influencer</h3>
                                    <p className="text-white/90 mb-4">
                                        Share your cooking expertise with the world!
                                    </p>
                                    <button
                                        onClick={() => setShowInfluencerModal(true)}
                                        className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                                    >
                                        Get Started
                                    </button>
                                </div>
                            )}

                            {/* Influencers Grid */}
                            {isLoading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                                    <p className="text-gray-600 mt-4">Loading influencers...</p>
                                </div>
                            ) : influencers.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                    <Video className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        No Influencers Yet
                                    </h3>
                                    <p className="text-gray-600">
                                        Be the first to share your cooking journey!
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {influencers.map((influencer) => (
                                        <InfluencerCard key={influencer.id} influencer={influencer} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Become Influencer Modal */}
            <BecomeInfluencerModal
                isOpen={showInfluencerModal}
                onClose={() => setShowInfluencerModal(false)}
                onSubmit={handleCreateInfluencerProfile}
                mode="create"
            />
        </div>
    );
}

