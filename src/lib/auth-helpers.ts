// Authentication helper functions for server components and API routes
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import { prisma } from "./db";

export async function getCurrentUser() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
        },
    });

    return user;
}

export async function requireAuth() {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error("Unauthorized - Please log in");
    }

    return user;
}

export async function requireAdmin() {
    const user = await requireAuth();

    if (user.role !== "ADMIN") {
        throw new Error("Forbidden - Admin access required");
    }

    return user;
}
