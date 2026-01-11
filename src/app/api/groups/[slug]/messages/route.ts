import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { isGroupMember } from '@/lib/permissions';

// Fetch messages (for polling)
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

        // Check if user is a member
        const isMember = await isGroupMember(user.id, group.id);
        if (!isMember) {
            return NextResponse.json({ error: 'Must be a member to view messages' }, { status: 403 });
        }

        // Get query parameters for pagination
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const cursor = searchParams.get('cursor'); // Message ID to fetch from

        // Build query
        const messages = await prisma.groupMessage.findMany({
            where: {
                groupId: group.id,
                ...(cursor ? { id: { lt: cursor } } : {}),
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
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });

        // Reverse to get chronological order
        const reversedMessages = messages.reverse();

        return NextResponse.json({
            messages: reversedMessages.map((msg) => ({
                id: msg.id,
                content: msg.content,
                imageUrl: msg.imageUrl,
                author: msg.author,
                readBy: msg.readBy,
                createdAt: msg.createdAt,
            })),
            hasMore: messages.length === limit,
            nextCursor: messages.length > 0 ? messages[0].id : null,
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
            { error: 'Failed to fetch messages' },
            { status: 500 }
        );
    }
}

// Send message
export async function POST(
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

        // Check if user is a member
        const isMember = await isGroupMember(user.id, group.id);
        if (!isMember) {
            return NextResponse.json({ error: 'Must be a member to send messages' }, { status: 403 });
        }

        const { content, imageUrl } = await request.json();

        if (!content?.trim() && !imageUrl) {
            return NextResponse.json({ error: 'Message content or image required' }, { status: 400 });
        }

        // Create the message
        const message = await prisma.groupMessage.create({
            data: {
                content: content?.trim() || '',
                imageUrl,
                authorId: user.id,
                groupId: group.id,
                readBy: [user.id], // Author has read their own message
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

        return NextResponse.json({
            id: message.id,
            content: message.content,
            imageUrl: message.imageUrl,
            author: message.author,
            readBy: message.readBy,
            createdAt: message.createdAt,
        });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}
