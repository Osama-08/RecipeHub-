import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * GET /api/influencers/[id]/streams
 * Fetch all live streams (active and past) for an influencer
 */
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        // Verify the influencer exists
        const influencer = await prisma.influencer.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!influencer) {
            return NextResponse.json({ error: 'Influencer not found' }, { status: 404 });
        }

        // Fetch all streams for this influencer (both live and past)
        const streams = await prisma.liveSession.findMany({
            where: {
                userId: influencer.userId,
            },
            orderBy: {
                startedAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        influencerProfile: {
                            select: {
                                displayName: true,
                            },
                        },
                    },
                },
            },
        });

        // Separate active and past streams
        const activeStreams = streams.filter((s) => !s.endedAt);
        const pastStreams = streams.filter((s) => s.endedAt && s.recordingUrl);

        return NextResponse.json({
            activeStreams,
            pastStreams,
            totalStreams: streams.length,
        });
    } catch (error: unknown) {
        console.error('Error fetching influencer streams:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Failed to fetch streams', details: message },
            { status: 500 }
        );
    }
}
