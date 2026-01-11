import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { isGroupMember } from '@/lib/permissions';

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

        // Check if user is a member (for private groups)
        if (group.type === 'PRIVATE') {
            const isMember = await isGroupMember(user.id, group.id);
            if (!isMember) {
                return NextResponse.json({ error: 'Access denied' }, { status: 403 });
            }
        }

        // Fetch all members with their info
        const members = await prisma.groupMembership.findMany({
            where: {
                groupId: group.id,
                status: 'ACTIVE',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
            orderBy: [
                { role: 'asc' }, // ADMIN first, then MODERATOR, then MEMBER
                { joinedAt: 'asc' },
            ],
        });

        const formattedMembers = members.map((member) => ({
            id: member.id,
            userId: member.user.id,
            name: member.user.name,
            email: member.user.email,
            image: member.user.image,
            role: member.role,
            status: member.status,
            joinedAt: member.joinedAt,
        }));

        return NextResponse.json(formattedMembers);
    } catch (error) {
        console.error('Error fetching members:', error);
        return NextResponse.json(
            { error: 'Failed to fetch members' },
            { status: 500 }
        );
    }
}
