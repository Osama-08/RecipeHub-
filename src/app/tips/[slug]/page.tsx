import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import { Lightbulb, Eye, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

async function getTip(slug: string) {
    const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/tips/${slug}`, {
        cache: "no-store",
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.tip;
}

export default async function TipDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const tip = await getTip(slug);

    if (!tip) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Breadcrumbs */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-orange-600">
                            Home
                        </Link>
                        <span>/</span>
                        <Link href="/tips" className="hover:text-orange-600">
                            Kitchen Tips
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{tip.title}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-xl p-8 shadow-sm border mb-6">
                        <div className="flex items-center gap-2 text-orange-600 mb-4">
                            <Lightbulb className="w-5 h-5" />
                            <span className="font-semibold">{tip.category}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            {tip.title}
                        </h1>

                        <p className="text-xl text-gray-700 mb-6">{tip.description}</p>

                        <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                <span>{tip.views || 0} views</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(tip.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Image (if available) */}
                    {tip.imageUrl && (
                        <div className="mb-6 rounded-xl overflow-hidden">
                            <div className="relative w-full h-96">
                                <Image
                                    src={tip.imageUrl}
                                    alt={tip.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="bg-white rounded-xl p-8 shadow-sm border prose prose-lg max-w-none">
                        <div
                            className="text-gray-800 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: tip.content.replace(/\n/g, "<br />") }}
                        />
                    </div>

                    {/* Back Button */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/tips"
                            className="inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-bold hover:from-orange-600 hover:to-amber-600 transition-all"
                        >
                            ← Back to All Tips
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
