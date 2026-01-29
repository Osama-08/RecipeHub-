import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { WebhookReceiver } from 'livekit-server-sdk';
import { prisma } from '@/lib/db';

/**
 * POST /api/livekit/webhook
 * Handle LiveKit webhooks for events like recording completion, room closure, etc.
 */
export async function POST(request: Request) {
    try {
        const body = await request.text();
        const headersList = await headers();
        const authorization = headersList.get('authorization');

        // Verify webhook authenticity
        const receiver = new WebhookReceiver(
            process.env.LIVEKIT_API_KEY || '',
            process.env.LIVEKIT_API_SECRET || ''
        );

        const event = await receiver.receive(body, authorization || '');

        console.log('LiveKit webhook event:', event.event, event);

        switch (event.event) {
            case 'egress_ended': {
                // Recording has finished
                // @ts-ignore - LiveKit WebhookEvent types are complex, but these exist on egress events
                const { egressId, roomName, fileResults } = event;

                if (roomName && fileResults && fileResults.length > 0) {
                    // @ts-ignore
                    const recordingUrl = fileResults[0].downloadUrl || fileResults[0].location;

                    await prisma.liveSession.update({
                        where: { roomName },
                        data: {
                            recordingId: egressId,
                            recordingUrl,
                            recordingEndedAt: new Date(),
                        },
                    });

                    console.log(`Recording completed for room ${roomName}: ${recordingUrl}`);
                }
                break;
            }

            case 'room_finished': {
                // Room has been closed
                const { room } = event;

                if (room?.name) {
                    await prisma.liveSession.update({
                        where: { roomName: room.name },
                        data: {
                            endedAt: new Date(),
                        },
                    });

                    console.log(`Room ${room.name} has been closed`);
                }
                break;
            }

            case 'participant_joined': {
                // Update viewer count
                const { room, participant } = event;

                if (room?.name) {
                    const liveSession = await prisma.liveSession.findUnique({
                        where: { roomName: room.name },
                    });

                    if (liveSession) {
                        const newCount = (liveSession.viewerCount || 0) + 1;
                        const maxViewers = Math.max(liveSession.maxViewers || 0, newCount);

                        await prisma.liveSession.update({
                            // Use ID instead of roomName as roomName might not be a unique filter in Prisma client if not marked @unique (though it is in schema)
                            where: { id: liveSession.id },
                            data: {
                                viewerCount: newCount,
                                maxViewers,
                            },
                        });

                        console.log(
                            `Participant ${participant?.identity} joined ${room.name}. Viewer count: ${newCount}`
                        );
                    }
                }
                break;
            }

            case 'participant_left': {
                // Decrease viewer count
                const { room } = event;

                if (room?.name) {
                    const liveSession = await prisma.liveSession.findUnique({
                        where: { roomName: room.name },
                    });

                    if (liveSession && liveSession.viewerCount > 0) {
                        await prisma.liveSession.update({
                            where: { id: liveSession.id },
                            data: {
                                viewerCount: liveSession.viewerCount - 1,
                            },
                        });
                    }
                }
                break;
            }

            case 'egress_started': {
                // Recording has started
                // @ts-ignore
                const { egressId, roomName } = event;

                if (roomName) {
                    await prisma.liveSession.update({
                        where: { roomName },
                        data: {
                            recordingId: egressId,
                            recordingStartedAt: new Date(),
                        },
                    });

                    console.log(`Recording started for room ${roomName}`);
                }
                break;
            }

            default:
                console.log('Unhandled webhook event:', event.event);
        }

        return NextResponse.json({ received: true });
    } catch (error: unknown) {
        console.error('Error processing webhook:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Webhook processing failed', details: message },
            { status: 500 }
        );
    }
}
