// Spoonacular API Integration
// Documentation: https://spoonacular.com/food-api/docs

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = "https://api.spoonacular.com";

export interface SpoonacularRecipe {
    id: number;
    title: string;
    image: string;
    summary: string;
    readyInMinutes: number;
    servings: number;
    pricePerServing: number;
    sourceUrl?: string;
    nutrition?: {
        nutrients: Array<{
            name: string;
            amount: number;
            unit: string;
        }>;
        ingredients: Array<{
            name: string;
            nutrients: Array<{
                name: string;
                amount: number;
                unit: string;
            }>;
        }>;
    };
    extendedIngredients?: Array<{
        id: number;
        name: string;
        amount: number;
        unit: string;
        original: string;
        nutrition?: {
            nutrients: Array<{
                name: string;
                amount: number;
                unit: string;
            }>;
        };
    }>;
    analyzedInstructions?: Array<{
        steps: Array<{
            number: number;
            step: string;
            ingredients: Array<{ id: number; name: string }>;
            equipment: Array<{ id: number; name: string }>;
            image?: string;
        }>;
    }>;
}

// Search for recipes
export async function searchRecipes(
    query: string,
    number: number = 10
): Promise<{ results: any[]; totalResults: number }> {
    const url = `${BASE_URL}/recipes/complexSearch?query=${encodeURIComponent(query)}&number=${number}&addRecipeInformation=true&fillIngredients=true&apiKey=${SPOONACULAR_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.statusText}`);
    }

    return response.json();
}

// Get full recipe details with nutrition
export async function getRecipeDetails(id: number): Promise<SpoonacularRecipe> {
    const url = `${BASE_URL}/recipes/${id}/information?includeNutrition=true&apiKey=${SPOONACULAR_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.statusText}`);
    }

    return response.json();
}

// Get analyzed instructions with step images
export async function getRecipeInstructions(id: number) {
    const url = `${BASE_URL}/recipes/${id}/analyzedInstructions?apiKey=${SPOONACULAR_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.statusText}`);
    }

    return response.json();
}

// Get random recipes
export async function getRandomRecipes(
    number: number = 10,
    tags?: string
): Promise<{ recipes: SpoonacularRecipe[] }> {
    let url = `${BASE_URL}/recipes/random?number=${number}&apiKey=${SPOONACULAR_API_KEY}`;
    if (tags) {
        url += `&tags=${encodeURIComponent(tags)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.statusText}`);
    }

    return response.json();
}

// Helper: Extract nutrition value by name
export function getNutrientValue(
    nutrients: Array<{ name: string; amount: number; unit: string }>,
    name: string
): number | undefined {
    const nutrient = nutrients.find(
        (n) => n.name.toLowerCase() === name.toLowerCase()
    );
    return nutrient?.amount;
}

// Helper: Generate slug from title
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

// Helper: Strip HTML from summary/description
export function stripHtml(html: string): string {
    return html
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .trim();
}

// Helper: Calculate prep and cook time (Spoonacular only gives readyInMinutes)
export function estimatePrepCookTime(totalMinutes: number): {
    prep: number;
    cook: number;
} {
    // Estimate: 25% prep, 75% cook for most recipes
    const prep = Math.round(totalMinutes * 0.25);
    const cook = totalMinutes - prep;
    return { prep, cook };
}

// Helper: Determine difficulty based on ready time and ingredient count
export function determineDifficulty(
    readyInMinutes: number,
    ingredientCount: number
): "Easy" | "Medium" | "Hard" {
    if (readyInMinutes <= 30 && ingredientCount <= 8) return "Easy";
    if (readyInMinutes > 60 || ingredientCount > 15) return "Hard";
    return "Medium";
}
