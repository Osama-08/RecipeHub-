import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { isGroupAdmin } from '@/lib/permissions';

// Get single session details
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string; sessionId: string }> }
) {
    try {
        const { slug, sessionId } = await params;
        const group = await prisma.group.findUnique({
            where: { slug: slug },
        });

        if (!group) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 });
        }

        const session = await prisma.liveCookingSession.findFirst({
            where: {
                id: sessionId,
                groupId: group.id,
            },
            include: {
                host: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                group: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });

        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        return NextResponse.json(session);
    } catch (error) {
        console.error('Error fetching session:', error);
        return NextResponse.json(
            { error: 'Failed to fetch session' },
            { status: 500 }
        );
    }
}

// Update session
export async function PUT(
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

        // Only admins can update sessions
        const isAdmin = await isGroupAdmin(user.id, group.id);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Only admins can update sessions' }, { status: 403 });
        }

        const { title, description, scheduledAt, videoUrl, streamVisibility } = await request.json();

        let youtubeVideoId = undefined;
        if (videoUrl) {
            const { extractYouTubeVideoId } = await import('@/lib/youtube');
            youtubeVideoId = extractYouTubeVideoId(videoUrl);
        }

        const updatedSession = await prisma.liveCookingSession.update({
            where: { id: sessionId },
            data: {
                ...(title && { title }),
                ...(description !== undefined && { description }),
                ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
                ...(videoUrl !== undefined && { videoUrl }),
                ...(youtubeVideoId !== undefined && { youtubeVideoId }),
                ...(streamVisibility !== undefined && { streamVisibility }),
            },
            include: {
                host: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json(updatedSession);
    } catch (error) {
        console.error('Error updating session:', error);
        return NextResponse.json(
            { error: 'Failed to update session' },
            { status: 500 }
        );
    }
}

// Delete/cancel session
export async function DELETE(
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

        // Only admins can delete sessions
        const isAdmin = await isGroupAdmin(user.id, group.id);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Only admins can delete sessions' }, { status: 403 });
        }

        // Update status to CANCELLED instead of deleting
        await prisma.liveCookingSession.update({
            where: { id: sessionId },
            data: { status: 'CANCELLED' },
        });

        return NextResponse.json({ success: true, message: 'Session cancelled' });
    } catch (error) {
        console.error('Error cancelling session:', error);
        return NextResponse.json(
            { error: 'Failed to cancel session' },
            { status: 500 }
        );
    }
}
