import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { prisma } from "@/lib/db";

// GET all live sessions and past streams
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const filter = searchParams.get("filter") || "live";

        let whereClause = {};

        if (filter === "live") {
            // Active streams (not ended)
            whereClause = { endedAt: null };
        } else if (filter === "ended") {
            // Past streams
            whereClause = { endedAt: { not: null } };
        }
        // "all" returns everything

        const sessions = await prisma.liveSession.findMany({
            where: whereClause,
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
            orderBy: {
                startedAt: "desc",
            },
            take: filter === "ended" ? 20 : undefined, // Limit past streams to 20
        });

        return NextResponse.json({ sessions });
    } catch (error: unknown) {
        console.error("Error fetching live sessions:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Failed to fetch live sessions", details: message },
            { status: 500 }
        );
    }
}

// POST create new live session (redirects to LiveKit creation)
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { title, description } = body;

        if (!title) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { influencerProfile: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!user.influencerProfile) {
            return NextResponse.json(
                { error: "Only influencers can create live streams" },
                { status: 403 }
            );
        }

        // Forward to LiveKit room creation
        const { createLiveKitRoom, generateRoomName } = await import('@/lib/livekit');
        const roomName = generateRoomName(user.id);

        const livekitRoom = await createLiveKitRoom(roomName, {
            maxParticipants: 100,
        });

        const liveSession = await prisma.liveSession.create({
            data: {
                title,
                description: description || null,
                roomName,
                livekitRoomId: livekitRoom.sid,
                userId: user.id,
                isRecorded: true,
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

        return NextResponse.json({ session: liveSession, roomName });
    } catch (error: unknown) {
        console.error("Error creating live session:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Failed to create live session", details: message },
            { status: 500 }
        );
    }
}
