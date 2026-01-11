import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Route segment config for Next.js 15
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


// Get user's notifications
export async function GET(request: NextRequest) {
    try {
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

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '20');
        const unreadOnly = searchParams.get('unreadOnly') === 'true';

        const notifications = await prisma.notification.findMany({
            where: {
                userId: user.id,
                ...(unreadOnly ? { isRead: false } : {}),
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });

        // Get unread count
        const unreadCount = await prisma.notification.count({
            where: {
                userId: user.id,
                isRead: false,
            },
        });

        return NextResponse.json({
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        );
    }
}

// Mark notification(s) as read
export async function PUT(request: NextRequest) {
    try {
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

        const { notificationIds, markAllAsRead } = await request.json();

        if (markAllAsRead) {
            // Mark all as read
            await prisma.notification.updateMany({
                where: {
                    userId: user.id,
                    isRead: false,
                },
                data: {
                    isRead: true,
                },
            });

            return NextResponse.json({ success: true, action: 'marked_all' });
        } else if (notificationIds && Array.isArray(notificationIds)) {
            // Mark specific notifications as read
            await prisma.notification.updateMany({
                where: {
                    id: { in: notificationIds },
                    userId: user.id,
                },
                data: {
                    isRead: true,
                },
            });

            return NextResponse.json({ success: true, action: 'marked_selected' });
        } else {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error updating notifications:', error);
        return NextResponse.json(
            { error: 'Failed to update notifications' },
            { status: 500 }
        );
    }
}

// Delete notification(s)
export async function DELETE(request: NextRequest) {
    try {
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

        const { notificationIds } = await request.json();

        if (!notificationIds || !Array.isArray(notificationIds)) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        await prisma.notification.deleteMany({
            where: {
                id: { in: notificationIds },
                userId: user.id,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting notifications:', error);
        return NextResponse.json(
            { error: 'Failed to delete notifications' },
            { status: 500 }
        );
    }
}
