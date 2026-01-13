import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// POST /api/announcements – create a new announcement (admin only)
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',') ?? [];
    if (!adminEmails.includes(session.user.email)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title, message } = await req.json();
    if (!title || !message) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Create a notification for every user (treated as announcement)
    const users = await prisma.user.findMany({ select: { id: true } });
    const notifications = users.map((u) => ({
        userId: u.id,
        type: 'ANNOUNCEMENT',
        title,
        message,
        isRead: false,
    }));
    // @ts-ignore
    await (prisma as any).notification.createMany({ data: notifications });

    return NextResponse.json({ success: true }, { status: 201 });
}

// GET /api/announcements – list recent announcements (public)
export async function GET() {
    const announcements = await (prisma as any).notification.findMany({
        where: { title: { not: "" } },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: { id: true, title: true, message: true, createdAt: true },
    });
    return NextResponse.json(announcements);
}
