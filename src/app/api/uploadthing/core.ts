import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

const f = createUploadthing();

// FileRouter for your app
export const ourFileRouter = {
    // Image uploader for posts, messages, groups
    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async () => {
            // Authenticate user
            const session = await getServerSession(authOptions);
            if (!session?.user?.email) throw new Error("Unauthorized");

            // Return user data to be available in onUploadComplete
            return { userId: session.user.email };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This runs on server after successful upload
            console.log("Upload complete for userId:", metadata.userId);
            console.log("File URL:", file.url);

            // Return data to the client
            return { uploadedBy: metadata.userId, url: file.url };
        }),

    // Document uploader for E Store (Admin only)
    // Using blob type to accept any binary file (PDF, DOC, DOCX, EPUB, etc.)
    documentUploader: f({
        blob: { maxFileSize: "32MB", maxFileCount: 1 },
    })
        .middleware(async () => {
            try {
                console.log("🔍 Document upload middleware - Starting...");

                // Authenticate and check admin role
                const session = await getServerSession(authOptions);
                console.log("📋 Session check:", session?.user?.email ? "Found" : "Missing");

                if (!session?.user?.email) {
                    console.error("❌ No session found");
                    throw new Error("Unauthorized");
                }

                // Check if user is admin
                const user = await prisma.user.findUnique({
                    where: { email: session.user.email },
                    select: { role: true, id: true }
                });

                console.log("👤 User role:", user?.role);

                if (!user || user.role !== "ADMIN") {
                    console.error("❌ User is not admin");
                    throw new Error("Admin access required");
                }

                console.log("✅ Middleware passed - Admin verified:", user.id);
                return { userId: user.id, userEmail: session.user.email };
            } catch (error: any) {
                console.error("❌ Document upload middleware error:", error);
                console.error("Error message:", error?.message);
                console.error("Error stack:", error?.stack);
                throw error;
            }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("🔄 onUploadComplete called");
            console.log("📋 Metadata:", JSON.stringify(metadata, null, 2));
            console.log("📄 File object:", {
                url: file.url,
                name: file.name,
                size: file.size,
                key: file.key,
                type: file.type,
            });

            try {
                const result = {
                    uploadedBy: metadata.userId,
                    url: file.url,
                    name: file.name,
                    size: file.size,
                };
                
                console.log("✅ Returning result:", result);
                return result;
            } catch (error: any) {
                console.error("❌ Error in onUploadComplete:", error);
                console.error("Error type:", typeof error);
                console.error("Error message:", error?.message);
                console.error("Error stack:", error?.stack);
                
                // Return minimal data to prevent complete failure
                return {
                    uploadedBy: metadata.userId || "unknown",
                    url: file.url || "",
                    name: file.name || "unknown",
                    size: file.size || 0,
                };
            }
        }),

    // Cover image uploader for E Store documents (Admin only)
    coverImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async () => {
            // Authenticate and check admin role
            const session = await getServerSession(authOptions);
            if (!session?.user?.email) throw new Error("Unauthorized");

            // Check if user is admin
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: { role: true, id: true }
            });

            if (!user || user.role !== "ADMIN") {
                throw new Error("Admin access required");
            }

            return { userId: user.id, userEmail: session.user.email };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Cover image upload complete for admin:", metadata.userEmail);
            console.log("Image URL:", file.url);

            return {
                uploadedBy: metadata.userId,
                url: file.url
            };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
