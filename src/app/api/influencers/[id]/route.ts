import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/influencers/[id] - Get single influencer with videos
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const influencer = await prisma.influencer.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        email: true,
                    },
                },
                videos: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
                _count: {
                    select: {
                        videos: true,
                    },
                },
            },
        });

        if (!influencer) {
            return NextResponse.json(
                { error: 'Influencer not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ influencer }, { status: 200 });
    } catch (error) {
        console.error('Error fetching influencer:', error);
        return NextResponse.json(
            { error: 'Failed to fetch influencer' },
            { status: 500 }
        );
    }
}
