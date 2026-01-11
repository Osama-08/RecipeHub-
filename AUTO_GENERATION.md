# RecipeHub AI - Automatic Content Generation Guide

## 🤖 How It Works

RecipeHub AI now **automatically generates content** when you start the development server!

### What Happens Automatically

1. **On Server Start**: Checks if database has content
2. **If Empty**: Generates 3 kitchen tips, 3 cooking hacks, 3 food trends
3. **Sets Featured**: Marks one item from each category as featured
4. **Ready to Use**: Content appears immediately on your site

---

## 🚀 Quick Start

### 1. Add Your OpenRouter API Key

Edit `.env` and add:
```env
OPENROUTER_API_KEY=sk-or-v1-YOUR-KEY-HERE
```

Get your key: https://openrouter.ai/keys

### 2. Start the Server

```bash
npm run dev
```

**That's it!** Content will auto-generate within 30-60 seconds.

---

## 📊 What Gets Generated

### Initial Content (On First  Start)
- ✅ 3 Kitchen Tips (e.g., "Master the Julienne Cut in 5 Minutes")
- ✅ 3 Cooking Hacks (e.g., "Quick Garlic Peeling Trick")
- ✅ 3 Food Trends (e.g., "Air Fryer Revolution in 2026")

### Ongoing Generation (Optional)
Enable hourly auto-generation by editing `src/lib/startup.ts`:
```typescript
// Uncomment this line:
startContentScheduler(60); // Every 60 minutes
```

---

## 🔍 Check the Console

Watch your terminal for these messages:

```
🚀 RecipeHub AI - Starting initialization...
📞 Calling /api/admin/init-content...
Generating kitchen tips...
Generating cooking hacks...
Generating food trends...
✅ Auto-initialization complete
```

---

## 📍 Manual Endpoints (Still Available)

### Initialize Content Manually
```bash
curl http://localhost:3000/api/admin/init-content
```

### Generate Daily Content
```bash
curl http://localhost:3000/api/cron/daily-content
```

### Rotate Featured Content
```bash
curl http://localhost:3000/api/cron/rotate-featured
```

---

## 🧪 Testing the Generated Content

### 1. View in Database
```bash
npx prisma studio
```
Then check tables: `KitchenTip`, `CookingHack`, `TrendPost`

### 2. Query via API
```bash
# Get featured content
curl http://localhost:3000/api/admin/content/generate
```

### 3. Access in Your App
Content can be accessed at these endpoints:
- `/api/tips` (create this to list tips)
- `/api/hacks` (create this to list hacks)
- `/api/trends` (create this to list trends)

---

## ⚙️ Configuration

### Change Generation Frequency

Edit `src/lib/startup.ts`:
```typescript
startContentScheduler(120); // Every 2 hours
startContentScheduler(1440); // Every 24 hours
```

### Disable Auto-Init

Comment out in `src/lib/startup.ts`:
```typescript
// await autoInitializeContent(); // Disabled
```

### Change Initial Content Amount

Edit `src/app/api/admin/init-content/route.ts`:
```typescript
const tips = await generator.batchGenerateTips(5); // Generate 5 instead of 3
```

---

## 🎯 Production Deployment

### Using Vercel Cron Jobs

1. Create `vercel.json` in project root:
```json
{
  "crons": [
    {
      "path": "/api/cron/daily-content",
      "schedule": "0 6 * * *"
    },
    {
      "path": "/api/cron/rotate-featured",
      "schedule": "0 0 * * *"
    }
  ]
}
```

2. Add `CRON_SECRET` to Vercel environment variables

3. Deploy: `vercel --prod`

### Schedule Explanation
- `"0 6 * * *"` = Daily at 6 AM UTC
- `"0 0 * * *"` = Daily at midnight UTC
- `"0 */6 * * *"` = Every 6 hours

---

## 🐛 Troubleshooting

### No Content Generated
**Problem**: Server started but no content appears

**Solution**:
1. Check console logs for errors
2. Verify `OPENROUTER_API_KEY` in `.env`
3. Manually trigger: `curl http://localhost:3000/api/admin/init-content`

### Content Generation Slow
**Normal**: Takes 30-60 seconds to generate 9 items (to avoid API rate limits)

**Speed up**: Reduce delays in `content-generator.ts` (not recommended)

### "OpenRouter API error"
**Check**:
1. API key is correct
2. You have credits: https://openrouter.ai/credits
3. Your OpenRouter account is active

### Content Already Exists
**Expected**: Won't regenerate if database has content

**Force regenerate**:
```bash
curl -X POST http://localhost:3000/api/admin/init-content \
  -H "Content-Type: application/json" \
  -d '{"force": true}'
```

---

## 📈 Monitoring

### Check Generated Content Count
```sql
SELECT 
  (SELECT COUNT(*) FROM "KitchenTip") as tips,
  (SELECT COUNT(*) FROM "CookingHack") as hacks,
  (SELECT COUNT(*) FROM "TrendPost") as trends;
```

### View Recent Content
```sql
SELECT title, "createdAt" FROM "KitchenTip" 
ORDER BY "createdAt" DESC LIMIT 5;
```

---

## 💰 API Costs

OpenRouter pricing (approximate):
- Kitchen Tip: ~$0.001 per generation
- Cooking Hack: ~$0.001 per generation
- Food Trend: ~$0.002 per generation

**Initial 9 items**: ~$0.01
**Daily generation (3 items)**: ~$0.004/day = ~$0.12/month

Very affordable! 🎉

---

## 🎨 Customization Ideas

### 1. Custom Categories
Edit `content-generator.ts` to add your own tip categories:
```typescript
const categories = [
  "knife-skills",
  "baking-tips",
  "grilling-secrets",
  "asian-cooking"
];
```

### 2. Seasonal Content
Generate themed content:
```typescript
const seasonalPrompt = `Generate a ${season} cooking tip`;
```

### 3. Integration with Homepage
Display latest tips on your homepage automatically!

---

## ✅ Success Checklist

- [ ] Added `OPENROUTER_API_KEY` to `.env`
- [ ] Started server with `npm run dev`
- [ ] Saw initialization messages in console
- [ ] Verified content in database (Prisma Studio)
- [ ] Tested manual endpoints
- [ ] (Optional) Enabled hourly scheduler
- [ ] Content appears on your site

---

**Your RecipeHub AI is now fully autonomous! 🎊**

Content generates automatically, no manual intervention needed.
