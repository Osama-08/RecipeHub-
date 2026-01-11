import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding categories...');

    const categories = [
        { name: 'Breakfast', slug: 'breakfast' },
        { name: 'Lunch', slug: 'lunch' },
        { name: 'Dinner', slug: 'dinner' },
        { name: 'Desserts', slug: 'desserts' },
        { name: 'Appetizers', slug: 'appetizers' },
        { name: 'Snacks', slug: 'snacks' },
        { name: 'Beverages', slug: 'beverages' },
        { name: 'Salads', slug: 'salads' },
        { name: 'Soups', slug: 'soups' },
        { name: 'Main Course', slug: 'main-course' },
        { name: 'Side Dishes', slug: 'side-dishes' },
        { name: 'Vegetarian', slug: 'vegetarian' },
        { name: 'Vegan', slug: 'vegan' },
        { name: 'Gluten-Free', slug: 'gluten-free' },
        { name: 'Quick & Easy', slug: 'quick-easy' },
    ];

    for (const category of categories) {
        const existing = await prisma.category.findUnique({
            where: { slug: category.slug },
        });

        if (!existing) {
            await prisma.category.create({
                data: category,
            });
            console.log(`✅ Created category: ${category.name}`);
        } else {
            console.log(`⏭️  Category already exists: ${category.name}`);
        }
    }

    console.log('✅ Seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding categories:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
