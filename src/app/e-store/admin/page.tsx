"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { Plus, Trash2, Edit, BookOpen, Download, Eye, Upload } from "lucide-react";
import toast from 'react-hot-toast';

interface Document {
    id: string;
    title: string;
    slug: string;
    category: string;
    fileType: string;
    fileSize: number;
    downloads: number;
    views: number;
    featured: boolean;
    author?: string;
}

const CATEGORIES = [
    "Recipe Books",
    "Cooking Guides",
    "Techniques",
    "Nutrition",
    "Baking",
    "International Cuisine",
    "Food Science",
    "Other",
];

export default function EStoreAdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<string>("");

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Recipe Books",
        author: "",
        publishedYear: "",
        featured: false,
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [coverImage, setCoverImage] = useState<File | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            const userRole = session?.user && 'role' in session.user ? session.user.role : null;
            if (userRole !== "ADMIN") {
                router.push("/e-store");
            } else {
                fetchDocuments();
            }
        }
    }, [status, session, router]);

    const fetchDocuments = async () => {
        try {
            const res = await fetch("/api/e-store/documents?limit=100");
            const data = await res.json();
            setDocuments(data.documents);
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            toast.error("Please select a file to upload");
            return;
        }

        setUploading(true);
        setUploadProgress("Uploading document...");

        try {
            console.log("📤 Starting Cloudinary document upload...", {
                fileName: selectedFile.name,
                fileSize: selectedFile.size,
                fileType: selectedFile.type,
            });

            // Upload document to Cloudinary
            const docFormData = new FormData();
            docFormData.append("file", selectedFile);

            const docResponse = await fetch("/api/cloudinary/upload-document", {
                method: "POST",
                body: docFormData,
            });

            if (!docResponse.ok) {
                const error = await docResponse.json();
                throw new Error(error.error || "Document upload failed");
            }

            const docResult = await docResponse.json();
            console.log("✅ Document uploaded to Cloudinary:", docResult);

            const fileUrl = docResult.url;
            const fileName = docResult.name;
            const fileSize = docResult.size;

            // Upload cover image if provided
            let coverImageUrl = null;
            if (coverImage) {
                setUploadProgress("Uploading cover image...");
                console.log("🖼️ Starting cover image upload...");

                const coverFormData = new FormData();
                coverFormData.append("file", coverImage);

                const coverResponse = await fetch("/api/cloudinary/upload-cover", {
                    method: "POST",
                    body: coverFormData,
                });

                if (coverResponse.ok) {
                    const coverResult = await coverResponse.json();
                    coverImageUrl = coverResult.url;
                    console.log("✅ Cover image uploaded:", coverImageUrl);
                }
            }

            // Get file extension
            const fileType = fileName.split('.').pop() || 'pdf';

            setUploadProgress("Creating document entry...");
            console.log("💾 Creating database entry...");

            // Create document in database
            const res = await fetch("/api/e-store/documents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    fileUrl,
                    fileName,
                    fileSize,
                    fileType,
                    coverImageUrl,
                }),
            });

            if (res.ok) {
                console.log("✅ Document created successfully!");
                toast.success("📚 Document uploaded successfully!");
                setShowUploadForm(false);
                setFormData({
                    title: "",
                    description: "",
                    category: "Recipe Books",
                    author: "",
                    publishedYear: "",
                    featured: false,
                });
                setSelectedFile(null);
                setCoverImage(null);
                fetchDocuments();
            } else {
                const error = await res.json();
                console.error("❌ Database creation failed:", error);
                toast.error(`Error: ${error.error}`);
            }
        } catch (error: any) {
            console.error("❌ Upload error:", error);
            toast.error(`Failed to upload: ${error?.message || "Unknown error"}`);
        } finally {
            setUploading(false);
            setUploadProgress("");
        }
    };


    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this document?")) {
            return;
        }

        try {
            const res = await fetch(`/api/e-store/documents/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Document deleted successfully!");
                fetchDocuments();
            } else {
                toast.error("Failed to delete document");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete document");
        }
    };

    const toggleFeatured = async (id: string, currentValue: boolean) => {
        try {
            const res = await fetch(`/api/e-store/documents/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ featured: !currentValue }),
            });

            if (res.ok) {
                fetchDocuments();
            }
        } catch (error) {
            console.error("Toggle featured error:", error);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 mb-2">
                            E Store Management
                        </h1>
                        <p className="text-gray-600">
                            Manage cooking documents and resources
                        </p>
                    </div>
                    <button
                        onClick={() => setShowUploadForm(!showUploadForm)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:scale-105"
                    >
                        <Plus className="w-5 h-5" />
                        Upload Document
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-10 h-10 text-orange-500" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
                                <p className="text-sm text-gray-600">Total Documents</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3">
                            <Download className="w-10 h-10 text-green-500" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {documents.reduce((acc, doc) => acc + doc.downloads, 0)}
                                </p>
                                <p className="text-sm text-gray-600">Total Downloads</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3">
                            <Eye className="w-10 h-10 text-blue-500" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {documents.reduce((acc, doc) => acc + doc.views, 0)}
                                </p>
                                <p className="text-sm text-gray-600">Total Views</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upload Form */}
                {showUploadForm && (
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload New Document</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Author
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Published Year
                                    </label>
                                    <input
                                        type="number"
                                        min="1900"
                                        max={new Date().getFullYear()}
                                        value={formData.publishedYear}
                                        onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Document File (PDF, DOC, DOCX, EPUB) *
                                </label>
                                <input
                                    type="file"
                                    required
                                    accept=".pdf,.doc,.docx,.epub"
                                    onChange={handleFileChange}
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Cover Image (Optional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverImageChange}
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                                />
                            </div>

                            {/* Upload Progress */}
                            {uploadProgress && (
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <Upload className="w-5 h-5 text-orange-500 animate-bounce" />
                                        <p className="text-sm font-medium text-orange-700">{uploadProgress}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                                />
                                <label htmlFor="featured" className="text-sm font-semibold text-gray-700">
                                    Mark as Featured
                                </label>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploading ? "Uploading..." : "Upload Document"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowUploadForm(false)}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Documents Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Document
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Stats
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Featured
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {documents.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-gray-900">{doc.title}</p>
                                                {doc.author && (
                                                    <p className="text-sm text-gray-600">by {doc.author}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-gray-700">
                                                {doc.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 text-sm text-gray-600">
                                                <span>📥 {doc.downloads} downloads</span>
                                                <span>👁️ {doc.views} views</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleFeatured(doc.id, doc.featured)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${doc.featured
                                                    ? "bg-orange-100 text-orange-700"
                                                    : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {doc.featured ? "⭐ Featured" : "Add to Featured"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(doc.id)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
