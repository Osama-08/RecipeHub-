"use client";

import { useState, useRef } from "react";
import { Upload, Link as LinkIcon, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
    const [mode, setMode] = useState<"upload" | "url">("url");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be less than 5MB");
            return;
        }

        setError("");
        setUploading(true);

        try {
            // Convert to base64
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target?.result as string;
                onChange(base64);
                setUploading(false);
            };
            reader.onerror = () => {
                setError("Failed to read file");
                setUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            setError("Failed to process image");
            setUploading(false);
        }
    };

    const handleClear = () => {
        onChange("");
        setError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">{label}</label>

            {/* Mode Tabs */}
            <div className="flex gap-2 border-b">
                <button
                    type="button"
                    onClick={() => setMode("url")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${mode === "url"
                            ? "border-b-2 border-orange-500 text-orange-600"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    <LinkIcon className="w-4 h-4 inline mr-1" />
                    Use URL
                </button>
                <button
                    type="button"
                    onClick={() => setMode("upload")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${mode === "upload"
                            ? "border-b-2 border-orange-500 text-orange-600"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    <Upload className="w-4 h-4 inline mr-1" />
                    Upload File
                </button>
            </div>

            {/* Content */}
            {mode === "url" ? (
                <input
                    type="text"
                    placeholder="Paste image URL here"
                    value={value.startsWith("data:") ? "" : value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
            ) : (
                <div className="space-y-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id={`file-${label}`}
                    />
                    <label
                        htmlFor={`file-${label}`}
                        className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                                <span className="text-sm text-gray-600">Processing...</span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    Click to browse or drag image here
                                </span>
                            </>
                        )}
                    </label>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                </div>
            )}

            {/* Image Preview */}
            {value && !uploading && (
                <div className="relative">
                    <div className="relative w-full h-48 border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                        <Image
                            src={value}
                            alt="Preview"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
