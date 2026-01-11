import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/community/posts/[id]/like - Toggle like on post
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const post = await prisma.post.findUnique({
            where: { id: id },
        });

        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        // Check if already liked
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: user.id,
                    postId: id,
                },
            },
        });

        if (existingLike) {
            // Unlike
            await prisma.like.delete({
                where: {
                    userId_postId: {
                        userId: user.id,
                        postId: id,
                    },
                },
            });

            return NextResponse.json({ liked: false });
        } else {
            // Like
            await prisma.like.create({
                data: {
                    userId: user.id,
                    postId: id,
                },
            });

            return NextResponse.json({ liked: true });
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        return NextResponse.json(
            { error: 'Failed to toggle like' },
            { status: 500 }
        );
    }
}
