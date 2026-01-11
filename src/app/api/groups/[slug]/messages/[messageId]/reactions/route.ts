import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { isGroupMember } from '@/lib/permissions';

// Toggle reaction on a message
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string; messageId: string }> }
) {
    try {
        const { slug, messageId } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const group = await prisma.group.findUnique({
            where: { slug: slug },
        });

        if (!group) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 });
        }

        // Check if user is a member
        const isMember = await isGroupMember(user.id, group.id);
        if (!isMember) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        const { emoji } = await request.json();

        if (!emoji || typeof emoji !== 'string') {
            return NextResponse.json({ error: 'Invalid emoji' }, { status: 400 });
        }

        // Check if reaction already exists
        const existingReaction = await prisma.reaction.findFirst({
            where: {
                userId: user.id,
                emoji,
                messageId: messageId,
            },
        });

        if (existingReaction) {
            // Remove reaction
            await prisma.reaction.delete({
                where: { id: existingReaction.id },
            });

            return NextResponse.json({ success: true, action: 'removed' });
        } else {
            // Add reaction
            await prisma.reaction.create({
                data: {
                    userId: user.id,
                    emoji,
                    messageId: messageId,
                },
            });

            return NextResponse.json({ success: true, action: 'added' });
        }
    } catch (error) {
        console.error('Error toggling reaction:', error);
        return NextResponse.json(
            { error: 'Failed to toggle reaction' },
            { status: 500 }
        );
    }
}
