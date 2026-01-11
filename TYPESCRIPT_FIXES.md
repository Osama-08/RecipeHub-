# TypeScript Error Fixes

## Quick Fixes Needed

### Fix 1: Update RecipeDetailClient Interface

In `src/components/recipe/RecipeDetailClient.tsx`, change the ingredient interface unit type:

**Line 42 - Change from:**
```typescript
unit?: string;
```

**To:**
```typescript
unit?: string | null;
```

### Fix 2: Ensure audioData is defined in VoiceGuide

The fix has already been applied, but if you still see errors, check line 62 in `src/components/recipe/VoiceGuide.tsx`:

**Should be:**
```typescript
if (audioRef.current && audioData) {
    audioRef.current.src = audioData;
    audioRef.current.play();
    setIsPlaying(true);
}
```

### Fix 3: Update admin routes type casting

If needed, you can add type assertion when creating ingredients in`src/app/api/admin/recipes/route.ts`:

**Line 125 - Add type assertion:**
```typescript
unit: (ing.unit || null) as string | null,
```

## Alternative: Update Prisma Schema

If you want to use `undefined` instead of `null`, update your Prisma schema to make the unit field optional without default null.

## Quick Test

Run this to check for TypeScript errors:
```bash
npm run build
```

If errors persist, the types should be compatible as-is since `unit?: string | null` accepts both null and undefined.
