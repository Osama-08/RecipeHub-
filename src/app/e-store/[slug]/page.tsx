"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/components/layout/Header";
import { Download, Eye, Calendar, User, ArrowLeft, FileText, X, CreditCard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

interface Document {
    id: string;
    slug: string;
    title: string;
    description?: string;
    category: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    coverImageUrl?: string;
    author?: string;
    publishedYear?: number;
    downloads: number;
    views: number;
    featured: boolean;
    price: number; // Price in cents
    uploadedBy: {
        name: string;
        image?: string;
    };
    createdAt: string;
}

export default function DocumentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const [document, setDocument] = useState<Document | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPreview, setShowPreview] = useState(false);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [checkingPurchase, setCheckingPurchase] = useState(false);
    const [purchasing, setPurchasing] = useState(false);

    useEffect(() => {
        if (params.slug) {
            fetchDocument(params.slug as string);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.slug]);

    useEffect(() => {
        // Check for payment status in URL
        const paymentStatus = searchParams.get("payment");
        if (paymentStatus === "success") {
            toast.success("🎉 Payment successful! You can now download the document.");
            // Refresh page to update purchase status
            window.history.replaceState({}, "", window.location.pathname);
            fetchDocument(params.slug as string);
        } else if (paymentStatus === "cancelled") {
            toast.error("Payment was cancelled.");
            window.history.replaceState({}, "", window.location.pathname);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const fetchDocument = async (slug: string) => {
        try {
            // First, find document by slug
            const listRes = await fetch(`/api/e-store/documents?search=${slug}`);
            const listData = await listRes.json();

            if (listData.documents && listData.documents.length > 0) {
                const doc = listData.documents.find((d: Document) => d.slug === slug);
                if (doc) {
                    // Now fetch full details with view increment
                    const res = await fetch(`/api/e-store/documents/${doc.id}`);
                    const data = await res.json();
                    setDocument(data);

                    // Check if user has purchased (only if logged in and document is not free)
                    if (session && data.price > 0) {
                        checkPurchaseStatus(doc.id);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch document:", error);
        } finally {
            setLoading(false);
        }
    };

    const checkPurchaseStatus = async (documentId: string) => {
        setCheckingPurchase(true);
        try {
            const res = await fetch(`/api/e-store/purchases/${documentId}`);
            if (res.ok) {
                const data = await res.json();
                setHasPurchased(data.hasPurchased);
            }
        } catch (error) {
            console.error("Failed to check purchase status:", error);
        } finally {
            setCheckingPurchase(false);
        }
    };

    const handlePurchase = async () => {
        if (!session) {
            toast.error("Please login to purchase this document");
            router.push("/login");
            return;
        }

        if (!document) return;

        setPurchasing(true);
        try {
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    documentId: document.id,
                }),
            });

            const data = await res.json();

            if (res.ok && data.url) {
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } else {
                toast.error(data.error || "Failed to create checkout session");
            }
        } catch (error: any) {
            toast.error(error?.message || "Failed to initiate purchase");
        } finally {
            setPurchasing(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const getFileIcon = (fileType: string) => {
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

    const handleDownload = () => {
        if (document) {
            window.open(`/api/e-store/documents/${document.id}/download`, '_blank');
        }
    };

    const canDownload = () => {
        if (!document) return false;
        if (document.price === 0) return true; // Free documents
        return hasPurchased; // Paid documents require purchase
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-4xl mx-auto">
                        <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Document Not Found</h1>
                    <Link
                        href="/e-store"
                        className="text-orange-600 hover:text-orange-700 font-semibold"
                    >
                        ← Back to E Store
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <Link
                    href="/e-store"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to E Store
                </Link>

                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        {/* Header Section */}
                        <div className="grid md:grid-cols-2 gap-8 p-8">
                            {/* Cover Image */}
                            <div className="relative h-96 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl overflow-hidden flex items-center justify-center">
                                {document.coverImageUrl ? (
                                    <Image
                                        src={document.coverImageUrl}
                                        alt={document.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <FileText className="w-32 h-32 text-orange-500" />
                                )}
                            </div>

                            {/* Document Info */}
                            <div className="flex flex-col">
                                {document.featured && (
                                    <span className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit">
                                        ⭐ Featured
                                    </span>
                                )}

                                <span className="text-sm font-semibold text-orange-600 uppercase tracking-wide mb-2">
                                    {document.category}
                                </span>

                                <h1 className="text-4xl font-black text-gray-900 mb-4">
                                    {document.title}
                                </h1>

                                {document.author && (
                                    <p className="text-lg text-gray-700 mb-4">
                                        by <span className="font-semibold">{document.author}</span>
                                    </p>
                                )}

                                {/* Price Display */}
                                <div className="mb-6">
                                    {document.price === 0 ? (
                                        <span className="inline-block bg-green-100 text-green-700 text-xl font-bold px-4 py-2 rounded-full">
                                            FREE
                                        </span>
                                    ) : (
                                        <span className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white text-3xl font-bold px-6 py-3 rounded-full">
                                            ${(document.price / 100).toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                {document.description && (
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {document.description}
                                    </p>
                                )}

                                {/* Metadata Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-2xl">{getFileIcon(document.fileType)}</span>
                                        <div>
                                            <p className="text-gray-500 text-xs">Format</p>
                                            <p className="font-semibold">{document.fileType.toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <FileText className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-gray-500 text-xs">Size</p>
                                            <p className="font-semibold">{formatFileSize(document.fileSize)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Download className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-gray-500 text-xs">Downloads</p>
                                            <p className="font-semibold">{document.downloads}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Eye className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-gray-500 text-xs">Views</p>
                                            <p className="font-semibold">{document.views}</p>
                                        </div>
                                    </div>
                                    {document.publishedYear && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-gray-500 text-xs">Published</p>
                                                <p className="font-semibold">{document.publishedYear}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm">
                                        <User className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-gray-500 text-xs">Uploaded by</p>
                                            <p className="font-semibold">{document.uploadedBy.name}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setShowPreview(true)}
                                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                                    >
                                        <Eye className="w-6 h-6" />
                                        Preview
                                    </button>

                                    {canDownload() ? (
                                        <button
                                            onClick={handleDownload}
                                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                                        >
                                            <Download className="w-6 h-6" />
                                            Download
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handlePurchase}
                                            disabled={purchasing || checkingPurchase}
                                            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <CreditCard className="w-6 h-6" />
                                            {purchasing ? "Processing..." : `Purchase $${(document.price / 100).toFixed(2)}`}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-bold text-gray-900">
                                Preview: {document?.title}
                            </h2>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Preview Content */}
                        <div className="flex-1 p-4 overflow-auto">
                            {document?.fileType.toLowerCase() === 'pdf' ? (
                                <iframe
                                    src={document.fileUrl}
                                    className="w-full h-full rounded-lg border-2 border-gray-200"
                                    title={document.title}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full space-y-4">
                                    <FileText className="w-24 h-24 text-gray-400" />
                                    <p className="text-lg text-gray-600">
                                        Preview not available for {document?.fileType.toUpperCase()} files
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Please {canDownload() ? 'download' : 'purchase and download'} the file to view its contents
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
