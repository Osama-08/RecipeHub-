'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Image from 'next/image';
import UserAvatar from '@/components/community/UserAvatar';
import MembersList from '@/components/community/MembersList';
import ChatRoom from '@/components/community/ChatRoom';
import LiveSessionsList from '@/components/community/LiveSessionsList';
import CreateLiveSessionModal from '@/components/community/CreateLiveSessionModal';
import {
    Users, Crown, Shield, MessageSquare, Video, Settings,
    LogOut, LogIn, Lock, FileText, Plus
} from 'lucide-react';

interface Group {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    coverImageUrl: string | null;
    type: string;
    rules: string | null;
    creator: {
        id: string;
        name: string | null;
        image: string | null;
    };
    _count: {
        members: number;
        posts: number;
    };
    userRole?: string | null;
}

interface GroupPost {
    id: string;
    content: string;
    imageUrl: string | null;
    createdAt: string;
    author: {
        id: string;
        name: string | null;
        image: string | null;
    };
}

type TabType = 'posts' | 'members' | 'chat' | 'sessions' | 'settings';

export default function GroupDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { data: session } = useSession();
    const router = useRouter();
    const [group, setGroup] = useState<Group | null>(null);
    const [posts, setPosts] = useState<GroupPost[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [liveSessions, setLiveSessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newPost, setNewPost] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('posts');
    const [showSessionModal, setShowSessionModal] = useState(false);

    const fetchGroup = useCallback(async () => {
        try {
            const res = await fetch(`/api/groups/${slug}`);
            if (res.ok) {
                const data = await res.json();
                setGroup(data);
            } else {
                router.push('/groups');
            }
        } catch (error) {
            console.error('Error fetching group:', error);
        } finally {
            setIsLoading(false);
        }
    }, [slug, router]);

    const fetchPosts = useCallback(async () => {
        try {
            const res = await fetch(`/api/groups/${slug}/posts`);
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }, [slug]);

    const fetchMembers = useCallback(async () => {
        try {
            const res = await fetch(`/api/groups/${slug}/members`);
            if (res.ok) {
                const data = await res.json();
                setMembers(data);
            }
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    }, [slug]);

    const fetchLiveSessions = useCallback(async () => {
        try {
            const res = await fetch(`/api/groups/${slug}/live-sessions`);
            if (res.ok) {
                const data = await res.json();
                setLiveSessions(data);
            }
        } catch (error) {
            console.error('Error fetching live sessions:', error);
        }
    }, [slug]);

    useEffect(() => {
        fetchGroup();
        fetchPosts();
    }, [fetchGroup, fetchPosts]);

    useEffect(() => {
        if (group && group.userRole) {
            if (activeTab === 'members') {
                fetchMembers();
            } else if (activeTab === 'sessions') {
                fetchLiveSessions();
            }
        }
    }, [activeTab, group, fetchMembers, fetchLiveSessions]);

    const handleJoin = async () => {
        try {
            const res = await fetch(`/api/groups/${slug}/join`, {
                method: 'POST',
            });
            if (res.ok) {
                await fetchGroup();
            }
        } catch (error) {
            console.error('Error joining group:', error);
        }
    };

    const handleLeave = async () => {
        if (!confirm('Are you sure you want to leave this group?')) return;
        try {
            const res = await fetch(`/api/groups/${slug}/leave`, {
                method: 'POST',
            });
            if (res.ok) {
                router.push('/groups');
            }
        } catch (error) {
            console.error('Error leaving group:', error);
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/groups/${slug}/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newPost }),
            });

            if (res.ok) {
                setNewPost('');
                await fetchPosts();
            }
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRoleUpdate = async (userId: string, role: any) => {
        try {
            const res = await fetch(`/api/groups/${slug}/members/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role }),
            });
            if (res.ok) {
                await fetchMembers();
            }
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const handleRemoveMember = async (userId: string, ban: boolean = false) => {
        try {
            const res = await fetch(
                `/api/groups/${slug}/members/${userId}?ban=${ban}`,
                { method: 'DELETE' }
            );
            if (res.ok) {
                await fetchMembers();
                await fetchGroup();
            }
        } catch (error) {
            console.error('Error removing member:', error);
        }
    };

    const handleCreateSession = async (data: any) => {
        const res = await fetch(`/api/groups/${slug}/live-sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            await fetchLiveSessions();
        } else {
            throw new Error('Failed to create session');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (!group) {
        return null;
    }

    const isMember = group.userRole !== null;
    const isAdmin = group.userRole === 'ADMIN';
    const isModerator = group.userRole === 'MODERATOR';

    const tabs = [
        { id: 'posts' as TabType, label: 'Posts', icon: FileText, count: group._count.posts },
        { id: 'members' as TabType, label: 'Members', icon: Users, count: group._count.members },
        { id: 'chat' as TabType, label: 'Chat', icon: MessageSquare },
        { id: 'sessions' as TabType, label: 'Live Sessions', icon: Video },
        ...(isAdmin ? [{ id: 'settings' as TabType, label: 'Settings', icon: Settings }] : []),
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Cover Image */}
            <div className="h-48 bg-gradient-to-r from-purple-500 to-indigo-500 relative">
                {group.coverImageUrl ? (
                    <Image
                        src={group.coverImageUrl}
                        alt={group.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Users className="w-24 h-24 text-white/30" />
                    </div>
                )}
            </div>

            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Group Header */}
                    <div className="bg-white rounded-b-xl shadow-lg p-6 -mt-12 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-bold">{group.name}</h1>
                                    {group.type === 'PRIVATE' && (
                                        <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1">
                                            <Lock className="w-3 h-3" />
                                            Private
                                        </div>
                                    )}
                                </div>
                                <p className="text-gray-600">{group.description || 'No description'}</p>
                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                    <span>{group._count.members} members</span>
                                    <span>•</span>
                                    <span>{group._count.posts} posts</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {!session ? (
                                    <button
                                        onClick={() => router.push('/login')}
                                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 flex items-center gap-2"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Sign In to Join
                                    </button>
                                ) : isMember ? (
                                    <>
                                        <button
                                            onClick={handleLeave}
                                            className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Leave
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleJoin}
                                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 flex items-center gap-2"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Join Group
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tabs */}
                        {isMember && (
                            <div className="mt-6 border-t border-gray-200 pt-4">
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
                                                    ? 'bg-purple-500 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {tab.label}
                                                {tab.count !== undefined && (
                                                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id
                                                        ? 'bg-white/20'
                                                        : 'bg-gray-200'
                                                        }`}>
                                                        {tab.count}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    {isMember ? (
                        <div className="mt-6">
                            {/* Posts Tab */}
                            {activeTab === 'posts' && (
                                <div className="space-y-6">
                                    {/* Create Post */}
                                    <div className="bg-white rounded-xl shadow-md p-6">
                                        <form onSubmit={handleCreatePost}>
                                            <textarea
                                                value={newPost}
                                                onChange={(e) => setNewPost(e.target.value)}
                                                placeholder="Share something with the group..."
                                                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px] resize-none"
                                                disabled={isSubmitting}
                                            />
                                            <div className="mt-3 flex justify-end">
                                                <button
                                                    type="submit"
                                                    disabled={!newPost.trim() || isSubmitting}
                                                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isSubmitting ? 'Posting...' : 'Post'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Posts */}
                                    <div className="space-y-4">
                                        {posts.length === 0 ? (
                                            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                                <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                                <h3 className="text-xl font-bold text-gray-800 mb-2">No posts yet</h3>
                                                <p className="text-gray-600">Be the first to post in this group!</p>
                                            </div>
                                        ) : (
                                            posts.map((post) => (
                                                <div key={post.id} className="bg-white rounded-xl shadow-md p-6">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <UserAvatar user={post.author} size="md" />
                                                        <div>
                                                            <h3 className="font-semibold">{post.author.name || 'Anonymous'}</h3>
                                                            <p className="text-sm text-gray-500">
                                                                {new Date(post.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                                                    {post.imageUrl && (
                                                        <div className="mt-4 rounded-lg overflow-hidden relative h-64 md:h-96">
                                                            <Image
                                                                src={post.imageUrl}
                                                                alt="Post"
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Members Tab */}
                            {activeTab === 'members' && session?.user?.email && (
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <MembersList
                                        members={members}
                                        currentUserId={session.user.email}
                                        isAdmin={isAdmin}
                                        isModerator={isModerator}
                                        groupCreatorId={group.creator.id}
                                        onRoleUpdate={handleRoleUpdate}
                                        onRemoveMember={handleRemoveMember}
                                    />
                                </div>
                            )}

                            {/* Chat Tab */}
                            {activeTab === 'chat' && session?.user?.email && (
                                <ChatRoom
                                    groupSlug={slug}
                                    currentUserId={session.user.email}
                                    memberCount={group._count.members}
                                />
                            )}

                            {/* Live Sessions Tab */}
                            {activeTab === 'sessions' && (
                                <div className="space-y-4">
                                    {isAdmin && (
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => setShowSessionModal(true)}
                                                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 flex items-center gap-2"
                                            >
                                                <Plus className="w-5 h-5" />
                                                Schedule Session
                                            </button>
                                        </div>
                                    )}
                                    <LiveSessionsList sessions={liveSessions} />
                                </div>
                            )}

                            {/* Settings Tab */}
                            {activeTab === 'settings' && isAdmin && (
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h3 className="text-xl font-bold mb-4">Group Settings</h3>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <h4 className="font-semibold mb-2">Group Rules</h4>
                                            <p className="text-gray-600 whitespace-pre-wrap">
                                                {group.rules || 'No rules set'}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
                                            More settings coming soon...
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mt-6 bg-white rounded-xl shadow-md p-12 text-center">
                            <Lock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Join to see content</h3>
                            <p className="text-gray-600">This is a {group.type.toLowerCase()} group. Join to view and participate.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Session Modal */}
            <CreateLiveSessionModal
                isOpen={showSessionModal}
                onClose={() => setShowSessionModal(false)}
                onSubmit={handleCreateSession}
                isAdmin={isAdmin}
            />
        </div>
    );
}
