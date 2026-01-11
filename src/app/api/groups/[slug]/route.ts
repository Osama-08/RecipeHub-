import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canAccessGroup, isGroupAdmin } from '@/lib/permissions';

// GET /api/groups/[slug] - Get group details
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const session = await getServerSession(authOptions);
        let user = null;

        if (session?.user?.email) {
            user = await prisma.user.findUnique({
                where: { email: session.user.email },
            });
        }

        const group = await prisma.group.findUnique({
            where: { slug: slug },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                _count: {
                    select: {
                        members: true,
                        posts: true,
                    },
                },
            },
        });

        if (!group) {
            return NextResponse.json(
                { error: 'Group not found' },
                { status: 404 }
            );
        }

        // Check access permissions
        const hasAccess = await canAccessGroup(user?.id, group);

        if (!hasAccess) {
            return NextResponse.json(
                { error: 'You do not have access to this group' },
                { status: 403 }
            );
        }

        // Get user's role in group if authenticated
        let userRole = null;
        if (user) {
            const membership = await prisma.groupMembership.findUnique({
                where: {
                    userId_groupId: {
                        userId: user.id,
                        groupId: group.id,
                    },
                },
            });
            userRole = membership?.role || null;
        }

        return NextResponse.json({
            ...group,
            userRole,
        });
    } catch (error) {
        console.error('Error fetching group:', error);
        return NextResponse.json(
            { error: 'Failed to fetch group' },
            { status: 500 }
        );
    }
}

// PUT /api/groups/[slug] - Update group
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const group = await prisma.group.findUnique({
            where: { slug: slug },
        });

        if (!group) {
            return NextResponse.json(
                { error: 'Group not found' },
                { status: 404 }
            );
        }

        // Check if user is admin
        const isAdmin = await isGroupAdmin(user.id, group.id);

        if (!isAdmin) {
            return NextResponse.json(
                { error: 'Only group admins can update the group' },
                { status: 403 }
            );
        }

        const { name, description, coverImageUrl, rules, type } = await req.json();

        const updatedGroup = await prisma.group.update({
            where: { id: group.id },
            data: {
                name: name?.trim() || group.name,
                description: description?.trim() || group.description,
                coverImageUrl: coverImageUrl || group.coverImageUrl,
                rules: rules?.trim() || group.rules,
                type: type || group.type,
            },
        });

        return NextResponse.json(updatedGroup);
    } catch (error) {
        console.error('Error updating group:', error);
        return NextResponse.json(
            { error: 'Failed to update group' },
            { status: 500 }
        );
    }
}

// DELETE /api/groups/[slug] - Delete group
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const group = await prisma.group.findUnique({
            where: { slug: slug },
        });

        if (!group) {
            return NextResponse.json(
                { error: 'Group not found' },
                { status: 404 }
            );
        }

        // Only creator can delete group
        if (group.creatorId !== user.id) {
            return NextResponse.json(
                { error: 'Only the group creator can delete the group' },
                { status: 403 }
            );
        }

        await prisma.group.delete({
            where: { id: group.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting group:', error);
        return NextResponse.json(
            { error: 'Failed to delete group' },
            { status: 500 }
        );
    }
}
