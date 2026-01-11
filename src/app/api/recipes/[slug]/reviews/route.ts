import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from '@/lib/auth';

// GET reviews for a recipe
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const recipe = await prisma.recipe.findUnique({
            where: { slug },
        });

        if (!recipe) {
            return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
        }

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: { recipeId: recipe.id },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.review.count({ where: { recipeId: recipe.id } }),
        ]);

        return NextResponse.json({
            reviews,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error: unknown) {
        console.error("Error fetching reviews:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Failed to fetch reviews", details: message },
            { status: 500 }
        );
    }
}

// POST a new review
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { slug } = await params;
        const body = await request.json();
        const { rating, comment } = body;

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Rating must be between 1 and 5" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const recipe = await prisma.recipe.findUnique({
            where: { slug },
        });

        if (!recipe) {
            return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
        }

        // Check if user already reviewed this recipe
        const existingReview = await prisma.review.findFirst({
            where: {
                userId: user.id,
                recipeId: recipe.id,
            },
        });

        let review;
        if (existingReview) {
            // Update existing review
            review = await prisma.review.update({
                where: { id: existingReview.id },
                data: {
                    rating,
                    comment: comment || null,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
            });
        } else {
            // Create new review
            review = await prisma.review.create({
                data: {
                    rating,
                    comment: comment || null,
                    userId: user.id,
                    recipeId: recipe.id,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
            });
        }

        // Recalculate recipe's average rating
        const allReviews = await prisma.review.findMany({
            where: { recipeId: recipe.id },
        });

        const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

        await prisma.recipe.update({
            where: { id: recipe.id },
            data: {
                averageRating: avgRating,
                ratingCount: allReviews.length,
            },
        });

        return NextResponse.json({ review }, { status: existingReview ? 200 : 201 });
    } catch (error: unknown) {
        console.error("Error creating review:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Failed to create review", details: message },
            { status: 500 }
        );
    }
}
