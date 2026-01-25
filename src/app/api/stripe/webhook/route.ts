import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

// POST /api/stripe/webhook - Handle Stripe webhook events
export async function POST(request: NextRequest) {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
        return NextResponse.json(
            { error: "No signature found" },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        console.error("Webhook signature verification failed:", error);
        return NextResponse.json(
            { error: `Webhook Error: ${error.message}` },
            { status: 400 }
        );
    }

    // Handle the event
    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;

                // Get metadata
                const userId = session.metadata?.userId;
                const documentId = session.metadata?.documentId;

                if (!userId || !documentId) {
                    console.error("Missing metadata in checkout session:", session.id);
                    return NextResponse.json(
                        { error: "Missing metadata" },
                        { status: 400 }
                    );
                }

                // Get payment intent
                const paymentIntentId = session.payment_intent as string;
                const amountTotal = session.amount_total || 0;

                // Create or update purchase record
                await prisma.purchase.upsert({
                    where: {
                        userId_documentId: {
                            userId,
                            documentId,
                        },
                    },
                    create: {
                        userId,
                        documentId,
                        amount: amountTotal,
                        stripePaymentIntentId: paymentIntentId,
                        status: "completed",
                    },
                    update: {
                        amount: amountTotal,
                        stripePaymentIntentId: paymentIntentId,
                        status: "completed",
                    },
                });

                console.log(`✅ Purchase completed: User ${userId} purchased document ${documentId}`);
                break;
            }

            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;

                // Find and update purchase status to failed
                const purchase = await prisma.purchase.findUnique({
                    where: {
                        stripePaymentIntentId: paymentIntent.id,
                    },
                });

                if (purchase) {
                    await prisma.purchase.update({
                        where: { id: purchase.id },
                        data: { status: "failed" },
                    });
                }

                console.log(`❌ Payment failed for intent: ${paymentIntent.id}`);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("Error processing webhook:", error);
        return NextResponse.json(
            { error: error?.message || "Webhook processing failed" },
            { status: 500 }
        );
    }
}
