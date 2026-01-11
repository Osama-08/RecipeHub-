import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/groups/[slug]/join - Join a group
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
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

        const group = await prisma.group.findUnique({
            where: { slug: slug },
        });

        if (!group) {
            return NextResponse.json(
                { error: 'Group not found' },
                { status: 404 }
            );
        }

        // Check if already a member
        const existingMembership = await prisma.groupMembership.findUnique({
            where: {
                userId_groupId: {
                    userId: user.id,
                    groupId: group.id,
                },
            },
        });

        if (existingMembership) {
            if (existingMembership.status === 'BANNED') {
                return NextResponse.json(
                    { error: 'You are banned from this group' },
                    { status: 403 }
                );
            }
            return NextResponse.json(
                { error: 'Already a member of this group' },
                { status: 400 }
            );
        }

        // For private groups, create pending membership
        // For public groups, create active membership
        const membership = await prisma.groupMembership.create({
            data: {
                userId: user.id,
                groupId: group.id,
                role: 'MEMBER',
                status: group.type === 'PRIVATE' ? 'PENDING' : 'ACTIVE',
            },
        });

        return NextResponse.json({
            success: true,
            status: membership.status,
            message:
                group.type === 'PRIVATE'
                    ? 'Membership request sent'
                    : 'Successfully joined group',
        });
    } catch (error) {
        console.error('Error joining group:', error);
        return NextResponse.json(
            { error: 'Failed to join group' },
            { status: 500 }
        );
    }
}
