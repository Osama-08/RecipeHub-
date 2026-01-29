import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { prisma } from "@/lib/db";

// GET - Get single live session details
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const session = await prisma.liveSession.findUnique({
            where: { id },
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

        if (!session) {
            return NextResponse.json({ error: "Live session not found" }, { status: 404 });
        }

        return NextResponse.json({ session });
    } catch (error: unknown) {
        console.error("Error fetching live session:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Failed to fetch live session", details: message },
            { status: 500 }
        );
    }
}

// PATCH - End a live session
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const liveSession = await prisma.liveSession.findUnique({
            where: { id },
        });

        if (!liveSession) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        // Only creator can end the session
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (liveSession.userId !== user?.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updated = await prisma.liveSession.update({
            where: { id },
            data: {
                endedAt: new Date(),
            },
        });

        return NextResponse.json({ session: updated });
    } catch (error: unknown) {
        console.error("Error ending live session:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Failed to end live session", details: message },
            { status: 500 }
        );
    }
}

// DELETE - End a live session (same as PATCH but using DELETE for REST convention)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const liveSession = await prisma.liveSession.findUnique({
            where: { id },
        });

        if (!liveSession) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        // Only creator can end the session
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (liveSession.userId !== user?.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updated = await prisma.liveSession.update({
            where: { id },
            data: {
                endedAt: new Date(),
            },
        });

        return NextResponse.json({ session: updated, message: "Stream ended successfully" });
    } catch (error: unknown) {
        console.error("Error ending live session:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Failed to end live session", details: message },
            { status: 500 }
        );
    }
}
