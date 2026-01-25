import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch user data
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                recipes: {
                    include: {
                        category: true,
                        ingredients: true,
                        directions: true,
                    }
                },
                savedRecipes: {
                    include: {
                        recipe: {
                            include: {
                                category: true,
                            }
                        }
                    }
                },
                posts: {
                    include: {
                        likes: true,
                        comments: true,
                    }
                },
                comments: true,
                likes: true,
                groupMemberships: {
                    include: {
                        group: true,
                    }
                },
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Prepare data export
        const exportData = {
            exportDate: new Date().toISOString(),
            exportVersion: '1.0',
            userData: {
                profile: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    bio: user.bio,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    role: user.role,
                },
                recipes: user.recipes.map(recipe => ({
                    id: recipe.id,
                    title: recipe.title,
                    description: recipe.description,
                    category: recipe.category?.name || '',
                    cuisine: recipe.cuisine,
                    cookTime: recipe.cookTime,
                    servings: recipe.servings,
                    difficulty: recipe.difficulty,
                    ingredients: recipe.ingredients.map(ing => ing.original),
                    directions: recipe.directions.map(dir => ({
                        step: dir.stepNumber,
                        instruction: dir.instruction
                    })),
                    imageUrl: recipe.imageUrl,
                    videoUrl: recipe.videoUrl,
                    createdAt: recipe.createdAt,
                })),
                savedRecipes: user.savedRecipes.map(saved => ({
                    recipeId: saved.recipeId,
                    recipeTitle: saved.recipe.title,
                    savedAt: saved.createdAt,
                })),
                communityActivity: {
                    posts: user.posts.map(post => ({
                        id: post.id,
                        content: post.content,
                        imageUrl: post.imageUrl,
                        likesCount: post.likes.length,
                        commentsCount: post.comments.length,
                        createdAt: post.createdAt,
                    })),
                    comments: user.comments.map(comment => ({
                        id: comment.id,
                        content: comment.content,
                        postId: comment.postId,
                        createdAt: comment.createdAt,
                    })),
                    likes: user.likes.map(like => ({
                        postId: like.postId,
                        createdAt: like.createdAt,
                    })),
                },
                groups: user.groupMemberships.map(membership => ({
                    groupId: membership.groupId,
                    groupName: membership.group.name,
                    role: membership.role,
                    joinedAt: membership.joinedAt,
                })),
            },
            statistics: {
                totalRecipes: user.recipes.length,
                totalSavedRecipes: user.savedRecipes.length,
                totalPosts: user.posts.length,
                totalComments: user.comments.length,
                totalLikes: user.likes.length,
                totalGroups: user.groupMemberships.length,
            }
        };

        // Return JSON file
        const fileName = `recipehub-data-export-${user.id}-${Date.now()}.json`;

        return new NextResponse(JSON.stringify(exportData, null, 2), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="${fileName}"`,
            },
        });

    } catch (error) {
        console.error('Error exporting user data:', error);
        return NextResponse.json(
            { error: 'Failed to export data' },
            { status: 500 }
        );
    }
}
