import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { prisma } from "@/lib/db";

// GET all live sessions and past streams
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || "live";

        const sessions = await prisma.liveSession.findMany({
            where: {
                status: status,
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
            orderBy: {
                startedAt: "desc",
            },
            take: status === "ended" ? 20 : undefined, // Limit past streams to 20
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

// POST create new live session
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, youtubeUrl, youtubeVideoId: providedId } = body;

        if (!title) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }

        let youtubeVideoId = providedId || null;
        if (youtubeUrl && !youtubeVideoId) {
            const { extractYouTubeVideoId } = await import('@/lib/youtube');
            youtubeVideoId = extractYouTubeVideoId(youtubeUrl);
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const liveSession = await prisma.liveSession.create({
            data: {
                title,
                description: description || null,
                youtubeVideoId,
                userId: user.id,
                status: "live", // Platform-wide streams are usually created when already live
            },
        });

        return NextResponse.json({ session: liveSession });
    } catch (error: unknown) {
        console.error("Error creating live session:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Failed to create live session", details: message },
            { status: 500 }
        );
    }
}
