// AI Provider Integration - Supports OpenAI and Google Gemini
// This module provides unified interface for AI chat functionality

import { GoogleGenerativeAI } from "@google/generative-ai";

export type AIProvider = "gemini" | "openai";

interface AIMessage {
    role: "user" | "assistant";
    content: string;
}

interface RecipeContext {
    id: string;
    title: string;
    ingredients: Array<{
        amount: string;
        unit?: string;
        name: string;
    }>;
    directions: Array<{
        stepNumber: number;
        instruction: string;
    }>;
    nutrition?: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    servings: number;
    prepTime: number;
    cookTime: number;
}

export class AIRecipeAssistant {
    private provider: AIProvider;
    private apiKey: string;
    private genAI?: GoogleGenerativeAI;

    constructor(provider: AIProvider = "gemini") {
        this.provider = provider;

        if (provider === "gemini") {
            this.apiKey = process.env.GEMINI_API_KEY || "";
            if (this.apiKey) {
                this.genAI = new GoogleGenerativeAI(this.apiKey);
            }
        } else {
            this.apiKey = process.env.OPENAI_API_KEY || "";
        }

        if (!this.apiKey) {
            throw new Error(`${provider.toUpperCase()} API key not found in environment variables`);
        }
    }

    /**
     * Build context prompt from recipe data
     */
    private buildRecipeContext(recipe: RecipeContext): string {
        let context = `You are a helpful cooking assistant. You're helping someone cook the following recipe:\n\n`;
        context += `**${recipe.title}**\n\n`;
        context += `**Servings:** ${recipe.servings}\n`;
        context += `**Prep Time:** ${recipe.prepTime} minutes\n`;
        context += `**Cook Time:** ${recipe.cookTime} minutes\n\n`;

        context += `**Ingredients:**\n`;
        recipe.ingredients.forEach((ing, idx) => {
            context += `${idx + 1}. ${ing.amount}${ing.unit ? " " + ing.unit : ""} ${ing.name}\n`;
        });

        context += `\n**Directions:**\n`;
        recipe.directions.forEach((dir) => {
            context += `Step ${dir.stepNumber}: ${dir.instruction}\n`;
        });

        if (recipe.nutrition) {
            context += `\n**Nutrition (per serving):**\n`;
            context += `- Calories: ${recipe.nutrition.calories}\n`;
            context += `- Protein: ${recipe.nutrition.protein}g\n`;
            context += `- Carbs: ${recipe.nutrition.carbs}g\n`;
            context += `- Fat: ${recipe.nutrition.fat}g\n`;
        }

        context += `\n\nYou can answer questions about:\n`;
        context += `- Ingredients and substitutions\n`;
        context += `- Step-by-step instructions\n`;
        context += `- Cooking techniques\n`;
        context += `- Scaling the recipe\n`;
        context += `- Nutrition information\n`;
        context += `- Timing and preparation\n\n`;
        context += `Be concise, helpful, and friendly. If you don't know something specific about this recipe, say so.`;

        return context;
    }

    /**
     * Chat with AI about a recipe using Gemini
     */
    private async chatWithGemini(
        recipe: RecipeContext,
        userMessage: string,
        conversationHistory: AIMessage[] = []
    ): Promise<{ response: string; tokensUsed: number }> {
        if (!this.genAI) {
            throw new Error("Gemini AI not initialized");
        }

        const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Build full conversation history
        const systemContext = this.buildRecipeContext(recipe);

        // Format history for Gemini
        const chatHistory = conversationHistory.map((msg) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
        }));

        // Start chat with history
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemContext }],
                },
                {
                    role: "model",
                    parts: [{ text: "I understand! I'm ready to help you with this recipe. What would you like to know?" }],
                },
                ...chatHistory,
            ],
        });

        const result = await chat.sendMessage(userMessage);
        const response = result.response;
        const text = response.text();

        // Gemini doesn't return token usage in the same way as OpenAI
        // Estimate tokens (rough approximation: 1 token ≈ 4 characters)
        const estimatedTokens = Math.ceil((systemContext.length + userMessage.length + text.length) / 4);

        return {
            response: text,
            tokensUsed: estimatedTokens,
        };
    }

    /**
     * Chat with AI about a recipe using OpenAI
     */
    private async chatWithOpenAI(
        recipe: RecipeContext,
        userMessage: string,
        conversationHistory: AIMessage[] = []
    ): Promise<{ response: string; tokensUsed: number }> {
        const systemContext = this.buildRecipeContext(recipe);

        const messages = [
            { role: "system" as const, content: systemContext },
            ...conversationHistory.map((msg) => ({
                role: msg.role as "user" | "assistant",
                content: msg.content,
            })),
            { role: "user" as const, content: userMessage },
        ];

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages,
                temperature: 0.7,
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            response: data.choices[0].message.content,
            tokensUsed: data.usage?.total_tokens || 0,
        };
    }

    /**
     * Main chat method - routes to correct provider
     */
    async chat(
        recipe: RecipeContext,
        userMessage: string,
        conversationHistory: AIMessage[] = []
    ): Promise<{ response: string; tokensUsed: number }> {
        if (this.provider === "gemini") {
            return this.chatWithGemini(recipe, userMessage, conversationHistory);
        } else {
            return this.chatWithOpenAI(recipe, userMessage, conversationHistory);
        }
    }

    /**
     * Generate suggested questions for a recipe
     */
    getSuggestedQuestions(recipe: RecipeContext): string[] {
        return [
            "What ingredients do I need?",
            "What's the next step?",
            "How do I scale this recipe for more servings?",
            "Can I substitute any ingredients?",
            "How many calories is this?",
            `Is this ${recipe.nutrition && recipe.nutrition.protein > 20 ? "high" : "low"} in protein?`,
            "How long will this take to make?",
            "What cooking techniques are used?",
        ];
    }
}
