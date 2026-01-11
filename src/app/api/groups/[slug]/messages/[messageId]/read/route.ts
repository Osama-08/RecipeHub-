import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { isGroupMember } from '@/lib/permissions';

// Mark message as read
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

        // Get the message
        const message = await prisma.groupMessage.findUnique({
            where: { id: messageId },
        });

        if (!message || message.groupId !== group.id) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }

        // Add user to readBy array if not already there
        if (!message.readBy.includes(user.id)) {
            const updatedMessage = await prisma.groupMessage.update({
                where: { id: messageId },
                data: {
                    readBy: {
                        push: user.id,
                    },
                },
            });

            return NextResponse.json({
                success: true,
                readBy: updatedMessage.readBy,
            });
        }

        return NextResponse.json({
            success: true,
            readBy: message.readBy,
        });
    } catch (error) {
        console.error('Error marking message as read:', error);
        return NextResponse.json(
            { error: 'Failed to mark message as read' },
            { status: 500 }
        );
    }
}
