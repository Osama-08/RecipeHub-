# Quick Fix: Category Foreign Key Error

## Problem
You're getting this error when creating recipes:
```
Foreign key constraint violated: Recipe_categoryId_fkey
```

**Cause:** The database has no categories yet! Recipes need to reference an existing category.

---

## ✅ Solution - Option 1: Run Seed Script (RECOMMENDED)

I've created a seed script that will populate 15 common categories.

### Run this command:
```bash
npx tsx prisma/seed.ts
```

This will create categories like:
- Breakfast, Lunch, Dinner
- Desserts, Appetizers, Snacks
- Vegetarian, Vegan, Gluten-Free
- And more...

---

## ✅ Solution - Option 2: Manual in Prisma Studio

If the seed script fails:

1. Keep Prisma Studio open (already running at http://localhost:5555)
2. Click on **Category** table
3. Click **Add record**
4. Fill in:
   - `name`: "Breakfast" (or any category name)
   - `slug`: "breakfast" (lowercase, no spaces)
5. Click **Save 1 change**
6. Repeat for other categories you need

### Categories to create:
- Breakfast (slug: breakfast)
- Lunch (slug: lunch)
- Dinner (slug: dinner)
- Desserts (slug: desserts)
- Appetizers (slug: appetizers)

---

## 📝 Using Categories in Recipe Form

After creating categories:

1. Get the **category ID** from Prisma Studio
2. When creating a recipe, paste that ID in the "Category ID" field

**Example:**
- In Prisma Studio, copy the ID of "Breakfast" category (looks like: `cm4xabc123xyz`)
- Paste it in the recipe form's "Category ID" field

---

## 🎯 Better Solution (Coming Soon)

In the future, I can update the recipe form to show a dropdown of categories instead of requiring you to paste IDs manually!

---

## Verify It Worked

After running the seed script or creating categories manually:

1. Refresh Prisma Studio
2. Check the **Category** table - you should see your categories
3. Try creating a recipe again - it should work now!
