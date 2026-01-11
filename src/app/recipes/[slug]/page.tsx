import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import RecipeDetailClient from "@/components/recipe/RecipeDetailClient";

export default async function RecipePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    // Await params in Next.js 15
    const { slug } = await params;

    const recipe = await prisma.recipe.findUnique({
        where: { slug },
        include: {
            ingredients: {
                orderBy: { order: "asc" },
            },
            directions: {
                orderBy: { stepNumber: "asc" },
            },
            nutrition: true,
            category: true,
            author: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
            reviews: {
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: 10,
            },
        },
    });

    if (!recipe) {
        notFound();
    }

    // Increment view count
    await prisma.recipe.update({
        where: { id: recipe.id },
        data: { views: { increment: 1 } },
    });

    return <RecipeDetailClient recipe={recipe} />;
}
