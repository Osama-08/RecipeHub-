# 🎯 RecipeHub AI - Category & Filter System

## ✅ **COMPLETE SOLUTION IMPLEMENTED**

### What Was Built

1. **✅ Spoonacular Integration** - Always fetches from API
2. **✅ Category Population** - Bulk import from Spoonacular
3. **✅ Dynamic Filtering** - By category, cuisine, occasion
4. **✅ Auto-Population** - One command populates all categories

---

## 🚀 Quick Start - Populate Everything

### Option 1: Populate ALL Categories at Once (RECOMMENDED)

```bash
curl -X POST http://localhost:3000/api/admin/populate-all-categories \
  -H "Content-Type: application/json" \
  -d '{"recipesPerCategory":10}'
```

**This will:**
- ✅ Add 10 dinner recipes
- ✅ Add 10 breakfast recipes
- ✅ Add 10 lunch recipes
- ✅ Add 10 dessert recipes
- ✅ Add 10 snack recipes
- **Total: 50 recipes in ~30 seconds!**

### Option 2: Populate Individual Category

```bash
# Dinner recipes
curl -X POST http://localhost:3000/api/admin/populate-categories \
  -H "Content-Type: application/json" \
  -d '{"category":"dinner","count":15}'

# Breakfast recipes
curl -X POST http://localhost:3000/api/admin/populate-categories \
  -H "Content-Type: application/json" \
  -d '{"category":"breakfast","count":15}'
```

---

## 📊 Dynamic Recipe Filtering

### New Filter Endpoint

**GET** `/api/recipes/filter`

### Query Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `category` | Filter by meal category | `dinner`, `breakfast`, `lunch` |
| `cuisine` | Filter by cuisine type | `italian`, `mexican`, `asian` |
| `occasion` | Filter by occasion | `quick`, `holiday`, `party` |
| `limit` | Results per page | `12` (default) |
| `page` | Page number | `1` (default) |

### Usage Examples

```bash
# Get dinner recipes
curl "http://localhost:3000/api/recipes/filter?category=dinner&limit=12"

# Get Italian dinner recipes
curl "http://localhost:3000/api/recipes/filter?category=dinner&cuisine=italian"

# Get quick breakfast recipes
curl "http://localhost:3000/api/recipes/filter?category=breakfast&occasion=quick"

# Get Mexican recipes
curl "http://localhost:3000/api/recipes/filter?cuisine=mexican&limit=20"
```

---

## 🎨 Frontend Integration

### Example: Fetch Recipes When User Selects Category

```typescript
// In your React component
const fetchRecipes = async (filters: {
  category?: string;
  cuisine?: string;
  occasion?: string;
}) => {
  const params = new URLSearchParams();
  
  if (filters.category) params.append('category', filters.category);
  if (filters.cuisine) params.append('cuisine', filters.cuisine);
  if (filters.occasion) params.append('occasion', filters.occasion);
  params.append('limit', '12');

  const response = await fetch(`/api/recipes/filter?${params}`);
  const data = await response.json();
  
  return data.recipes;
};

// Usage
const dinnerRecipes = await fetchRecipes({ category: 'dinner' });
const italianRecipes = await fetchRecipes({ cuisine: 'italian' });
const quickMeals = await fetchRecipes({ occasion: 'quick' });
```

### Update Your Category Pages

```typescript
// app/dinners/page.tsx
export default async function DinnersPage() {
  const res = await fetch('http://localhost:3000/api/recipes/filter?category=dinner&limit=24');
  const { recipes } = await res.json();
  
  return (
    <div>
      <h1>Dinner Recipes</h1>
      <RecipeGrid recipes={recipes} />
    </div>
  );
}
```

---

## 🔄 How the System Works

### Smart Hybrid Fetching

1. **First**: Check database for matching recipes
2. **If < 50% needed**: Fetch from Spoonacular to supplement
3. **Deduplicate**: Remove duplicates by title
4. **Return**: Combined results from both sources

### Example Flow

```
User selects: "Dinner" category
                ↓
        Filter API Called
                ↓
    ┌───────────┴───────────┐
    ↓                       ↓
Database Search      Spoonacular API
(finds 5)              (finds 10)
    ↓                       ↓
    └───────────┬───────────┘
                ↓
        Merge & Deduplicate
                ↓
        Return 15 recipes
```

---

## 📋 Available Categories

| Category | Description | Query |
|----------|-------------|-------|
| `dinner` | Evening meals | "dinner main course" |
| `breakfast` | Morning meals | "breakfast" |
| `lunch` | Midday meals | "lunch" |
| `dessert` | Sweet treats | "dessert" |
| `snack` | Light bites | "snack appetizer" |

---

## 🧪 Testing Checklist

```bash
# 1. Test Spoonacular connection
curl "http://localhost:3000/api/test/spoonacular?query=pasta"

# 2. Populate all categories
curl -X POST http://localhost:3000/api/admin/populate-all-categories \
  -H "Content-Type: application/json" \
  -d '{"recipesPerCategory":10}'

# 3. Test category filter
curl "http://localhost:3000/api/recipes/filter?category=dinner"

# 4. Test cuisine filter
curl "http://localhost:3000/api/recipes/filter?cuisine=italian"

# 5. Test combined filters
curl "http://localhost:3000/api/recipes/filter?category=dinner&cuisine=mexican&limit=20"

# 6. Check database
npx prisma studio
# Navigate to Recipe table - should see 50+ recipes
```

---

## ✨ Expected Results

### Before Population
- `/dinners` → "No dinner recipes found yet!"
- `/breakfast` → Empty
- Database → 5-10 recipes

### After Population
- `/dinners` → 10-15 dinner recipes displayed
- `/breakfast` → 10-15 breakfast recipes displayed
- Database → 50+ recipes
- All with ingredients, directions, nutrition

---

## 🎯 Next Steps

### 1. Update Your Frontend Pages

**File**: `app/dinners/page.tsx`
```typescript
// Replace the current API call
const response = await fetch('/api/recipes/filter?category=dinner&limit=24');
```

**File**: `app/meals/page.tsx`
```typescript
// Add category selection
const [category, setCategory] = useState('breakfast');
const recipes = await fetch(`/api/recipes/filter?category=${category}`);
```

### 2. Add Cuisine Filters

```typescript
const cuisines = ['Italian', 'Mexican', 'Asian', 'American'];
// When user clicks a cuisine button:
fetchRecipes({ cuisine: selectedCuisine });
```

### 3. Add Occasion Filters

```typescript
const occasions = ['Quick & Easy', 'Holiday', 'Party Food'];
// When user clicks:
fetchRecipes({ occasion: selectedOccasion });
```

---

## 🔧 Customization

### Add More Categories

Edit: `app/api/admin/populate-all-categories/route.ts`

```typescript
const categories = [
  { name: "dinner", query: "dinner main course" },
  { name: "breakfast", query: "breakfast" },
  // Add yours:
  { name: "appetizer", query: "appetizer" },
  { name: "soup", query: "soup" },
  { name: "salad", query: "salad" },
];
```

### Change Recipes Per Category

```bash
curl -X POST http://localhost:3000/api/admin/populate-all-categories \
  -H "Content-Type: application/json" \
  -d '{"recipesPerCategory":20}'  # 20 instead of 10
```

---

## 💡 Pro Tips

1. **Start Small**: Populate with 5-10 recipes per category first to test
2. **Check Spoonacular Quota**: Free tier = 150 requests/day
3. **Use Database First**: Filter endpoint checks DB before Spoonacular
4. **Dedupe Automatically**: System prevents duplicate imports

---

## 🐛 Troubleshooting

### "No recipes found"
- Run populate endpoint first
- Check Spoonacular API key in `.env`
- Verify category name matches (case-insensitive)

### "Slug conflict" errors
- Normal - recipes already imported
- Check `skipped` count in response

### Slow population
- Normal - waits 2 seconds between categories to avoid rate limiting
- 5 categories × 10 recipes = ~30 seconds total

---

## 🎉 You're All Set!

Run this ONE command to populate everything:

```bash
curl -X POST http://localhost:3000/api/admin/populate-all-categories \
  -H "Content-Type: application/json" \
  -d '{"recipesPerCategory":10}'
```

Then visit:
- `http://localhost:3000/dinners` ✅
- `http://localhost:3000/meals` ✅
- `http://localhost:3000/recipes` ✅

All pages should now show recipes! 🚀
