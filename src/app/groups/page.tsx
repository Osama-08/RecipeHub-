'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Lock, Globe, Plus, Search } from 'lucide-react';

interface Group {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    coverImageUrl: string | null;
    type: string;
    creator: {
        id: string;
        name: string | null;
        image: string | null;
    };
    _count: {
        members: number;
        posts: number;
    };
}

export default function GroupsPage() {
    const { data: session } = useSession();
    const [groups, setGroups] = useState<Group[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'ALL' | 'PUBLIC' | 'PRIVATE'>('ALL');

    const fetchGroups = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (filterType !== 'ALL') {
                params.append('type', filterType);
            }

            const res = await fetch(`/api/groups?${params}`);
            const data = await res.json();
            setGroups(data || []);
        } catch (error) {
            console.error('Error fetching groups:', error);
        } finally {
            setIsLoading(false);
        }
    }, [filterType]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const filteredGroups = groups.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Users className="w-12 h-12 mx-auto mb-3" />
                        <h1 className="text-4xl font-bold mb-2">Cooking Groups</h1>
                        <p className="text-lg text-white/90">
                            Join communities, share recipes, and cook together!
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Search and Filter */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search groups..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilterType('ALL')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterType === 'ALL'
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilterType('PUBLIC')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${filterType === 'PUBLIC'
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <Globe className="w-4 h-4" />
                                    Public
                                </button>
                                <button
                                    onClick={() => setFilterType('PRIVATE')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${filterType === 'PRIVATE'
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <Lock className="w-4 h-4" />
                                    Private
                                </button>
                            </div>
                        </div>

                        {session && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <Link
                                    href="/groups/create"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                    Create New Group
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Groups Grid */}
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                            <p className="text-gray-600 mt-4">Loading groups...</p>
                        </div>
                    ) : filteredGroups.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                No groups found
                            </h3>
                            <p className="text-gray-600">
                                {searchQuery
                                    ? 'Try a different search term'
                                    : 'Be the first to create a group!'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredGroups.map((group) => (
                                <Link
                                    key={group.id}
                                    href={`/groups/${group.slug}`}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
                                >
                                    {/* Cover Image */}
                                    <div className="h-32 bg-gradient-to-r from-purple-400 to-indigo-400 relative">
                                        {group.coverImageUrl ? (
                                            <Image
                                                src={group.coverImageUrl}
                                                alt={group.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Users className="w-12 h-12 text-white/50" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            {group.type === 'PRIVATE' ? (
                                                <div className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-white text-sm">
                                                    <Lock className="w-3 h-3" />
                                                    Private
                                                </div>
                                            ) : (
                                                <div className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-white text-sm">
                                                    <Globe className="w-3 h-3" />
                                                    Public
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 transition-colors">
                                            {group.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {group.description || 'No description'}
                                        </p>

                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                <span>{group._count.members} members</span>
                                            </div>
                                            <div>{group._count.posts} posts</div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
