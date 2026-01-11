import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, bio } = body;

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email as string },
            data: {
                name: name || undefined,
                bio: bio || undefined,
            },
        });

        return NextResponse.json({
            message: "Profile updated successfully",
            user: {
                name: updatedUser.name,
                bio: updatedUser.bio,
            },
        });
    } catch (error: any) {
        console.error("Profile update error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update profile" },
            { status: 500 }
        );
    }
}
