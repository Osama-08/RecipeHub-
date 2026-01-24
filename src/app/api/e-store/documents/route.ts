import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/e-store/documents - List all documents
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const featured = searchParams.get("featured");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "12");
        const skip = (page - 1) * limit;

        const where: any = {};

        if (category && category !== "all") {
            where.category = category;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { author: { contains: search, mode: "insensitive" } },
            ];
        }

        if (featured === "true") {
            where.featured = true;
        }

        const [documents, total] = await Promise.all([
            prisma.cookingDocument.findMany({
                where,
                include: {
                    uploadedBy: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
                orderBy: [
                    { featured: "desc" },
                    { createdAt: "desc" },
                ],
                skip,
                take: limit,
            }),
            prisma.cookingDocument.count({ where }),
        ]);

        return NextResponse.json({
            documents,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Error fetching documents:", error);
        return NextResponse.json(
            { error: "Failed to fetch documents" },
            { status: 500 }
        );
    }
}

// POST /api/e-store/documents - Upload a new document (Admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if user is admin
        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
        });

        if (!user || user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Forbidden - Admin access required" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const {
            title,
            description,
            category,
            fileUrl,
            fileName,
            fileSize,
            fileType,
            coverImageUrl,
            author,
            publishedYear,
            featured,
        } = body;

        // Validate required fields
        if (!title || !category || !fileUrl || !fileName || !fileSize || !fileType) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();

        // Check if slug already exists
        const existingDoc = await prisma.cookingDocument.findUnique({
            where: { slug },
        });

        if (existingDoc) {
            return NextResponse.json(
                { error: "A document with this title already exists" },
                { status: 400 }
            );
        }

        // Create the document
        const document = await prisma.cookingDocument.create({
            data: {
                title,
                slug,
                description,
                category,
                fileUrl,
                fileName,
                fileSize,
                fileType,
                coverImageUrl,
                author,
                publishedYear: publishedYear ? parseInt(publishedYear) : null,
                featured: featured || false,
                uploadedById: user.id,
            },
            include: {
                uploadedBy: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json(document, { status: 201 });
    } catch (error) {
        console.error("Error creating document:", error);
        return NextResponse.json(
            { error: "Failed to create document" },
            { status: 500 }
        );
    }
}
