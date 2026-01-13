import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET endpoint to fetch user's tutorial status
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { hasSeenTutorial: true },
        });

        return NextResponse.json({
            hasSeenTutorial: user?.hasSeenTutorial ?? false,
        });
    } catch (error) {
        console.error("Tutorial status fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch tutorial status" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { hasSeenTutorial } = await request.json();

        if (typeof hasSeenTutorial !== 'boolean') {
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        // Update user's tutorial status
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: { hasSeenTutorial },
            select: { id: true, hasSeenTutorial: true },
        });

        return NextResponse.json({
            success: true,
            hasSeenTutorial: updatedUser.hasSeenTutorial,
        });
    } catch (error) {
        console.error("Tutorial status update error:", error);
        return NextResponse.json(
            { error: "Failed to update tutorial status" },
            { status: 500 }
        );
    }
}
