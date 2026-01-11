import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { ChefHat, BookOpen, Users, Eye } from "lucide-react";

export default async function AdminDashboard() {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
        redirect("/login");
    }

    // Get statistics
    const [totalRecipes, totalUsers, totalViews, recentRecipes] = await Promise.all([
        prisma.recipe.count(),
        prisma.user.count(),
        prisma.recipe.aggregate({
            _sum: { views: true },
        }),
        prisma.recipe.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                category: true,
                _count: {
                    select: { ingredients: true, reviews: true },
                },
            },
        }),
    ]);

    const stats = [
        {
            label: "Total Recipes",
            value: totalRecipes,
            icon: BookOpen,
            color: "orange",
        },
        {
            label: "Total Users",
            value: totalUsers,
            icon: Users,
            color: "blue",
        },
        {
            label: "Total Views",
            value: totalViews._sum.views || 0,
            icon: Eye,
            color: "green",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ChefHat className="w-8 h-8 text-orange-500" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                                <p className="text-gray-600">Welcome back, {user.name}!</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/admin/recipes"
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Manage Recipes
                            </Link>
                            <Link
                                href="/"
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                View Site
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white rounded-xl p-6 shadow-sm border"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {stat.value.toLocaleString()}
                                    </p>
                                </div>
                                <div
                                    className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}
                                >
                                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href="/admin/recipes/new"
                            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-center"
                        >
                            <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                            <p className="font-semibold text-gray-900">Create New Recipe</p>
                        </Link>
                        <Link
                            href="/admin/recipes/import"
                            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-center"
                        >
                            <ChefHat className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                            <p className="font-semibold text-gray-900">Import from YouTube</p>
                        </Link>
                        <Link
                            href="/admin/recipes"
                            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-center"
                        >
                            <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                            <p className="font-semibold text-gray-900">View All Recipes</p>
                        </Link>
                    </div>
                </div>

                {/* Recent Recipes */}
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Recipes</h2>
                    <div className="space-y-3">
                        {recentRecipes.map((recipe) => (
                            <div
                                key={recipe.id}
                                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative w-16 h-16 flex-shrink-0">
                                        <Image
                                            src={recipe.imageUrl}
                                            alt={recipe.title}
                                            fill
                                            className="rounded-lg object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{recipe.title}</h3>
                                        <p className="text-sm text-gray-600">
                                            {recipe.category.name} • {recipe._count.ingredients} ingredients •{" "}
                                            {recipe._count.reviews} reviews
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/recipes/${recipe.slug}`}
                                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                                    >
                                        View
                                    </Link>
                                    <Link
                                        href={`/admin/recipes/${recipe.id}/edit`}
                                        className="px-3 py-1 text-sm text-orange-600 hover:text-orange-700"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
