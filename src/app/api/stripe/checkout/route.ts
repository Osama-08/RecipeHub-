import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

// POST /api/stripe/checkout - Create Stripe checkout session
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json(
                { error: "Unauthorized - Please login first" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { documentId } = body;

        if (!documentId) {
            return NextResponse.json(
                { error: "Document ID is required" },
                { status: 400 }
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

        // Get document
        const document = await prisma.cookingDocument.findUnique({
            where: { id: documentId },
        });

        if (!document) {
            return NextResponse.json(
                { error: "Document not found" },
                { status: 404 }
            );
        }

        // Check if document is free
        if (document.price === 0) {
            return NextResponse.json(
                { error: "This document is free, no payment required" },
                { status: 400 }
            );
        }

        // Check if user already purchased
        const existingPurchase = await prisma.purchase.findUnique({
            where: {
                userId_documentId: {
                    userId: user.id,
                    documentId: document.id,
                },
            },
        });

        if (existingPurchase && existingPurchase.status === "completed") {
            return NextResponse.json(
                { error: "You have already purchased this document" },
                { status: 400 }
            );
        }

        // Calculate platform fee
        const platformFeePercentage = parseFloat(process.env.NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE || "2");
        const platformFeeAmount = Math.round(document.price * (platformFeePercentage / 100));

        // Create Stripe checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: document.title,
                            description: document.description || 'Cooking document',
                            images: document.coverImageUrl ? [document.coverImageUrl] : [],
                        },
                        unit_amount: document.price, // Already in cents
                    },
                    quantity: 1,
                },
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Platform Fee',
                            description: `Transaction fee (${platformFeePercentage}%)`,
                        },
                        unit_amount: platformFeeAmount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXTAUTH_URL}/e-store/${document.slug}?payment=success`,
            cancel_url: `${process.env.NEXTAUTH_URL}/e-store/${document.slug}?payment=cancelled`,
            metadata: {
                userId: user.id,
                documentId: document.id,
                userEmail: user.email || '',
                platformFee: platformFeeAmount.toString(),
            },
        });

        return NextResponse.json({
            sessionId: checkoutSession.id,
            url: checkoutSession.url,
        });
    } catch (error: any) {
        console.error("Error creating checkout session:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to create checkout session" },
            { status: 500 }
        );
    }
}
