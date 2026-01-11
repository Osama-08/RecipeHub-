import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                emailVerified: null, // Will be set after verification
            },
        });

        // Generate verification token
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Store verification token
        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires,
            },
        });

        // Send verification email
        const emailResult = await sendVerificationEmail({
            email,
            token,
            name,
        });

        if (!emailResult.success) {
            // Log the error for debugging
            console.error('❌ Email sending failed:', emailResult.error);
            console.error('❌ Error message:', (emailResult.error as any)?.message);
            
            // If email fails, delete the user and token
            await prisma.user.delete({ where: { id: user.id } });
            await prisma.verificationToken.deleteMany({
                where: { identifier: email },
            });

            // Return more detailed error message
            const errorMessage = (emailResult.error as any)?.message || 'Failed to send verification email';
            return NextResponse.json(
                { 
                    error: "Failed to send verification email. Please check your email configuration.",
                    details: errorMessage 
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Account created! Please check your email to verify your account.",
                email: user.email,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
