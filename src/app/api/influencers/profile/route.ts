import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/influencers/profile - Get current user's influencer profile
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                influencerProfile: {
                    include: {
                        _count: {
                            select: {
                                videos: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(
            { influencer: user.influencerProfile },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching influencer profile:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}

// POST /api/influencers/profile - Create influencer profile
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

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.influencerProfile) {
            return NextResponse.json(
                { error: 'Influencer profile already exists' },
                { status: 400 }
            );
        }

        const body = await request.json();
        console.log('POST /api/influencers/profile - body:', body);
        console.log('Session email:', session?.user?.email);
        const { displayName, bio, facebookUrl, instagramUrl, tiktokUrl, youtubeUrl } = body;

        if (!displayName) {
            return NextResponse.json(
                { error: 'Display name is required' },
                { status: 400 }
            );
        }

        const influencer = await prisma.influencer.create({
            data: {
                userId: user.id,
                displayName,
                bio: bio || null,
                facebookUrl: facebookUrl || null,
                instagramUrl: instagramUrl || null,
                tiktokUrl: tiktokUrl || null,
                youtubeUrl: youtubeUrl || null,
            },
        });

        return NextResponse.json({ influencer }, { status: 201 });
    } catch (error) {
        console.error('Error creating influencer profile:', error);
        return NextResponse.json(
            { error: 'Failed to create profile' },
            { status: 500 }
        );
    }
}

// PUT /api/influencers/profile - Update influencer profile
export async function PUT(request: NextRequest) {
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
                { error: 'Influencer profile not found' },
                { status: 404 }
            );
        }

        const body = await request.json();
        const { displayName, bio, facebookUrl, instagramUrl, tiktokUrl, youtubeUrl } = body;

        if (!displayName) {
            return NextResponse.json(
                { error: 'Display name is required' },
                { status: 400 }
            );
        }

        const influencer = await prisma.influencer.update({
            where: { id: user.influencerProfile.id },
            data: {
                displayName,
                bio: bio || null,
                facebookUrl: facebookUrl || null,
                instagramUrl: instagramUrl || null,
                tiktokUrl: tiktokUrl || null,
                youtubeUrl: youtubeUrl || null,
            },
        });

        return NextResponse.json({ influencer }, { status: 200 });
    } catch (error) {
        console.error('Error updating influencer profile:', error);
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        );
    }
}
