// OpenRouter AI Provider - Multi-Model Support
// Provides unified interface for multiple AI models via OpenRouter
// Documentation: https://openrouter.ai/docs

export type OpenRouterModel =
    | "openai/gpt-4-turbo"
    | "openai/gpt-3.5-turbo"
    | "anthropic/claude-3-opus"
    | "anthropic/claude-3.5-sonnet"
    | "google/gemini-pro"
    | "meta-llama/llama-3-70b-instruct"
    | "google/gemini-flash-1.5:free"
    | "meta-llama/llama-3.1-8b-instruct:free";

export interface OpenRouterMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface OpenRouterResponse {
    id: string;
    model: string;
    choices: Array<{
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }>;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export interface AIIntentResult {
    intent:
    | "recipe_search"
    | "cooking_help"
    | "substitution"
    | "meal_planning"
    | "grocery_list"
    | "general_question"
    | "content_generation";
    confidence: number;
    extractedParams: Record<string, any>;
    shouldCallAPI: boolean;
}

export class OpenRouterProvider {
    private apiKey: string;
    private baseURL = "https://openrouter.ai/api/v1";
    private siteName: string;
    private siteUrl: string;

    constructor(
        apiKey?: string,
        siteName = "CaribbeanRecipe AI",
        siteUrl = "http://localhost:3000"
    ) {
        this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || "";
        this.siteName = siteName;
        this.siteUrl = siteUrl;

        if (!this.apiKey) {
            throw new Error("OpenRouter API key not found in environment variables");
        }
    }

    /**
     * Detect user intent from natural language query
     */
    async detectIntent(userMessage: string): Promise<AIIntentResult> {
        const messages: OpenRouterMessage[] = [
            {
                role: "system",
                content: `You are an intent classifier for a cooking assistant. Analyze the user's message and classify it into one of these intents:
- recipe_search: User wants to find recipes (extract: query, cuisine, diet, occasion)
- cooking_help: User needs help with cooking a specific recipe
- substitution: User wants ingredient substitutions
- meal_planning: User wants meal planning help
- grocery_list: User wants to generate a grocery list
- general_question: General cooking questions
- content_generation: Request to generate tips/tricks/content

Respond ONLY with valid JSON in this format:
{
  "intent": "intent_name",
  "confidence": 0.0-1.0,
  "extractedParams": {},
  "shouldCallAPI": true/false
}

Set shouldCallAPI to true if we need to fetch recipes from Spoonacular.`,
            },
            {
                role: "user",
                content: userMessage,
            },
        ];

        try {
            const response = await this.chat(messages, "openai/gpt-3.5-turbo", {
                temperature: 0.3,
                max_tokens: 200,
            });

            // Parse JSON response
            const jsonMatch = response.content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            // Fallback
            return {
                intent: "general_question",
                confidence: 0.5,
                extractedParams: {},
                shouldCallAPI: false,
            };
        } catch (error) {
            console.error("Intent detection error:", error);
            return {
                intent: "general_question",
                confidence: 0.3,
                extractedParams: {},
                shouldCallAPI: false,
            };
        }
    }

    /**
     * Main chat method - sends messages to OpenRouter
     */
    async chat(
        messages: OpenRouterMessage[],
        model: OpenRouterModel = "openai/gpt-4-turbo",
        options: {
            temperature?: number;
            max_tokens?: number;
            top_p?: number;
        } = {}
    ): Promise<{ content: string; tokensUsed: number; model: string }> {
        const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
                "HTTP-Referer": this.siteUrl,
                "X-Title": this.siteName,
            },
            body: JSON.stringify({
                model,
                messages,
                temperature: options.temperature ?? 0.7,
                max_tokens: options.max_tokens ?? 1000,
                top_p: options.top_p ?? 1,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
        }

        const data: OpenRouterResponse = await response.json();

        return {
            content: data.choices[0]?.message?.content || "",
            tokensUsed: data.usage?.total_tokens || 0,
            model: data.model,
        };
    }

    /**
     * Recipe-specific chat with context
     */
    async chatWithRecipeContext(
        recipe: {
            title: string;
            ingredients: Array<{ amount: string; unit?: string; name: string }>;
            directions: Array<{ stepNumber: number; instruction: string }>;
            servings: number;
            prepTime: number;
            cookTime: number;
            nutrition?: { calories: number; protein: number; carbs: number; fat: number };
        },
        userMessage: string,
        conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = [],
        model: OpenRouterModel = "openai/gpt-4-turbo"
    ): Promise<{ response: string; tokensUsed: number }> {
        // Build recipe context
        let context = `You are a professional cooking assistant helping with this recipe:\n\n`;
        context += `**${recipe.title}**\n`;
        context += `- Servings: ${recipe.servings}\n`;
        context += `- Prep: ${recipe.prepTime}min | Cook: ${recipe.cookTime}min\n\n`;

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
            context += `Calories: ${recipe.nutrition.calories} | Protein: ${recipe.nutrition.protein}g | `;
            context += `Carbs: ${recipe.nutrition.carbs}g | Fat: ${recipe.nutrition.fat}g\n`;
        }

        context += `\nAnswer cooking questions concisely and helpfully. If asked about substitutions, provide specific ratios and tips. Never hallucinate ingredient quantities.`;

        const messages: OpenRouterMessage[] = [
            { role: "system", content: context },
            ...conversationHistory.map((msg) => ({
                role: msg.role as "user" | "assistant",
                content: msg.content,
            })),
            { role: "user", content: userMessage },
        ];

        const result = await this.chat(messages, model, { max_tokens: 500 });

        return {
            response: result.content,
            tokensUsed: result.tokensUsed,
        };
    }

    /**
     * Generate cooking content (tips, hacks, trends)
     */
    async generateContent(
        type: "kitchen-tip" | "cooking-hack" | "food-trend",
        options: {
            category?: string;
            difficulty?: string;
            model?: OpenRouterModel;
        } = {}
    ): Promise<{
        title: string;
        content: string;
        summary?: string;
        category?: string;
    }> {
        const model = options.model || "anthropic/claude-3.5-sonnet";

        let prompt = "";

        if (type === "kitchen-tip") {
            prompt = `Generate a practical kitchen tip for home cooks. ${options.category ? `Category: ${options.category}` : ""
                }
      
      Provide:
      1. A catchy title (max 60 characters)
      2. Detailed content (2-3 paragraphs, practical and actionable)
      3. Category (one of: knife-skills, food-safety, storage, meal-prep, cooking-basics)
      
      Format as JSON:
      {
        "title": "...",
        "content": "...",
        "category": "..."
      }`;
        } else if (type === "cooking-hack") {
            prompt = `Generate an innovative cooking hack or shortcut. ${options.difficulty ? `Difficulty: ${options.difficulty}` : ""
                }
      
      Provide:
      1. A catchy title (max 60 characters)
      2. Step-by-step explanation (2-3 paragraphs)
      3. Why it works
      
      Format as JSON:
      {
        "title": "...",
        "content": "...",
        "difficulty": "easy|medium|advanced"
      }`;
        } else {
            prompt = `Summarize a current food trend or culinary innovation in an engaging way.
      
      Provide:
      1. A compelling title (max 60 characters)
      2. Summary (1 paragraph overview)
      3. Detailed content (2-3 paragraphs)
      
      Format as JSON:
      {
        "title": "...",
        "summary": "...",
        "content": "..."
      }`;
        }

        const messages: OpenRouterMessage[] = [
            {
                role: "system",
                content: "You are a professional culinary content creator. Generate original, high-quality cooking content.",
            },
            {
                role: "user",
                content: prompt,
            },
        ];

        const result = await this.chat(messages, model, { temperature: 0.8 });

        // Extract JSON from response
        const jsonMatch = result.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            // Sanitize JSON string to remove control characters
            const sanitizedJson = jsonMatch[0].replace(/[\x00-\x1F\x7F]/g, (char) => {
                // Replace common control characters with their escaped equivalents
                const replacements: Record<string, string> = {
                    '\n': '\\n',
                    '\r': '\\r',
                    '\t': '\\t',
                };
                return replacements[char] || '';
            });

            try {
                return JSON.parse(sanitizedJson);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                console.error('Problematic JSON:', sanitizedJson);
                throw new Error(`Failed to parse generated content: ${parseError}`);
            }
        }

        throw new Error("Failed to generate content in expected format");
    }

    /**
     * Get model recommendation based on task
     */
    getRecommendedModel(task: string): OpenRouterModel {
        const taskLower = task.toLowerCase();

        if (taskLower.includes("creative") || taskLower.includes("content")) {
            return "anthropic/claude-3.5-sonnet"; // Best for creative content
        }

        if (taskLower.includes("quick") || taskLower.includes("simple")) {
            return "openai/gpt-3.5-turbo"; // Fast and cheap
        }

        if (taskLower.includes("complex") || taskLower.includes("reasoning")) {
            return "openai/gpt-4-turbo"; // Best reasoning
        }

        if (taskLower.includes("search") || taskLower.includes("classify")) {
            return "google/gemini-pro"; // Good at classification
        }

        return "openai/gpt-4-turbo"; // Default
    }

    /**
     * Generate grocery list from recipe(s)
     */
    async generateGroceryList(
        recipes: Array<{
            title: string;
            ingredients: Array<{ amount: string; unit?: string; name: string }>;
        }>
    ): Promise<{
        byCategory: Record<string, Array<{ item: string; amount: string }>>;
        totalItems: number;
    }> {
        const allIngredients = recipes.flatMap((r) =>
            r.ingredients.map((ing) => ({
                recipe: r.title,
                ingredient: `${ing.amount}${ing.unit ? " " + ing.unit : ""} ${ing.name}`,
            }))
        );

        const messages: OpenRouterMessage[] = [
            {
                role: "system",
                content: `You are a grocery shopping assistant. Organize ingredients by store category and consolidate duplicates.
        
        Categories: produce, dairy, meat, pantry, spices, frozen, bakery, other
        
        For duplicates, intelligently combine amounts (e.g., "1 cup milk" + "2 cups milk" = "3 cups milk").
        
        Respond with JSON:
        {
          "byCategory": {
            "produce": [{"item": "tomatoes", "amount": "3 large"}],
            ...
          }
        }`,
            },
            {
                role: "user",
                content: `Organize these ingredients:\n${allIngredients.map((i) => i.ingredient).join("\n")}`,
            },
        ];

        const result = await this.chat(messages, "openai/gpt-4-turbo", {
            temperature: 0.3,
            max_tokens: 1500,
        });

        const jsonMatch = result.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            const totalItems = Object.values(parsed.byCategory).reduce(
                (sum: number, items: any) => sum + items.length,
                0
            );
            return { ...parsed, totalItems };
        }

        throw new Error("Failed to generate grocery list");
    }
}
