'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/layout/Header';
import CreatePostForm from '@/components/community/CreatePostForm';
import PostCard from '@/components/community/PostCard';
import Link from 'next/link';
import { Users, MessageSquare } from 'lucide-react';
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

export default function CommunityPage() {
    const { data: session } = useSession();
    const { t } = useLanguage();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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

    // Fetch posts
    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/community/posts');
            const data = await res.json();
            setPosts(data.posts || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

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

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Quick Links */}
                    <div className="flex gap-4 mb-6">
                        <Link
                            href="/groups"
                            className="flex-1 bg-white rounded-xl p-4 text-center hover:shadow-lg transition-shadow border-2 border-purple-100"
                        >
                            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                            <h3 className="font-bold">{t('community.browseGroups')}</h3>
                            <p className="text-sm text-gray-600">{t('community.browseGroupsDesc')}</p>
                        </Link>
                        {session?.user?.role === 'ADMIN' && (
                            <Link
                                href="/community/announcements/create"
                                className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl p-4 text-center hover:shadow-lg transition-shadow"
                            >
                                <Users className="w-8 h-8 mx-auto mb-2" />
                                <h3 className="font-bold">{t('community.createAnnouncement')}</h3>
                                <p className="text-sm text-white/90">{t('community.adminOnly')}</p>
                            </Link>
                        )}
                    </div>


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
                </div>
            </div>
        </div>
    );
}

