'use client';

import { useState } from 'react';
import UserAvatar from './UserAvatar';
import { Shield, Crown, MoreVertical, Ban, UserMinus, ChevronUp, ChevronDown } from 'lucide-react';

interface Member {
    id: string;
    userId: string;
    name: string | null;
    email: string;
    image: string | null;
    role: 'ADMIN' | 'MODERATOR' | 'MEMBER';
    status: string;
    joinedAt: string;
}

interface MembersListProps {
    members: Member[];
    currentUserId: string;
    isAdmin: boolean;
    isModerator: boolean;
    groupCreatorId: string;
    onRoleUpdate: (userId: string, newRole: 'ADMIN' | 'MODERATOR' | 'MEMBER') => Promise<void>;
    onRemoveMember: (userId: string, ban?: boolean) => Promise<void>;
}

export default function MembersList({
    members,
    currentUserId,
    isAdmin,
    isModerator,
    groupCreatorId,
    onRoleUpdate,
    onRemoveMember,
}: MembersListProps) {
    const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState<'ALL' | 'ADMIN' | 'MODERATOR' | 'MEMBER'>('ALL');

    // Filter members
    const filteredMembers = members.filter((member) => {
        const matchesSearch = member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === 'ALL' || member.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role: string, isCreator: boolean) => {
        if (isCreator) {
            return (
                <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Creator
                </span>
            );
        }

        switch (role) {
            case 'ADMIN':
                return (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Admin
                    </span>
                );
            case 'MODERATOR':
                return (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Moderator
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                        Member
                    </span>
                );
        }
    };

    const canManageMember = (member: Member) => {
        if (member.userId === groupCreatorId) return false; // Can't manage creator
        if (member.userId === currentUserId) return false; // Can't manage yourself
        return isAdmin || isModerator;
    };

    return (
        <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search members..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value as any)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="ALL">All Roles</option>
                    <option value="ADMIN">Admins</option>
                    <option value="MODERATOR">Moderators</option>
                    <option value="MEMBER">Members</option>
                </select>
            </div>

            {/* Members List */}
            <div className="space-y-2">
                {filteredMembers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No members found
                    </div>
                ) : (
                    filteredMembers.map((member) => {
                        const isCreator = member.userId === groupCreatorId;
                        const isExpanded = expandedMemberId === member.userId;

                        return (
                            <div
                                key={member.userId}
                                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <UserAvatar
                                            user={{
                                                id: member.userId,
                                                name: member.name,
                                                image: member.image,
                                            }}
                                            size="md"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold truncate">
                                                    {member.name || 'Anonymous'}
                                                </h3>
                                                {getRoleBadge(member.role, isCreator)}
                                            </div>
                                            <p className="text-sm text-gray-500 truncate">{member.email}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Joined {new Date(member.joinedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {canManageMember(member) && (
                                        <button
                                            onClick={() =>
                                                setExpandedMemberId(isExpanded ? null : member.userId)
                                            }
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            {isExpanded ? (
                                                <ChevronUp className="w-5 h-5 text-gray-600" />
                                            ) : (
                                                <MoreVertical className="w-5 h-5 text-gray-600" />
                                            )}
                                        </button>
                                    )}
                                </div>

                                {/* Management Options */}
                                {isExpanded && canManageMember(member) && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                                        {isAdmin && (
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Change Role
                                                </label>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => onRoleUpdate(member.userId, 'ADMIN')}
                                                        disabled={member.role === 'ADMIN'}
                                                        className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Make Admin
                                                    </button>
                                                    <button
                                                        onClick={() => onRoleUpdate(member.userId, 'MODERATOR')}
                                                        disabled={member.role === 'MODERATOR'}
                                                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Make Moderator
                                                    </button>
                                                    <button
                                                        onClick={() => onRoleUpdate(member.userId, 'MEMBER')}
                                                        disabled={member.role === 'MEMBER'}
                                                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Make Member
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Remove ${member.name || member.email} from the group?`)) {
                                                        onRemoveMember(member.userId, false);
                                                    }
                                                }}
                                                className="flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-semibold hover:bg-orange-200"
                                            >
                                                <UserMinus className="w-4 h-4" />
                                                Remove
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Ban ${member.name || member.email} from the group?`)) {
                                                        onRemoveMember(member.userId, true);
                                                    }
                                                }}
                                                className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200"
                                            >
                                                <Ban className="w-4 h-4" />
                                                Ban
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                <div className="flex justify-between">
                    <span>Total Members: {members.length}</span>
                    <span>
                        Admins: {members.filter((m) => m.role === 'ADMIN').length} |
                        Moderators: {members.filter((m) => m.role === 'MODERATOR').length} |
                        Members: {members.filter((m) => m.role === 'MEMBER').length}
                    </span>
                </div>
            </div>
        </div>
    );
}
