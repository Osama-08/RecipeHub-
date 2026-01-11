import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';

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
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
