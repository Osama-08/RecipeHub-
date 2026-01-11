# Quick Fix Guide - Populate Recipes

## ✅ Step 1: Fixed Category API  
The recipes API now properly handles category filtering!

## 🚀 Step 2: Populate Database

### Using Browser (Easiest!)

1. Open your browser
2. Open DevTools (F12)
3. Go to Console tab
4. Paste this:

```javascript
fetch('http://localhost:3000/api/admin/populate-all-categories', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({recipesPerCategory: 8})
}).then(r => r.json()).then(console.log)
```

5. Press Enter
6. Wait ~30 seconds
7. Refresh your pages!

### Using PowerShell

```powershell
$body = @{recipesPerCategory=8} | ConvertTo-Json
Invoke-WebRequest -Uri 'http://localhost:3000/api/admin/populate-all-categories' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing
```

## ✅ What This Does

- Adds 8 dinner recipes
- Adds 8 breakfast recipes
- Adds 8 lunch recipes
- Adds 8 dessert recipes
- Adds 8 snack recipes
- **Total: 40 recipes!**

## 🎯 After Population

Your pages will show recipes:
- `/` - Homepage with recipes
- `/meals` - All meal categories
- `/dinners` - Dinner recipes
- `/occasions` - Occasion-based recipes
- `/cuisines` - Cuisine-based recipes

**All working automatically!** 🎉
