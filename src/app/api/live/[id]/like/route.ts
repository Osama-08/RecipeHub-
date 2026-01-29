import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { prisma } from "@/lib/db";

// POST - Toggle like/dislike for a live session
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { isLike } = body; // true for like, false for dislike

        if (typeof isLike !== 'boolean') {
            return NextResponse.json(
                { error: "isLike must be a boolean" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Verify session exists
        const liveSession = await prisma.liveSession.findUnique({
            where: { id },
        });

        if (!liveSession) {
            return NextResponse.json({ error: "Live session not found" }, { status: 404 });
        }

        // Check if user already liked/disliked
        const existing = await prisma.liveStreamLike.findUnique({
            where: {
                sessionId_userId: {
                    sessionId: id,
                    userId: user.id,
                },
            },
        });

        if (existing) {
            // If same action, remove it (toggle off)
            if (existing.isLike === isLike) {
                await prisma.liveStreamLike.delete({
                    where: { id: existing.id },
                });
                return NextResponse.json({ action: 'removed', isLike });
            }
            // If different action, update it
            await prisma.liveStreamLike.update({
                where: { id: existing.id },
                data: { isLike },
            });
            return NextResponse.json({ action: 'updated', isLike });
        }

        // Create new like/dislike
        await prisma.liveStreamLike.create({
            data: {
                sessionId: id,
                userId: user.id,
                isLike,
            },
        });

        return NextResponse.json({ action: 'created', isLike });
    } catch (error: unknown) {
        console.error("Error toggling like:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Failed to toggle like", details: message },
            { status: 500 }
        );
    }
}

// GET - Get like/dislike stats for a session
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const [likes, dislikes] = await Promise.all([
            prisma.liveStreamLike.count({
                where: { sessionId: id, isLike: true },
            }),
            prisma.liveStreamLike.count({
                where: { sessionId: id, isLike: false },
            }),
        ]);

        // Get current user's like status if authenticated
        const session = await getServerSession(authOptions);
        let userLike = null;

        if (session?.user?.email) {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
            });

            if (user) {
                const userLikeRecord = await prisma.liveStreamLike.findUnique({
                    where: {
                        sessionId_userId: {
                            sessionId: id,
                            userId: user.id,
                        },
                    },
                });
                userLike = userLikeRecord ? userLikeRecord.isLike : null;
            }
        }

        return NextResponse.json({ likes, dislikes, userLike });
    } catch (error: unknown) {
        console.error("Error fetching likes:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Failed to fetch likes", details: message },
            { status: 500 }
        );
    }
}
