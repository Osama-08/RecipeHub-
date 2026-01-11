import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { isGroupAdmin } from '@/lib/permissions';

// Get group analytics
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
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

        const group = await prisma.group.findUnique({
            where: { slug: slug },
        });

        if (!group) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 });
        }

        // Check if user is admin
        const isAdmin = await isGroupAdmin(user.id, group.id);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        // Get total counts
        const totalMembers = await prisma.groupMembership.count({
            where: { groupId: group.id, status: 'ACTIVE' },
        });

        const totalPosts = await prisma.groupPost.count({
            where: { groupId: group.id },
        });

        const totalMessages = await prisma.groupMessage.count({
            where: { groupId: group.id },
        });

        // Get member growth (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const memberGrowth = await prisma.groupMembership.groupBy({
            by: ['joinedAt'],
            where: {
                groupId: group.id,
                joinedAt: { gte: thirtyDaysAgo },
            },
            _count: true,
        });

        // Get top contributors (by posts)
        const topContributors = await prisma.groupPost.groupBy({
            by: ['authorId'],
            where: { groupId: group.id },
            _count: true,
            orderBy: {
                _count: {
                    authorId: 'desc',
                },
            },
            take: 5,
        });

        // Fetch contributor details
        const contributorDetails = await Promise.all(
            topContributors.map(async (contributor) => {
                const user = await prisma.user.findUnique({
                    where: { id: contributor.authorId },
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                });
                return {
                    user,
                    postCount: contributor._count,
                };
            })
        );

        // Activity by day (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentPosts = await prisma.groupPost.findMany({
            where: {
                groupId: group.id,
                createdAt: { gte: sevenDaysAgo },
            },
            select: { createdAt: true },
        });

        const recentMessages = await prisma.groupMessage.findMany({
            where: {
                groupId: group.id,
                createdAt: { gte: sevenDaysAgo },
            },
            select: { createdAt: true },
        });

        return NextResponse.json({
            totals: {
                members: totalMembers,
                posts: totalPosts,
                messages: totalMessages,
            },
            memberGrowth,
            topContributors: contributorDetails,
            recentActivity: {
                posts: recentPosts.length,
                messages: recentMessages.length,
            },
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}
