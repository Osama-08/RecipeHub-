import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/groups/[slug]/leave - Leave a group
export async function POST(
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

        // Cannot leave if you're the creator
        if (group.creatorId === user.id) {
            return NextResponse.json(
                { error: 'Group creator cannot leave. Delete the group instead.' },
                { status: 400 }
            );
        }

        const membership = await prisma.groupMembership.findUnique({
            where: {
                userId_groupId: {
                    userId: user.id,
                    groupId: group.id,
                },
            },
        });

        if (!membership) {
            return NextResponse.json(
                { error: 'You are not a member of this group' },
                { status: 400 }
            );
        }

        await prisma.groupMembership.delete({
            where: {
                userId_groupId: {
                    userId: user.id,
                    groupId: group.id,
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error leaving group:', error);
        return NextResponse.json(
            { error: 'Failed to leave group' },
            { status: 500 }
        );
    }
}
