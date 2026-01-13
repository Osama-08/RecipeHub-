// Content Generator - AI-powered content creation for CaribbeanRecipe
// Generates kitchen tips, cooking hacks, and food trend summaries

import { OpenRouterProvider } from "./openrouter-provider";
import { prisma } from "./db";
import { generateSlug } from "./slug";

export type ContentType = "kitchen-tip" | "cooking-hack" | "food-trend";

export interface GeneratedContent {
    title: string;
    content: string;
    summary?: string;
    category?: string;
    difficulty?: string;
}

export class ContentGenerator {
    private openRouter: OpenRouterProvider;

    constructor() {
        this.openRouter = new OpenRouterProvider();
    }

    /**
     * Generate a kitchen tip
     */
    async generateKitchenTip(category?: string): Promise<{
        id: string;
        title: string;
        slug: string;
        content: string;
        category: string;
    }> {
        // Generate content using AI
        const generated = await this.openRouter.generateContent("kitchen-tip", {
            category,
            model: "anthropic/claude-3.5-sonnet",
        });

        // Create slug
        const slug = generateSlug(generated.title);

        // Save to database
        const tip = await prisma.kitchenTip.create({
            data: {
                title: generated.title,
                slug,
                category: generated.category || category || "cooking-basics",
                content: generated.content,
            },
        });

        return {
            id: tip.id,
            title: tip.title,
            slug: tip.slug,
            content: tip.content,
            category: tip.category,
        };
    }

    /**
     * Generate a cooking hack
     */
    async generateCookingHack(difficulty?: string): Promise<{
        id: string;
        title: string;
        slug: string;
        content: string;
        difficulty: string;
    }> {
        // Generate content using AI
        const generated = await this.openRouter.generateContent("cooking-hack", {
            difficulty,
            model: "anthropic/claude-3.5-sonnet",
        });

        // Create slug
        const slug = generateSlug(generated.title);

        // Estimate read time (rough approximation)
        const timeToRead = Math.ceil(generated.content.length / 200) * 10; // ~200 chars per 10 seconds

        // Save to database
        const hack = await prisma.cookingHack.create({
            data: {
                title: generated.title,
                slug,
                content: generated.content,
                difficulty: (generated as any).difficulty || difficulty || "easy",
                timeToRead,
            },
        });

        return {
            id: hack.id,
            title: hack.title,
            slug: hack.slug,
            content: hack.content,
            difficulty: hack.difficulty,
        };
    }

    /**
     * Generate a food trend summary
     */
    async generateTrendPost(): Promise<{
        id: string;
        title: string;
        slug: string;
        summary: string;
        content: string;
    }> {
        // Generate content using AI
        const generated = await this.openRouter.generateContent("food-trend", {
            model: "anthropic/claude-3.5-sonnet",
        });

        // Create slug
        const slug = generateSlug(generated.title);

        // Save to database
        const trend = await prisma.trendPost.create({
            data: {
                title: generated.title,
                slug,
                summary: generated.summary || generated.content.substring(0, 200),
                content: generated.content,
            },
        });

        return {
            id: trend.id,
            title: trend.title,
            slug: trend.slug,
            summary: trend.summary,
            content: trend.content,
        };
    }

    /**
     * Batch generate multiple tips
     */
    async batchGenerateTips(count: number, categories?: string[]): Promise<any[]> {
        const results = [];
        const categoriesToUse = categories || [
            "knife-skills",
            "food-safety",
            "storage",
            "meal-prep",
            "cooking-basics",
        ];

        for (let i = 0; i < count; i++) {
            const category = categoriesToUse[i % categoriesToUse.length];
            try {
                const tip = await this.generateKitchenTip(category);
                results.push(tip);

                // Add delay to avoid rate limiting
                await new Promise((resolve) => setTimeout(resolve, 2000));
            } catch (error) {
                console.error(`Failed to generate tip ${i + 1}:`, error);
            }
        }

        return results;
    }

    /**
     * Batch generate multiple hacks
     */
    async batchGenerateHacks(count: number): Promise<any[]> {
        const results = [];
        const difficulties = ["easy", "medium", "advanced"];

        for (let i = 0; i < count; i++) {
            const difficulty = difficulties[i % difficulties.length];
            try {
                const hack = await this.generateCookingHack(difficulty);
                results.push(hack);

                // Add delay to avoid rate limiting
                await new Promise((resolve) => setTimeout(resolve, 2000));
            } catch (error) {
                console.error(`Failed to generate hack ${i + 1}:`, error);
            }
        }

        return results;
    }

    /**
     * Generate daily content package (1 tip, 1 hack, 1 trend)
     */
    async generateDailyContent(): Promise<{
        tip: any;
        hack: any;
        trend: any;
    }> {
        const tip = await this.generateKitchenTip();
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const hack = await this.generateCookingHack();
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const trend = await this.generateTrendPost();

        return { tip, hack, trend };
    }

    /**
     * Get featured content for homepage
     */
    async getFeaturedContent(): Promise<{
        tips: any[];
        hacks: any[];
        trends: any[];
    }> {
        const [tips, hacks, trends] = await Promise.all([
            prisma.kitchenTip.findMany({
                where: { featured: true },
                orderBy: { publishedAt: "desc" },
                take: 3,
            }),
            prisma.cookingHack.findMany({
                where: { featured: true },
                orderBy: { publishedAt: "desc" },
                take: 3,
            }),
            prisma.trendPost.findMany({
                where: { featured: true },
                orderBy: { publishedAt: "desc" },
                take: 3,
            }),
        ]);

        return { tips, hacks, trends };
    }

    /**
     * Mark content as featured
     */
    async setFeatured(type: "tip" | "hack" | "trend", id: string, featured: boolean): Promise<void> {
        if (type === "tip") {
            await prisma.kitchenTip.update({
                where: { id },
                data: { featured },
            });
        } else if (type === "hack") {
            await prisma.cookingHack.update({
                where: { id },
                data: { featured },
            });
        } else {
            await prisma.trendPost.update({
                where: { id },
                data: { featured },
            });
        }
    }

    /**
     * Rotate featured content (unfeature old, feature new)
     */
    async rotateFeaturedContent(): Promise<void> {
        // Unfeature all current featured content
        await Promise.all([
            prisma.kitchenTip.updateMany({
                where: { featured: true },
                data: { featured: false },
            }),
            prisma.cookingHack.updateMany({
                where: { featured: true },
                data: { featured: false },
            }),
            prisma.trendPost.updateMany({
                where: { featured: true },
                data: { featured: false },
            }),
        ]);

        // Feature 3 random recent items from each category
        const recentTips = await prisma.kitchenTip.findMany({
            orderBy: { publishedAt: "desc" },
            take: 10,
        });

        const recentHacks = await prisma.cookingHack.findMany({
            orderBy: { publishedAt: "desc" },
            take: 10,
        });

        const recentTrends = await prisma.trendPost.findMany({
            orderBy: { publishedAt: "desc" },
            take: 10,
        });

        // Randomly select 3 from each
        const selectedTips = this.randomSelect(recentTips, 3);
        const selectedHacks = this.randomSelect(recentHacks, 3);
        const selectedTrends = this.randomSelect(recentTrends, 3);

        // Update featured status
        await Promise.all([
            ...selectedTips.map((tip) =>
                prisma.kitchenTip.update({
                    where: { id: tip.id },
                    data: { featured: true },
                })
            ),
            ...selectedHacks.map((hack) =>
                prisma.cookingHack.update({
                    where: { id: hack.id },
                    data: { featured: true },
                })
            ),
            ...selectedTrends.map((trend) =>
                prisma.trendPost.update({
                    where: { id: trend.id },
                    data: { featured: true },
                })
            ),
        ]);
    }

    /**
     * Utility: Randomly select n items from array
     */
    private randomSelect<T>(array: T[], count: number): T[] {
        const shuffled = [...array].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, array.length));
    }
}
