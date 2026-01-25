import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendResetPasswordEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Always return success to prevent email enumeration
        // Even if user doesn't exist, we don't reveal this information
        if (!user) {
            console.log(`Password reset requested for non-existent email: ${email}`);
            return NextResponse.json({
                success: true,
                message: "If an account with that email exists, a password reset link has been sent.",
            });
        }

        // Generate reset token
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Delete any existing reset tokens for this user
        await prisma.verificationToken.deleteMany({
            where: {
                identifier: email,
            },
        });

        // Store reset token
        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires,
            },
        });

        // Send reset email
        const emailResult = await sendResetPasswordEmail({
            email,
            token,
            name: user.name || undefined,
        });

        if (!emailResult.success) {
            console.error('❌ Failed to send reset email:', emailResult.error);
            return NextResponse.json(
                {
                    error: "Failed to send password reset email. Please try again later.",
                    details: (emailResult as any).errorMessage
                },
                { status: 500 }
            );
        }

        console.log(`✅ Password reset email sent to: ${email}`);

        return NextResponse.json({
            success: true,
            message: "If an account with that email exists, a password reset link has been sent.",
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
