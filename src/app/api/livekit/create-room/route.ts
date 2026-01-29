import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createLiveKitRoom, generateRoomName } from '@/lib/livekit';

/**
 * POST /api/livekit/create-room
 * Create a new LiveKit room for live streaming
 */
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { influencerProfile: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if user is an influencer
        if (!user.influencerProfile) {
            return NextResponse.json(
                { error: 'Only influencers can create live streams' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { title, description } = body;

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        // Generate unique room name
        const roomName = generateRoomName(user.id);

        // Create LiveKit room
        const livekitRoom = await createLiveKitRoom(roomName, {
            maxParticipants: 100,
        });

        // Create database record
        const liveSession = await prisma.liveSession.create({
            data: {
                title,
                description: description || null,
                roomName,
                livekitRoomId: livekitRoom.sid,
                userId: user.id,
                isRecorded: true, // Auto-record by default
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json({
            session: liveSession,
            roomName,
        });
    } catch (error: unknown) {
        console.error('Error creating LiveKit room:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Failed to create room', details: message },
            { status: 500 }
        );
    }
}
