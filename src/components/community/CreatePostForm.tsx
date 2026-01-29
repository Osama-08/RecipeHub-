'use client';

import { useState, useRef } from 'react';
import { Image as ImageIcon, X, Upload, Link as LinkIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface CreatePostFormProps {
    onSubmit: (content: string, imageUrl: string | null) => Promise<void>;
}

export default function CreatePostForm({ onSubmit }: CreatePostFormProps) {
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [showImageInput, setShowImageInput] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadMode, setUploadMode] = useState<'url' | 'file'>('file');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('Image size must be less than 10MB');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', file);

            // Simulate progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            const response = await fetch('/api/cloudinary/upload-post-image', {
                method: 'POST',
                body: formData,
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Upload failed');
            }

            const data = await response.json();
            setImageUrl(data.url);
            toast.success('Image uploaded successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to upload image');
            setImageUrl('');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(content, imageUrl || null);
            setContent('');
            setImageUrl('');
            setShowImageInput(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind? Share a recipe tip, cooking story, or food photo..."
                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[120px] resize-none text-gray-900"
                disabled={isSubmitting}
            />

            {showImageInput && (
                <div className="mt-4">
                    {/* Upload Mode Toggle */}
                    <div className="flex gap-2 mb-3">
                        <button
                            type="button"
                            onClick={() => {
                                setUploadMode('file');
                                setImageUrl('');
                            }}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${uploadMode === 'file'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            disabled={isSubmitting || isUploading}
                        >
                            <Upload className="w-4 h-4 inline mr-2" />
                            Upload File
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setUploadMode('url');
                                setImageUrl('');
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                }
                            }}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${uploadMode === 'url'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            disabled={isSubmitting || isUploading}
                        >
                            <LinkIcon className="w-4 h-4 inline mr-2" />
                            Image URL
                        </button>
                    </div>

                    {uploadMode === 'file' ? (
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                disabled={isSubmitting || isUploading}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isSubmitting || isUploading}
                                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-orange-500 disabled:opacity-50"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Uploading... {uploadProgress}%</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5" />
                                        <span>Click to select image</span>
                                    </>
                                )}
                            </button>

                            {/* Upload Progress Bar */}
                            {isUploading && (
                                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                                disabled={isSubmitting}
                            />
                        </div>
                    )}

                    {/* Image Preview */}
                    {imageUrl && !isUploading && (
                        <div className="mt-3 relative">
                            <div className="relative w-full h-64 rounded-lg overflow-hidden">
                                <Image
                                    src={imageUrl}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                    onError={() => {
                                        setImageUrl('');
                                        toast.error('Failed to load image');
                                    }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setImageUrl('');
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                    }
                                }}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Close Image Input */}
                    <button
                        type="button"
                        onClick={() => {
                            setShowImageInput(false);
                            setImageUrl('');
                            if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                            }
                        }}
                        className="mt-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
                        disabled={isSubmitting || isUploading}
                    >
                        Remove Image
                    </button>
                </div>
            )}

            <div className="flex items-center justify-between mt-4">
                <button
                    type="button"
                    onClick={() => setShowImageInput(!showImageInput)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={isSubmitting || isUploading}
                >
                    <ImageIcon className="w-5 h-5" />
                    <span>{showImageInput ? 'Hide Image' : 'Add Image'}</span>
                </button>

                <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting || isUploading}
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Posting...' : 'Post'}
                </button>
            </div>
        </form>
    );
}
