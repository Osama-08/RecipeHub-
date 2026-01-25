// Groq AI Provider - High-performance AI with generous rate limits
// Documentation: https://console.groq.com/docs/quickstart

export type GroqModel =
    | "llama-3.3-70b-versatile"
    | "llama-3.1-70b-versatile"
    | "llama-3.1-8b-instant"
    | "mixtral-8x7b-32768"
    | "gemma2-9b-it";

export interface GroqMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface GroqResponse {
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

export class GroqProvider {
    private apiKey: string;
    private baseURL = "https://api.groq.com/openai/v1";

    constructor(apiKey?: string) {
        this.apiKey = apiKey || process.env.GROQ_API_KEY || "";

        if (!this.apiKey) {
            throw new Error("Groq API key not found in environment variables");
        }
    }

    /**
     * Main chat method - sends messages to Groq
     */
    async chat(
        messages: GroqMessage[],
        model: GroqModel = "llama-3.3-70b-versatile",
        options: {
            temperature?: number;
            max_tokens?: number;
        } = {}
    ): Promise<{ content: string; tokensUsed: number; model: string }> {
        const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages,
                temperature: options.temperature ?? 0.7,
                max_tokens: options.max_tokens ?? 1024,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Groq API error: ${response.status} - ${errorText}`);
        }

        const data: GroqResponse = await response.json();

        return {
            content: data.choices[0]?.message?.content || "",
            tokensUsed: data.usage?.total_tokens || 0,
            model: data.model,
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
            model?: GroqModel;
        } = {}
    ): Promise<{
        title: string;
        content: string;
        summary?: string;
        category?: string;
    }> {
        const model = options.model || "llama-3.3-70b-versatile";

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
      2. Step-by-step explanation in continuous paragraph form (2-3 paragraphs total)
      3. Why it works
      
      IMPORTANT: The "content" field must be plain text paragraphs, NOT an object with steps or keys.
      
      Format as JSON:
      {
        "title": "...",
        "content": "... (continuous text, multiple paragraphs) ...",
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

        const messages: GroqMessage[] = [
            {
                role: "system",
                content: "You are a professional culinary content creator. Generate original, high-quality cooking content. Always respond with valid JSON only, no extra text.",
            },
            {
                role: "user",
                content: prompt,
            },
        ];

        const result = await this.chat(messages, model, {
            temperature: 0.8,
            max_tokens: 1024
        });

        // Extract JSON from response
        const jsonMatch = result.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                // First, try to clean the JSON string by removing/escaping control characters
                // that would break JSON.parse() while preserving the structure
                let cleanedJson = jsonMatch[0];

                // Replace actual newlines in string values with escaped newlines
                // This regex finds string values and escapes newlines within them
                cleanedJson = cleanedJson.replace(/"content"\s*:\s*"([\s\S]*?)"/g, (match, content) => {
                    // Escape control characters in the content
                    const escaped = content
                        .replace(/\\/g, '\\\\')  // Escape backslashes first
                        .replace(/\n/g, '\\n')   // Escape newlines
                        .replace(/\r/g, '\\r')   // Escape carriage returns
                        .replace(/\t/g, '\\t')   // Escape tabs
                        .replace(/"/g, '\\"');   // Escape quotes
                    return `"content": "${escaped}"`;
                });

                // Do the same for summary field if it exists
                cleanedJson = cleanedJson.replace(/"summary"\s*:\s*"([\s\S]*?)"/g, (match, content) => {
                    const escaped = content
                        .replace(/\\/g, '\\\\')
                        .replace(/\n/g, '\\n')
                        .replace(/\r/g, '\\r')
                        .replace(/\t/g, '\\t')
                        .replace(/"/g, '\\"');
                    return `"summary": "${escaped}"`;
                });

                return JSON.parse(cleanedJson);
            } catch (parseError) {
                console.error("JSON parse error:", parseError);
                console.error("Problematic JSON:", jsonMatch[0]);
                throw new Error(`Failed to parse generated content: ${parseError}`);
            }
        }


        throw new Error("Failed to generate content in expected format");
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
        model: GroqModel = "llama-3.3-70b-versatile"
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

        const messages: GroqMessage[] = [
            { role: "system", content: context },
            ...conversationHistory.map((msg) => ({
                role: msg.role as "user" | "assistant",
                content: msg.content,
            })),
            { role: "user", content: userMessage },
        ];

        const result = await this.chat(messages, model, { max_tokens: 512 });

        return {
            response: result.content,
            tokensUsed: result.tokensUsed,
        };
    }
}

