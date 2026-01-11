'use client';

import { useState } from 'react';
import { X, Upload, Check } from 'lucide-react';
import Image from 'next/image';
import { UploadDropzone } from '@uploadthing/react';
import type { OurFileRouter } from '@/app/api/uploadthing/core';

interface ImageUploadProps {
    onUploadComplete: (url: string) => void;
    currentImage?: string | null;
    onRemove?: () => void;
}

export default function ImageUpload({ onUploadComplete, currentImage, onRemove }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentImage || null);

    return (
        <div className="space-y-3">
            {!uploadedUrl ? (
                <UploadDropzone<OurFileRouter, "imageUploader">
                    endpoint="imageUploader"
                    onClientUploadComplete={(res: { url: string; }[]) => {
                        if (res && res[0]) {
                            setUploadedUrl(res[0].url);
                            onUploadComplete(res[0].url);
                        }
                        setIsUploading(false);
                    }}
                    onUploadError={(error: Error) => {
                        alert(`Upload failed: ${error.message}`);
                        setIsUploading(false);
                    }}
                    onUploadBegin={() => {
                        setIsUploading(true);
                    }}
                    appearance={{
                        container: "border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-500 transition-colors",
                        uploadIcon: "text-purple-500",
                        label: "text-gray-700 font-semibold",
                        allowedContent: "text-gray-500 text-sm",
                        button: "bg-purple-500 hover:bg-purple-600 text-white ut-ready:bg-purple-500 ut-uploading:cursor-not-allowed ut-uploading:bg-purple-400"
                    }}
                    content={{
                        uploadIcon: () => <Upload className="w-8 h-8 mb-2" />,
                        label: isUploading ? "Uploading..." : "Click or drag image to upload",
                        allowedContent: "PNG, JPG, GIF up to 4MB",
                        button: isUploading ? "Uploading..." : "Choose File"
                    }}
                />
            ) : (
                <div className="relative h-64 w-full">
                    <Image
                        src={uploadedUrl}
                        alt="Uploaded"
                        fill
                        className="object-cover rounded-lg border border-gray-200"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                        <div className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold flex items-center gap-1">
                            <Check className="w-4 h-4" />
                            Uploaded
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setUploadedUrl(null);
                                if (onRemove) onRemove();
                            }}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            title="Remove image"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
