import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE /api/influencers/videos/[id] - Delete video
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;

        const video = await prisma.influencerVideo.findUnique({
            where: { id },
            include: {
                influencer: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        if (!video) {
            return NextResponse.json({ error: 'Video not found' }, { status: 404 });
        }

        // Check if the current user owns this video
        if (video.influencer.user.email !== session.user.email) {
            return NextResponse.json(
                { error: 'You can only delete your own videos' },
                { status: 403 }
            );
        }

        await prisma.influencerVideo.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: 'Video deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting video:', error);
        return NextResponse.json(
            { error: 'Failed to delete video' },
            { status: 500 }
        );
    }
}
