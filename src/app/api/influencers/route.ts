import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/influencers - Get all influencers
export async function GET() {
    try {
        const influencers = await prisma.influencer.findMany({
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
                    take: 1,
                    orderBy: {
                        createdAt: 'desc',
                    },
                    select: {
                        thumbnailUrl: true,
                    },
                },
                _count: {
                    select: {
                        videos: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ influencers }, { status: 200 });
    } catch (error) {
        console.error('Error fetching influencers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch influencers' },
            { status: 500 }
        );
    }
}
