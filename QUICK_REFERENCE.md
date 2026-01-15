# ⚡ Quick Reference Guide - RecipeHub Setup

**For when you need a quick reminder!**

---

## 🔑 API Keys Checklist

Use this checklist to track which API keys you've obtained:

- [ ] **Neon Database** - Connection string
- [ ] **Google OAuth** - Client ID & Secret
- [ ] **YouTube API** - API Key
- [ ] **Resend** - API Key
- [ ] **Uploadthing** - App ID & Secret
- [ ] **OpenAI** - API Key (with billing)
- [ ] **Spoonacular** - API Key
- [ ] **100ms** - Access Key & Template ID (Optional)

---

## 📝 Environment Variables Quick Copy

Copy this template and fill in your values:

```env
DATABASE_URL="your-neon-connection-string"
NEXTAUTH_SECRET="generate-with-node-command"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
AI_PROVIDER="openai"
OPENAI_API_KEY="sk-your-openai-key"
UPLOADTHING_SECRET="sk_live_your-secret"
UPLOADTHING_APP_ID="your-app-id"
RESEND_API_KEY="re_your-resend-key"
EMAIL_FROM="RecipeHub <onboarding@resend.dev>"
YOUTUBE_API_KEY="your-youtube-key"
SPOONACULAR_API_KEY="your-spoonacular-key"
ADMIN_EMAILS="your-email@example.com"
```

---

## 🛠️ Common Commands

```bash
# Navigate to project folder
cd C:\Users\YourName\RecipeWebsite

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push

# Start development server
npm run dev

# Build for production
npm run build

# Generate NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🌐 Important URLs

| Service | URL |
|---------|-----|
| Neon Database | https://neon.tech/ |
| Vercel Hosting | https://vercel.com/ |
| Google Cloud Console | https://console.cloud.google.com/ |
| OpenAI | https://platform.openai.com/ |
| Spoonacular | https://spoonacular.com/food-api |
| Resend | https://resend.com/ |
| Uploadthing | https://uploadthing.com/ |
| 100ms | https://www.100ms.live/ |

---

## 🚨 Quick Troubleshooting

### Website won't start locally
- Check Node.js is installed: `node --version`
- Check you're in the project folder
- Try: `npm install` again

### Database connection error
- Check `DATABASE_URL` in `.env.local`
- Make sure Neon database is active
- Verify connection string format

### API key errors
- Double-check keys are copied correctly
- No extra spaces or quotes
- Verify keys are active in dashboards

### Build fails on Vercel
- Check all environment variables are set
- Review build logs in Vercel dashboard
- Ensure `DATABASE_URL` is correct

### Domain not working
- Wait 24-48 hours for DNS propagation
- Verify DNS records are correct
- Check Vercel domain settings

---

## 📞 Support Links

- **Vercel Support:** https://vercel.com/support
- **Neon Support:** https://neon.tech/docs/introduction/support
- **OpenAI Support:** https://help.openai.com/
- **Spoonacular Docs:** https://spoonacular.com/food-api/docs
- **Resend Support:** https://resend.com/support

---

## 💰 Cost Summary

**One-Time:**
- Domain: $10-15/year

**Monthly (Starting):**
- Database: FREE
- Hosting: FREE
- Email: FREE (3,000/month)
- Image uploads: FREE (2GB)
- OpenAI: $5-50/month
- Spoonacular: FREE or $9.99/month

**Total: ~$15-25/month** (mostly free tier)

---

## ✅ Deployment Checklist

- [ ] Node.js installed
- [ ] Project extracted
- [ ] Dependencies installed (`npm install`)
- [ ] Database created (Neon)
- [ ] All API keys obtained
- [ ] `.env.local` file created and filled
- [ ] Database schema pushed (`npx prisma db push`)
- [ ] Website runs locally (`npm run dev`)
- [ ] Domain purchased
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project deployed to Vercel
- [ ] Environment variables added to Vercel
- [ ] Domain connected to Vercel
- [ ] DNS configured
- [ ] Google OAuth updated with production URL
- [ ] Website tested on live domain

---

**Need more help?** See `COMPLETE_SETUP_GUIDE.md` for detailed instructions!
