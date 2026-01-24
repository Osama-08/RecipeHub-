import { NextRequest, NextResponse } from "next/server";
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
