import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/e-store/purchases/[documentId] - Check if user has purchased a document
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ documentId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json(
                { hasPurchased: false },
                { status: 200 }
            );
        }

        const { documentId } = await params;

        // Get user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { hasPurchased: false },
                { status: 200 }
            );
        }

        // Check if purchase exists
        const purchase = await prisma.purchase.findUnique({
            where: {
                userId_documentId: {
                    userId: user.id,
                    documentId: documentId,
                },
            },
        });

        return NextResponse.json({
            hasPurchased: purchase?.status === "completed",
        });
    } catch (error) {
        console.error("Error checking purchase status:", error);
        return NextResponse.json(
            { hasPurchased: false },
            { status: 200 }
        );
    }
}
