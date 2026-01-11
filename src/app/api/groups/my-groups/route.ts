import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/groups/my-groups
export async function GET() {
    try {
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

        const memberships = await prisma.groupMembership.findMany({
            where: {
                userId: user.id,
                status: 'ACTIVE',
            },
            include: {
                group: {
                    include: {
                        creator: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            },
                        },
                        _count: {
                            select: {
                                members: true,
                                posts: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                joinedAt: 'desc',
            },
        });

        const groups = memberships.map((m) => ({
            ...m.group,
            userRole: m.role,
        }));

        return NextResponse.json(groups);
    } catch (error) {
        console.error('Error fetching user groups:', error);
        return NextResponse.json(
            { error: 'Failed to fetch groups' },
            { status: 500 }
        );
    }
}
