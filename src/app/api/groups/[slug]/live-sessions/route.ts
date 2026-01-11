import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canModerateGroup, isGroupMember } from '@/lib/permissions';

// GET /api/groups/[slug]/live-sessions - Get all live sessions
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
        });

        if (!group) {
            return NextResponse.json(
                { error: 'Group not found' },
                { status: 404 }
            );
        }

        // Check access for private groups
        if (group.type === 'PRIVATE') {
            if (!user || !(await isGroupMember(user.id, group.id))) {
                return NextResponse.json(
                    { error: 'Access denied' },
                    { status: 403 }
                );
            }
        }

        const sessions = await prisma.liveCookingSession.findMany({
            where: { groupId: group.id },
            include: {
                host: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                scheduledAt: 'desc',
            },
        });

        return NextResponse.json(sessions);
    } catch (error) {
        console.error('Error fetching live sessions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch live sessions' },
            { status: 500 }
        );
    }
}

// POST /api/groups/[slug]/live-sessions - Create live session
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

        // Only admins/moderators can create live sessions
        const canModerate = await canModerateGroup(user.id, group.id);

        if (!canModerate) {
            return NextResponse.json(
                { error: 'Only admins and moderators can create live sessions' },
                { status: 403 }
            );
        }

        const { title, description, scheduledAt, videoType = 'youtube', videoUrl, streamVisibility = 'PUBLIC' } =
            await req.json();

        if (!title || !scheduledAt) {
            return NextResponse.json(
                { error: 'Title and scheduledAt are required' },
                { status: 400 }
            );
        }

        let youtubeVideoId = null;
        if (videoType === 'youtube' && videoUrl) {
            const { extractYouTubeVideoId } = await import('@/lib/youtube');
            youtubeVideoId = extractYouTubeVideoId(videoUrl);
        }

        const liveSession = await prisma.liveCookingSession.create({
            data: {
                title: title.trim(),
                description: description?.trim() || null,
                scheduledAt: new Date(scheduledAt),
                videoType,
                videoUrl: videoUrl || null,
                youtubeVideoId,
                streamVisibility,
                hostId: user.id,
                groupId: group.id,
                status: 'SCHEDULED',
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

        return NextResponse.json(liveSession, { status: 201 });
    } catch (error) {
        console.error('Error creating live session:', error);
        return NextResponse.json(
            { error: 'Failed to create live session' },
            { status: 500 }
        );
    }
}
