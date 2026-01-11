import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { isGroupAdmin, canModerateGroup } from '@/lib/permissions';

// Update member role
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string; userId: string }> }
) {
    try {
        const { slug, userId } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const group = await prisma.group.findUnique({
            where: { slug: slug },
        });

        if (!group) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 });
        }

        // Only admins can update roles
        const isAdmin = await isGroupAdmin(currentUser.id, group.id);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Only admins can update member roles' }, { status: 403 });
        }

        const { role } = await request.json();

        // Validate role
        if (!['ADMIN', 'MODERATOR', 'MEMBER'].includes(role)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        // Check if target user is the group creator
        if (userId === group.creatorId) {
            return NextResponse.json({ error: 'Cannot change role of group creator' }, { status: 400 });
        }

        // Update the member's role
        const updatedMembership = await prisma.groupMembership.update({
            where: {
                userId_groupId: {
                    userId: userId,
                    groupId: group.id,
                },
            },
            data: { role },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            member: {
                userId: updatedMembership.user.id,
                name: updatedMembership.user.name,
                email: updatedMembership.user.email,
                image: updatedMembership.user.image,
                role: updatedMembership.role,
                status: updatedMembership.status,
                joinedAt: updatedMembership.joinedAt,
            },
        });
    } catch (error) {
        console.error('Error updating member role:', error);
        return NextResponse.json(
            { error: 'Failed to update member role' },
            { status: 500 }
        );
    }
}

// Remove/kick member
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string; userId: string }> }
) {
    try {
        const { slug, userId } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const group = await prisma.group.findUnique({
            where: { slug: slug },
        });

        if (!group) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 });
        }

        // Check if user can moderate (admin or moderator)
        const canModerate = await canModerateGroup(currentUser.id, group.id);
        if (!canModerate) {
            return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
        }

        // Cannot remove group creator
        if (userId === group.creatorId) {
            return NextResponse.json({ error: 'Cannot remove group creator' }, { status: 400 });
        }

        // Get ban parameter from query
        const { searchParams } = new URL(request.url);
        const shouldBan = searchParams.get('ban') === 'true';

        if (shouldBan) {
            // Ban the member (set status to BANNED)
            await prisma.groupMembership.update({
                where: {
                    userId_groupId: {
                        userId: userId,
                        groupId: group.id,
                    },
                },
                data: { status: 'BANNED' },
            });
        } else {
            // Remove the member completely
            await prisma.groupMembership.delete({
                where: {
                    userId_groupId: {
                        userId: userId,
                        groupId: group.id,
                    },
                },
            });
        }

        return NextResponse.json({
            success: true,
            message: shouldBan ? 'Member banned successfully' : 'Member removed successfully',
        });
    } catch (error) {
        console.error('Error removing member:', error);
        return NextResponse.json(
            { error: 'Failed to remove member' },
            { status: 500 }
        );
    }
}
