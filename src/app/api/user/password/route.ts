import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { currentPassword, newPassword } = body;

        const user = await prisma.user.findUnique({
            where: { email: session.user.email as string },
        });

        if (!user || !user.password) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordMatch) {
            return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { email: session.user.email as string },
            data: {
                password: hashedPassword,
            },
        });

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error: any) {
        console.error("Password update error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update password" },
            { status: 500 }
        );
    }
}
