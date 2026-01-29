import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { prisma } from "@/lib/db";

// GET - Get comments for a live session
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const comments = await prisma.liveStreamComment.findMany({
            where: { sessionId: id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
            take: 100, // Limit to last 100 comments
        });

        return NextResponse.json({ comments });
    } catch (error: unknown) {
        console.error("Error fetching comments:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Failed to fetch comments", details: message },
            { status: 500 }
        );
    }
}

// POST - Add a new comment
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
        const { content } = body;

        if (!content || !content.trim()) {
            return NextResponse.json(
                { error: "Comment content is required" },
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

        const comment = await prisma.liveStreamComment.create({
            data: {
                sessionId: id,
                userId: user.id,
                content: content.trim(),
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

        return NextResponse.json({ comment });
    } catch (error: unknown) {
        console.error("Error creating comment:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Failed to create comment", details: message },
            { status: 500 }
        );
    }
}
