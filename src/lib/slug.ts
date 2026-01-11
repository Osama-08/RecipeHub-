// Slug generation utilities
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export async function generateUniqueSlug(
    title: string,
    prisma: any,
    excludeId?: string
): Promise<string> {
    let slug = generateSlug(title);
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
        const existingRecipe = await prisma.recipe.findUnique({
            where: { slug },
            select: { id: true },
        });

        // If no recipe found, or found recipe is the one we're editing
        if (!existingRecipe || (excludeId && existingRecipe.id === excludeId)) {
            isUnique = true;
        } else {
            // Add counter to slug
            slug = `${generateSlug(title)}-${counter}`;
            counter++;
        }
    }

    return slug;
}
