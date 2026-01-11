import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Route segment config for Next.js 15
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


// GET /api/community/posts - Get all posts (paginated)
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        const posts = await prisma.post.findMany({
            take: limit,
            skip,
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                likes: {
                    select: {
                        userId: true,
                    },
                },
                comments: {
                    select: {
                        id: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
        });

        const total = await prisma.post.count();

        return NextResponse.json({
            posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

// POST /api/community/posts - Create a new post
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Ensure the user exists – create a placeholder user if this is the first request
        const user = await prisma.user.upsert({
            where: { email: session.user.email },
            update: {}, // no changes if the user already exists
            create: {
                email: session.user.email,
                // Use the name from the session if available, otherwise a generic placeholder
                name: session.user.name ?? 'Anonymous',
                // Optional: you can store the image from session or leave null
                image: session.user.image ?? null,
            },
        });

        const { content, imageUrl } = await req.json();

        if (!content || content.trim().length === 0) {
            return NextResponse.json(
                { error: 'Content is required' },
                { status: 400 }
            );
        }

        const post = await prisma.post.create({
            data: {
                content: content.trim(),
                imageUrl: imageUrl || null,
                authorId: user.id,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
}
