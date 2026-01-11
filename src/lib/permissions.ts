import { prisma } from '@/lib/prisma';
import { Post, Group, GroupMembership } from '@prisma/client';

/**
 * Check if a user can delete a post
 */
export async function canDeletePost(
    userId: string,
    post: Post
): Promise<boolean> {
    // User can delete their own post
    if (post.authorId === userId) {
        return true;
    }

    // Admin can delete any post
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
    });

    return user?.role === 'ADMIN';
}

/**
 * Check if a user can moderate a group (admin or moderator)
 */
export async function canModerateGroup(
    userId: string,
    groupId: string
): Promise<boolean> {
    const membership = await prisma.groupMembership.findUnique({
        where: {
            userId_groupId: {
                userId,
                groupId,
            },
        },
    });

    if (!membership) return false;

    return membership.role === 'ADMIN' || membership.role === 'MODERATOR';
}

/**
 * Check if a user is a group admin
 */
export async function isGroupAdmin(
    userId: string,
    groupId: string
): Promise<boolean> {
    const membership = await prisma.groupMembership.findUnique({
        where: {
            userId_groupId: {
                userId,
                groupId,
            },
        },
    });

    return membership?.role === 'ADMIN';
}

/**
 * Check if a user can access a group
 */
export async function canAccessGroup(
    userId: string | null | undefined,
    group: Group
): Promise<boolean> {
    // Public groups are accessible to everyone
    if (group.type === 'PUBLIC') {
        return true;
    }

    // Private groups require membership
    if (!userId) return false;

    const membership = await prisma.groupMembership.findUnique({
        where: {
            userId_groupId: {
                userId,
                groupId: group.id,
            },
        },
    });

    return membership !== null && membership.status === 'ACTIVE';
}

/**
 * Check if a user is a member of a group
 */
export async function isGroupMember(
    userId: string,
    groupId: string
): Promise<boolean> {
    const membership = await prisma.groupMembership.findUnique({
        where: {
            userId_groupId: {
                userId,
                groupId,
            },
        },
    });

    return membership !== null && membership.status === 'ACTIVE';
}

/**
 * Get user's role in a group
 */
export async function getUserGroupRole(
    userId: string,
    groupId: string
): Promise<'ADMIN' | 'MODERATOR' | 'MEMBER' | null> {
    const membership = await prisma.groupMembership.findUnique({
        where: {
            userId_groupId: {
                userId,
                groupId,
            },
        },
    });

    return membership?.role || null;
}
