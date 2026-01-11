// AI Orchestrator - Smart routing and intent detection
// Decides when to use Spoonacular API, database, or AI generation

import { OpenRouterProvider, AIIntentResult } from "./openrouter-provider";
import { searchRecipes, getRecipeDetails } from "./spoonacular";
import { prisma } from "./db";

export interface RecipeSearchParams {
    query?: string;
    cuisine?: string;
    diet?: string;
    occasion?: string;
    limit?: number;
}

export interface OrchestratorResponse {
    type: "text" | "recipes" | "grocery_list" | "content";
    message: string;
    data?: any;
    tokensUsed: number;
    sources: string[]; // "database", "spoonacular", "ai"
}

export class AIOrchestrator {
    private openRouter: OpenRouterProvider;

    constructor() {
        this.openRouter = new OpenRouterProvider();
    }

    /**
     * Main orchestration method - routes user requests intelligently
     */
    async handleRequest(
        userMessage: string,
        context?: {
            userId?: string;
            recipeId?: string;
            conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
        }
    ): Promise<OrchestratorResponse> {
        const sources: string[] = [];

        // Step 1: Detect user intent
        const intent = await this.openRouter.detectIntent(userMessage);
        sources.push("ai");

        // Step 2: Route based on intent
        switch (intent.intent) {
            case "recipe_search":
                return await this.handleRecipeSearch(userMessage, intent, sources);

            case "substitution":
                return await this.handleSubstitution(userMessage, context, sources);

            case "grocery_list":
                return await this.handleGroceryList(userMessage, context, sources);

            case "meal_planning":
                return await this.handleMealPlanning(userMessage, sources);

            case "content_generation":
                return await this.handleContentGeneration(userMessage, intent, sources);

            case "cooking_help":
            case "general_question":
            default:
                return await this.handleGeneralQuestion(userMessage, context, sources);
        }
    }

    /**
     * Handle recipe search - check database first, then Spoonacular
     */
    private async handleRecipeSearch(
        userMessage: string,
        intent: AIIntentResult,
        sources: string[]
    ): Promise<OrchestratorResponse> {
        const params: RecipeSearchParams = {
            query: intent.extractedParams.query || "",
            cuisine: intent.extractedParams.cuisine,
            diet: intent.extractedParams.diet,
            occasion: intent.extractedParams.occasion,
            limit: 10,
        };

        let recipes: any[] = [];
        let totalTokens = 0;

        // Try database first
        try {
            const dbRecipes = await this.searchDatabase(params);
            if (dbRecipes.length > 0) {
                recipes.push(...dbRecipes);
                sources.push("database");
            }
        } catch (error) {
            console.error("Database search error:", error);
        }

        // If not enough results, try Spoonacular
        if (recipes.length < 5 && params.query) {
            try {
                const spoonacularResults = await searchRecipes(params.query, 10);
                recipes.push(...spoonacularResults.results.slice(0, 10 - recipes.length));
                sources.push("spoonacular");
            } catch (error) {
                console.error("Spoonacular search error:", error);
            }
        }

        // Generate natural language response
        const model = this.openRouter.getRecommendedModel("quick response");
        const aiResponse = await this.openRouter.chat(
            [
                {
                    role: "system",
                    content: `You are a helpful cooking assistant. The user searched for recipes and we found ${recipes.length} results. Summarize the results in 1-2 sentences, highlighting what makes them interesting.`,
                },
                {
                    role: "user",
                    content: `User query: "${userMessage}"\n\nFound recipes: ${recipes.map((r: any) => r.title).join(", ")}`,
                },
            ],
            model,
            { max_tokens: 150 }
        );

        totalTokens += aiResponse.tokensUsed;

        return {
            type: "recipes",
            message: aiResponse.content,
            data: { recipes, totalResults: recipes.length },
            tokensUsed: totalTokens,
            sources,
        };
    }

    /**
     * Handle ingredient substitution questions
     */
    private async handleSubstitution(
        userMessage: string,
        context: any,
        sources: string[]
    ): Promise<OrchestratorResponse> {
        const model = this.openRouter.getRecommendedModel("reasoning");

        const systemPrompt = `You are a professional chef specializing in ingredient substitutions. 
    
    When suggesting substitutions:
    - Provide EXACT ratios (e.g., "Use 3/4 cup oil for 1 cup butter")
    - Explain how it affects flavor/texture
    - Never hallucinate measurements
    - Mention if the substitution works better in certain dishes
    - Be concise but thorough`;

        const messages = [
            { role: "system" as const, content: systemPrompt },
            ...(context?.conversationHistory || []).map((msg: any) => ({
                role: msg.role as "user" | "assistant",
                content: msg.content
            })),
            { role: "user" as const, content: userMessage },
        ];

        const response = await this.openRouter.chat(messages, model, { max_tokens: 400 });

        return {
            type: "text",
            message: response.content,
            tokensUsed: response.tokensUsed,
            sources,
        };
    }

    /**
     * Handle grocery list generation
     */
    private async handleGroceryList(
        userMessage: string,
        context: any,
        sources: string[]
    ): Promise<OrchestratorResponse> {
        // Extract recipe IDs from message or context
        const recipeIds = this.extractRecipeIds(userMessage, context);

        if (recipeIds.length === 0) {
            return {
                type: "text",
                message: "Please specify which recipes you'd like to create a grocery list for, or share recipe links.",
                tokensUsed: 0,
                sources,
            };
        }

        // Fetch recipes from database
        const recipes = await prisma.recipe.findMany({
            where: { id: { in: recipeIds } },
            include: { ingredients: true },
        });

        sources.push("database");

        // Generate grocery list using AI
        const groceryData = await this.openRouter.generateGroceryList(
            recipes.map((r) => ({
                title: r.title,
                ingredients: r.ingredients.map((ing) => ({
                    amount: ing.amount,
                    unit: ing.unit || undefined,
                    name: ing.name,
                })),
            }))
        );

        // Format response
        let message = `📋 **Grocery List for ${recipes.length} recipe(s)**\n\n`;
        Object.entries(groceryData.byCategory).forEach(([category, items]: [string, any]) => {
            message += `**${category.toUpperCase()}**\n`;
            items.forEach((item: any) => {
                message += `- ${item.amount} ${item.item}\n`;
            });
            message += `\n`;
        });

        return {
            type: "grocery_list",
            message,
            data: groceryData,
            tokensUsed: 0, // Included in OpenRouter call
            sources,
        };
    }

    /**
     * Handle meal planning requests
     */
    private async handleMealPlanning(
        userMessage: string,
        sources: string[]
    ): Promise<OrchestratorResponse> {
        const model = this.openRouter.getRecommendedModel("creative");

        const messages = [
            {
                role: "system" as const,
                content: `You are a meal planning expert. Create balanced, practical meal plans based on user preferences.
        
        Consider:
        - Dietary restrictions
        - Cooking time
        - Ingredient overlap to reduce waste
        - Nutritional balance
        - Variety in cuisines and proteins
        
        Format your response with clear days and meals.`,
            },
            { role: "user" as const, content: userMessage },
        ];

        const response = await this.openRouter.chat(messages, model, { max_tokens: 800 });

        return {
            type: "text",
            message: response.content,
            tokensUsed: response.tokensUsed,
            sources,
        };
    }

    /**
     * Handle content generation (tips, hacks, trends)
     */
    private async handleContentGeneration(
        userMessage: string,
        intent: AIIntentResult,
        sources: string[]
    ): Promise<OrchestratorResponse> {
        const contentType = intent.extractedParams.type || "kitchen-tip";

        const content = await this.openRouter.generateContent(contentType, {
            category: intent.extractedParams.category,
            difficulty: intent.extractedParams.difficulty,
        });

        return {
            type: "content",
            message: `Generated ${contentType}: **${content.title}**\n\n${content.content}`,
            data: content,
            tokensUsed: 0,
            sources,
        };
    }

    /**
     * Handle general cooking questions
     */
    private async handleGeneralQuestion(
        userMessage: string,
        context: any,
        sources: string[]
    ): Promise<OrchestratorResponse> {
        const model = this.openRouter.getRecommendedModel("reasoning");

        const systemPrompt = `You are a professional cooking assistant and chef. Answer cooking questions with:
    - Clear, concise explanations
    - Practical tips
    - Safety warnings when relevant
    - Technique demonstrations when helpful
    
    If you don't know something specific, say so rather than guessing.`;

        const messages = [
            { role: "system" as const, content: systemPrompt },
            ...(context?.conversationHistory || []).map((msg: any) => ({
                role: msg.role as "user" | "assistant",
                content: msg.content,
            })),
            { role: "user" as const, content: userMessage },
        ];

        const response = await this.openRouter.chat(messages, model, { max_tokens: 500 });

        return {
            type: "text",
            message: response.content,
            tokensUsed: response.tokensUsed,
            sources,
        };
    }

    /**
     * Search database for recipes
     */
    private async searchDatabase(params: RecipeSearchParams): Promise<any[]> {
        const where: any = {};

        if (params.query) {
            where.OR = [
                { title: { contains: params.query, mode: "insensitive" } },
                { description: { contains: params.query, mode: "insensitive" } },
            ];
        }

        if (params.cuisine) {
            where.cuisine = { contains: params.cuisine, mode: "insensitive" };
        }

        if (params.occasion) {
            where.occasion = { contains: params.occasion, mode: "insensitive" };
        }

        const recipes = await prisma.recipe.findMany({
            where,
            take: params.limit || 10,
            include: {
                category: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return recipes;
    }

    /**
     * Extract recipe IDs from message or context
     */
    private extractRecipeIds(message: string, context: any): string[] {
        const ids: string[] = [];

        // Check context for recipe ID
        if (context?.recipeId) {
            ids.push(context.recipeId);
        }

        // Extract IDs from message (format: recipe-id-xxx or /recipes/slug)
        const idMatches = message.match(/recipe[_-]id[_-]([a-z0-9]+)/gi);
        if (idMatches) {
            ids.push(...idMatches.map((m) => m.split(/[_-]/).pop()!));
        }

        return [...new Set(ids)]; // Remove duplicates
    }
}
