import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generateUniqueSlug } from '@/lib/slugify';

// Route segment config for Next.js 15
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


// GET /api/groups - Get all groups (public + user's groups)
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type'); // 'PUBLIC' or 'PRIVATE'
        const search = searchParams.get('search');

        let user = null;
        if (session?.user?.email) {
            user = await prisma.user.findUnique({
                where: { email: session.user.email },
            });
        }

        const where: any = {};

        // Filter by type
        if (type === 'PUBLIC' || type === 'PRIVATE') {
            where.type = type;
        }

        // Search by name
        if (search) {
            where.name = {
                contains: search,
                mode: 'insensitive',
            };
        }

        // For non-authenticated users, only show public groups
        if (!user) {
            where.type = 'PUBLIC';
        }

        const groups = await prisma.group.findMany({
            where,
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
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Filter private groups to only show those the user is a member of
        const filteredGroups = user
            ? await Promise.all(
                groups.map(async (group) => {
                    if (group.type === 'PRIVATE') {
                        const membership = await prisma.groupMembership.findUnique({
                            where: {
                                userId_groupId: {
                                    userId: user.id,
                                    groupId: group.id,
                                },
                            },
                        });
                        return membership ? group : null;
                    }
                    return group;
                })
            ).then((results) => results.filter((g) => g !== null))
            : groups;

        return NextResponse.json(filteredGroups);
    } catch (error) {
        console.error('Error fetching groups:', error);
        return NextResponse.json(
            { error: 'Failed to fetch groups' },
            { status: 500 }
        );
    }
}

// POST /api/groups - Create a new group
export async function POST(req: NextRequest) {
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

        const { name, description, type, coverImageUrl, rules } = await req.json();

        if (!name || name.trim().length === 0) {
            return NextResponse.json(
                { error: 'Group name is required' },
                { status: 400 }
            );
        }

        const slug = generateUniqueSlug(name);

        // Create group and add creator as admin in a transaction
        const group = await prisma.$transaction(async (tx) => {
            const newGroup = await tx.group.create({
                data: {
                    name: name.trim(),
                    slug,
                    description: description?.trim() || null,
                    type: type || 'PUBLIC',
                    coverImageUrl: coverImageUrl || null,
                    rules: rules?.trim() || null,
                    creatorId: user.id,
                },
                include: {
                    creator: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
            });

            // Add creator as admin
            await tx.groupMembership.create({
                data: {
                    userId: user.id,
                    groupId: newGroup.id,
                    role: 'ADMIN',
                    status: 'ACTIVE',
                },
            });

            return newGroup;
        });

        return NextResponse.json(group, { status: 201 });
    } catch (error) {
        console.error('Error creating group:', error);
        return NextResponse.json(
            { error: 'Failed to create group' },
            { status: 500 }
        );
    }
}
