import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
        return redirect("/login?error=InvalidToken");
    }

    // Redirect to the UI page which will handle the POST request
    return redirect(`/verify-email?token=${token}`);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json(
                { error: "Verification token is required" },
                { status: 400 }
            );
        }

        console.log('🔍 Verifying token:', token);

        // Find the verification token
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
        });

        if (!verificationToken) {
            console.log('❌ Token not found in database');
            return NextResponse.json(
                { error: "Invalid verification token" },
                { status: 400 }
            );
        }

        console.log('✅ Token found:', verificationToken);

        // Check if token has expired
        if (verificationToken.expires < new Date()) {
            console.log('⏰ Token expired at:', verificationToken.expires);
            await prisma.verificationToken.delete({
                where: { token },
            });

            return NextResponse.json(
                { error: "Verification token has expired. Please sign up again." },
                { status: 400 }
            );
        }

        // Find user and update emailVerified
        const user = await prisma.user.findUnique({
            where: { email: verificationToken.identifier },
        });

        if (!user) {
            console.log('❌ User not found for email:', verificationToken.identifier);
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        console.log('👤 User found:', user.email);

        // Update user's emailVerified field
        await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() },
        });

        console.log('✅ Email verified successfully for:', user.email);

        // Delete the used token
        await prisma.verificationToken.delete({
            where: { token },
        });

        return NextResponse.json({
            success: true,
            message: "Email verified successfully! You can now log in.",
        });
    } catch (error) {
        console.error("❌ Email verification error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
