"use client";

import { FileText, Download, Eye, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface DocumentCardProps {
    id: string;
    slug: string;
    title: string;
    description?: string;
    category: string;
    fileType: string;
    fileSize: number;
    downloads: number;
    views: number;
    coverImageUrl?: string;
    author?: string;
    featured?: boolean;
    price?: number; // Price in cents
}

export default function DocumentCard({
    id,
    slug,
    title,
    description,
    category,
    fileType,
    fileSize,
    downloads,
    views,
    coverImageUrl,
    author,
    featured,
    price,
}: DocumentCardProps) {
    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const getFileIcon = () => {
        switch (fileType.toLowerCase()) {
            case "pdf":
                return "🔴";
            case "doc":
            case "docx":
                return "📘";
            case "epub":
                return "📗";
            default:
                return "📄";
        }
    };

    return (
        <Link href={`/e-store/${slug}`}>
            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                {/* Featured badge */}
                {featured && (
                    <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        ⭐ Featured
                    </div>
                )}

                {/* Cover Image or Icon */}
                <div className="relative h-48 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center overflow-hidden">
                    {coverImageUrl ? (
                        <Image
                            src={coverImageUrl}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="text-7xl group-hover:scale-110 transition-transform duration-300">
                            <BookOpen className="w-20 h-20 text-orange-500" />
                        </div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Category & File Type */}
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                            {category}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium bg-gray-100 px-2 py-1 rounded">
                            {getFileIcon()} {fileType.toUpperCase()}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {title}
                    </h3>

                    {/* Author */}
                    {author && (
                        <p className="text-sm text-gray-600 mb-3">
                            by {author}
                        </p>
                    )}

                    {/* Description */}
                    {description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {description}
                        </p>
                    )}

                    {/* Price Tag */}
                    {price !== undefined && (
                        <div className="mb-4">
                            {price === 0 ? (
                                <span className="inline-block bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">
                                    FREE
                                </span>
                            ) : (
                                <span className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white text-lg font-bold px-4 py-2 rounded-full">
                                    ${(price / 100).toFixed(2)}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <Download className="w-3.5 h-3.5" />
                                {downloads}
                            </span>
                            <span className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" />
                                {views}
                            </span>
                        </div>
                        <span className="font-medium">{formatFileSize(fileSize)}</span>
                    </div>
                </div>

                {/* Hover Action */}
                <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center font-semibold transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <FileText className="w-5 h-5 mr-2" />
                    View Details
                </div>
            </div>
        </Link>
    );
}
