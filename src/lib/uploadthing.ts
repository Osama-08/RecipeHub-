import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const { useUploadThing, uploadFiles } =
    generateReactHelpers<OurFileRouter>();

// Re-export UploadButton and UploadDropzone from the package directly
export { UploadButton, UploadDropzone } from "@uploadthing/react";
