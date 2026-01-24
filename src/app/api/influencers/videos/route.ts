import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/influencers/videos - Create new video
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { influencerProfile: true },
        });

        if (!user || !user.influencerProfile) {
            return NextResponse.json(
                { error: 'You must be an influencer to post videos' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { title, description, videoType, youtubeId, videoUrl, thumbnailUrl } = body;

        if (!title || !videoType) {
            return NextResponse.json(
                { error: 'Title and video type are required' },
                { status: 400 }
            );
        }

        if (videoType === 'youtube' && !youtubeId) {
            return NextResponse.json(
                { error: 'YouTube ID is required for YouTube videos' },
                { status: 400 }
            );
        }

        if (videoType === 'uploaded' && !videoUrl) {
            return NextResponse.json(
                { error: 'Video URL is required for uploaded videos' },
                { status: 400 }
            );
        }

        const video = await prisma.influencerVideo.create({
            data: {
                influencerId: user.influencerProfile.id,
                title,
                description: description || null,
                videoType,
                youtubeId: youtubeId || null,
                videoUrl: videoUrl || null,
                thumbnailUrl: thumbnailUrl || null,
            },
        });

        return NextResponse.json({ video }, { status: 201 });
    } catch (error) {
        console.error('Error creating video:', error);
        return NextResponse.json(
            { error: 'Failed to create video' },
            { status: 500 }
        );
    }
}
