import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isGroupMember } from '@/lib/permissions';

// GET /api/groups/[slug]/posts - Get group posts
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const session = await getServerSession(authOptions);
        let user = null;

        if (session?.user?.email) {
            user = await prisma.user.findUnique({
                where: { email: session.user.email },
            });
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

        // Check if user can access this group
        if (group.type === 'PRIVATE') {
            if (!user || !(await isGroupMember(user.id, group.id))) {
                return NextResponse.json(
                    { error: 'Access denied' },
                    { status: 403 }
                );
            }
        }

        const posts = await prisma.groupPost.findMany({
            where: { groupId: group.id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching group posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

// POST /api/groups/[slug]/posts - Create group post
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

        // Check if user is a member
        const isMember = await isGroupMember(user.id, group.id);

        if (!isMember) {
            return NextResponse.json(
                { error: 'You must be a member to post in this group' },
                { status: 403 }
            );
        }

        const { content, imageUrl } = await req.json();

        if (!content || content.trim().length === 0) {
            return NextResponse.json(
                { error: 'Content is required' },
                { status: 400 }
            );
        }

        const post = await prisma.groupPost.create({
            data: {
                content: content.trim(),
                imageUrl: imageUrl || null,
                authorId: user.id,
                groupId: group.id,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error('Error creating group post:', error);
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
}
