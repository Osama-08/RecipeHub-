import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { isGroupAdmin } from '@/lib/permissions';

// End a live session
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string; sessionId: string }> }
) {
    try {
        const { slug, sessionId } = await params;
        const authSession = await getServerSession(authOptions);
        if (!authSession?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: authSession.user.email },
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

        // Get the session
        const session = await prisma.liveCookingSession.findFirst({
            where: {
                id: sessionId,
                groupId: group.id,
            },
        });

        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // Only host or admin can end session
        const isAdmin = await isGroupAdmin(user.id, group.id);
        if (session.hostId !== user.id && !isAdmin) {
            return NextResponse.json({ error: 'Only host or admin can end session' }, { status: 403 });
        }

        if (session.status === 'ENDED') {
            return NextResponse.json({ error: 'Session already ended' }, { status: 400 });
        }

        // Update session status
        const updatedSession = await prisma.liveCookingSession.update({
            where: { id: sessionId },
            data: {
                status: 'ENDED',
                endedAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Session ended successfully',
            session: updatedSession,
        });
    } catch (error) {
        console.error('Error ending session:', error);
        return NextResponse.json(
            { error: 'Failed to end session' },
            { status: 500 }
        );
    }
}
