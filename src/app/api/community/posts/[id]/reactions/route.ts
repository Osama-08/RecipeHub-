import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Toggle reaction on a post
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { emoji } = await request.json();

        if (!emoji || typeof emoji !== 'string') {
            return NextResponse.json({ error: 'Invalid emoji' }, { status: 400 });
        }

        // Check if reaction already exists
        const existingReaction = await prisma.reaction.findFirst({
            where: {
                userId: user.id,
                emoji,
                postId: id,
            },
        });

        if (existingReaction) {
            // Remove reaction (toggle off)
            await prisma.reaction.delete({
                where: { id: existingReaction.id },
            });

            return NextResponse.json({ success: true, action: 'removed' });
        } else {
            // Add reaction (toggle on)
            await prisma.reaction.create({
                data: {
                    userId: user.id,
                    emoji,
                    postId: id,
                },
            });

            return NextResponse.json({ success: true, action: 'added' });
        }
    } catch (error) {
        console.error('Error toggling reaction:', error);
        return NextResponse.json(
            { error: 'Failed to toggle reaction' },
            { status: 500 }
        );
    }
}

// Get reactions for a post
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const reactions = await prisma.reaction.findMany({
            where: { postId: id },
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

        // Group by emoji
        const grouped = reactions.reduce((acc, reaction) => {
            if (!acc[reaction.emoji]) {
                acc[reaction.emoji] = {
                    emoji: reaction.emoji,
                    count: 0,
                    users: [],
                };
            }
            acc[reaction.emoji].count++;
            acc[reaction.emoji].users.push(reaction.user);
            return acc;
        }, {} as Record<string, { emoji: string; count: number; users: any[] }>);

        return NextResponse.json(Object.values(grouped));
    } catch (error) {
        console.error('Error fetching reactions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reactions' },
            { status: 500 }
        );
    }
}
