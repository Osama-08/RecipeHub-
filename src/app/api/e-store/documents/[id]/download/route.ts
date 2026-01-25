import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/e-store/documents/[id]/download - Track download and redirect
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const document = await prisma.cookingDocument.findUnique({
            where: { id },
        });

        if (!document) {
            return NextResponse.json(
                { error: "Document not found" },
                { status: 404 }
            );
        }

        // If document is not free, verify purchase
        if (document.price > 0) {
            const session = await getServerSession(authOptions);

            if (!session || !session.user || !session.user.email) {
                return NextResponse.json(
                    { error: "Please login to download this document" },
                    { status: 401 }
                );
            }

            // Get user
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
            });

            if (!user) {
                return NextResponse.json(
                    { error: "User not found" },
                    { status: 404 }
                );
            }

            // Check if user has purchased this document
            const purchase = await prisma.purchase.findUnique({
                where: {
                    userId_documentId: {
                        userId: user.id,
                        documentId: document.id,
                    },
                },
            });

            if (!purchase || purchase.status !== "completed") {
                return NextResponse.json(
                    { error: "You must purchase this document before downloading" },
                    { status: 403 }
                );
            }
        }

        // Increment download count
        await prisma.cookingDocument.update({
            where: { id },
            data: { downloads: { increment: 1 } },
        });

        // Redirect to the file URL
        return NextResponse.redirect(document.fileUrl);
    } catch (error) {
        console.error("Error tracking download:", error);
        return NextResponse.json(
            { error: "Failed to process download" },
            { status: 500 }
        );
    }
}
