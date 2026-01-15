# ⚡ Quick Start Guide - CaribbeanRecipe

**Want to get your site live in 30 minutes? Follow this abbreviated guide!**

For detailed instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 📦 What You Need (5 minutes)

### Free Accounts - Sign up for these:
1. [Vercel](https://vercel.com) - Hosting
2. [Supabase](https://supabase.com) - Database  
3. [Resend](https://resend.com) - Email
4. [Google Cloud](https://console.cloud.google.com) - OAuth & YouTube API
5. [UploadThing](https://uploadthing.com) - File uploads
6. [Spoonacular](https://spoonacular.com/food-api) - Recipe data
7. [OpenAI](https://platform.openai.com) - AI features ($5-20/month)

---

## 🚀 Installation (10 minutes)

### 1. Install Node.js
Download from [nodejs.org](https://nodejs.org/) (LTS version)

### 2. Setup Project
```bash
# Navigate to project folder
cd path/to/RecipeWebsite

# Install dependencies
npm install

# Copy environment file
# Windows:
copy .env.example .env

# Mac/Linux:
cp .env.example .env
```

---

## 🔑 Get API Keys (10 minutes)

Fill in your `.env` file with these keys:

### Database (Supabase)
1. Create project → Get connection string from Settings → Database
2. Add to `.env` as `DATABASE_URL`

### NextAuth
```bash
# Generate secret:
openssl rand -base64 32
# Or use: https://generate-secret.vercel.app/32
```
Add as `NEXTAUTH_SECRET`

### Google (OAuth + YouTube)
1. Google Cloud Console → Create project
2. Enable YouTube Data API v3
3. Create OAuth credentials + API key
4. Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `YOUTUBE_API_KEY`

### Email (Resend)
1. Get API key from dashboard
2. Add as `RESEND_API_KEY`
3. Use `onboarding@resend.dev` for `EMAIL_FROM`

### File Uploads (UploadThing)
1. Create app → Get credentials
2. Add `UPLOADTHING_APP_ID` and `UPLOADTHING_SECRET`

### APIs
- **Spoonacular:** Get free API key → `SPOONACULAR_API_KEY`
- **OpenAI:** Get API key + add billing → `OPENAI_API_KEY`
- **ElevenLabs (Optional):** Get API key → `ELEVENLABS_API_KEY`

---

## 🧪 Test Locally (3 minutes)

```bash
# Setup database
npx prisma generate
npx prisma db push

# Start dev server
npm run dev
```

Open `http://localhost:3000` - Test all features!

---

## 🌐 Deploy to Vercel (5 minutes)

### Option 1: With GitHub
```bash
# Create git repository
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/YOUR-USERNAME/your-repo.git
git push -u origin main
```

Then in Vercel:
1. Import GitHub repository
2. Add all environment variables from `.env`
3. Deploy!

### Option 2: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```
Follow prompts and add environment variables.

---

## 🔧 Post-Deployment (5 minutes)

1. **Add live domain to Google OAuth:**
   - Google Console → Credentials → Add:
   - `https://your-site.vercel.app/api/auth/callback/google`

2. **Update Vercel env:**
   - Add `NEXTAUTH_URL=https://your-site.vercel.app`
   - Redeploy

3. **Custom Domain (Optional):**
   - Buy domain from Namecheap/GoDaddy
   - Add in Vercel → Settings → Domains
   - Update DNS records

---

## ✅ You're Done!

Your site is live! 🎉

**Next steps:**
- Share the URL with users
- Monitor API usage
- Customize branding
- Add content

---

## 🆘 Common Issues

**Build fails?** 
→ Check environment variables in Vercel

**Google login not working?**
→ Add your deployed URL to Google OAuth redirect URIs

**Database errors?**
→ Verify `DATABASE_URL` is correct

**Need help?**
→ See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed troubleshooting

---

**Total Time: ~30-40 minutes** ⏱️

*For step-by-step details, see the full [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)*
