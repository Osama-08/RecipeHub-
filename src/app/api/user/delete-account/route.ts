import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Find the user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Delete all related data first (cascade delete)
        // This ensures we clean up all user data across the system
        await prisma.$transaction(async (tx) => {
            // Delete user's recipes
            await tx.recipe.deleteMany({
                where: { authorId: user.id },
            });

            // Delete user's reviews
            await tx.review.deleteMany({
                where: { userId: user.id },
            });

            // Delete user's saved recipes
            await tx.savedRecipe.deleteMany({
                where: { userId: user.id },
            });

            // Delete user's AI conversations
            await tx.aIConversation.deleteMany({
                where: { userId: user.id },
            });

            // Delete user's notifications
            await tx.notification.deleteMany({
                where: { userId: user.id },
            });

            // Finally, delete the user account
            await tx.user.delete({
                where: { id: user.id },
            });
        });

        return NextResponse.json({
            success: true,
            message: "Account deleted successfully",
        });
    } catch (error) {
        console.error("Delete account error:", error);
        return NextResponse.json(
            { error: "Failed to delete account" },
            { status: 500 }
        );
    }
}
