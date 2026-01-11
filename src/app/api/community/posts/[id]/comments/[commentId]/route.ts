import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE /api/community/posts/[id]/comments/[commentId] - Delete comment
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; commentId: string }> }
) {
    try {
        const { id, commentId } = await params;
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

        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!comment) {
            return NextResponse.json(
                { error: 'Comment not found' },
                { status: 404 }
            );
        }

        // Check if user owns the comment or is admin
        if (comment.authorId !== user.id && user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'You do not have permission to delete this comment' },
                { status: 403 }
            );
        }

        await prisma.comment.delete({
            where: { id: commentId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json(
            { error: 'Failed to delete comment' },
            { status: 500 }
        );
    }
}
