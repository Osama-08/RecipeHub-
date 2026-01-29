import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generateAccessToken } from '@/lib/livekit';

/**
 * POST /api/livekit/token
 * Generate LiveKit access token for joining a room
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

        const body = await request.json();
        const { roomName, role } = body;

        if (!roomName) {
            return NextResponse.json({ error: 'Room name is required' }, { status: 400 });
        }

        // Validate role
        const requestedRole = (role as string)?.toLowerCase() || 'viewer';
        if (!['host', 'cohost', 'viewer'].includes(requestedRole)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        // Verify the room exists in database
        const liveSession = await prisma.liveSession.findUnique({
            where: { roomName },
            include: { user: true },
        });

        if (!liveSession) {
            return NextResponse.json({ error: 'Live session not found' }, { status: 404 });
        }

        // Check if stream has ended
        if (liveSession.endedAt) {
            return NextResponse.json(
                { error: 'This live stream has ended' },
                { status: 410 }
            );
        }

        // Determine actual role based on permissions
        let actualRole: 'host' | 'cohost' | 'viewer' = 'viewer';

        // Host check
        if (liveSession.userId === user.id) {
            actualRole = 'host';
        }
        // Co-host check (only influencers can be co-hosts)
        else if (
            user.influencerProfile &&
            (requestedRole === 'host' || requestedRole === 'cohost')
        ) {
            actualRole = 'cohost';

            // Add to cohostIds if not already there
            if (!liveSession.cohostIds.includes(user.id)) {
                await prisma.liveSession.update({
                    where: { id: liveSession.id },
                    data: {
                        cohostIds: {
                            push: user.id,
                        },
                    },
                });
            }
        }

        // Generate access token
        const token = await generateAccessToken(
            roomName,
            user.name || 'Anonymous',
            user.id,
            actualRole
        );

        return NextResponse.json({
            token,
            role: actualRole,
            participantName: user.name || 'Anonymous',
            participantId: user.id,
        });
    } catch (error: unknown) {
        console.error('Error generating access token:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Failed to generate token', details: message },
            { status: 500 }
        );
    }
}
