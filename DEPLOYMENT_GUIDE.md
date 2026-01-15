# 🚀 CaribbeanRecipe Website - Complete Deployment Guide

Welcome! This guide will walk you through setting up and deploying your recipe website from start to finish. No technical experience required - just follow each step carefully.

---

## 📋 Table of Contents

1. [What You'll Need](#what-youll-need)
2. [Step 1: Initial Setup](#step-1-initial-setup)
3. [Step 2: Get Your API Keys](#step-2-get-your-api-keys)
4. [Step 3: Set Up the Database](#step-3-set-up-the-database)
5. [Step 4: Set Up Email Service](#step-4-set-up-email-service)
6. [Step 5: Set Up Google Login](#step-5-set-up-google-login)
7. [Step 6: Set Up File Uploads](#step-6-set-up-file-uploads)
8. [Step 7: Configure Your Website](#step-7-configure-your-website)
9. [Step 8: Test Locally](#step-8-test-locally)
10. [Step 9: Purchase Domain & Hosting](#step-9-purchase-domain--hosting)
11. [Step 10: Deploy Your Website](#step-10-deploy-your-website)
12. [Step 11: Post-Deployment Setup](#step-11-post-deployment-setup)
13. [Troubleshooting](#troubleshooting)
14. [Maintenance & Updates](#maintenance--updates)

---

## 💰 What You'll Need

### Free Services (No Cost)
- ✅ Vercel Account (for hosting)
- ✅ Supabase Account (for database)
- ✅ Resend Account (for emails) - 100 emails/day free
- ✅ Google Cloud Account (for Google login)
- ✅ UploadThing Account (for file uploads) - 2GB free
- ✅ Spoonacular API (for recipes) - 150 requests/day free
- ✅ YouTube Data API (free with limits)

### Paid Services (Optional but Recommended)
- 💵 Domain name ($10-15/year) - e.g., from Namecheap or GoDaddy
- 💵 OpenAI API ($5-20/month, pay as you go) - for AI features

**Total Estimated Monthly Cost: $5-20** (plus domain)

---

## 🎯 Step 1: Initial Setup

### 1.1 Extract the Website Files

1. **Unzip the folder** you received
2. **Place it somewhere safe** on your computer (e.g., `Documents/CaribbeanRecipe`)
3. You should see folders like: `src`, `public`, `prisma`, and files like `package.json`

### 1.2 Install Required Software

#### Install Node.js
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the **LTS version** (recommended for most users)
3. Run the installer and follow the prompts
4. **Verify installation:**
   - Open Command Prompt (Windows) or Terminal (Mac)
   - Type: `node --version`
   - You should see a version number like `v20.x.x`

#### Install Git (Optional but Recommended)
1. Go to [git-scm.com](https://git-scm.com/)
2. Download and install
3. Use default settings during installation

#### Install a Code Editor (Optional)
1. Download [VS Code](https://code.visualstudio.com/)
2. Install it - this will help you edit configuration files

### 1.3 Install Website Dependencies

1. **Open Command Prompt/Terminal**
2. **Navigate to your website folder:**
   ```bash
   cd path/to/CaribbeanRecipe
   ```
   Example: `cd Documents/CaribbeanRecipe`

3. **Install dependencies:**
   ```bash
   npm install
   ```
   This will take 2-5 minutes. Wait for it to complete.

---

## 🔑 Step 2: Get Your API Keys

You'll need several API keys for different features. Let's get them one by one.

### 2.1 Spoonacular API (Recipe Data)

**Purpose:** Fetches recipe information, ingredients, nutrition data

1. Go to [spoonacular.com/food-api](https://spoonacular.com/food-api)
2. Click **"Get Access"** or **"Start Now"**
3. Create an account (use your email)
4. Choose the **Free Plan** (150 requests/day)
5. After signup, go to **"My Console"** or **"Profile"**
6. Copy your **API Key** (looks like: `a1b2c3d4e5f6g7h8...`)

📝 **Save this key** - you'll need it later!

---

### 2.2 YouTube Data API (Video Integration)

**Purpose:** Embeds cooking videos in recipes

1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. **Create a Google Cloud Project:**
   - Click **"Select a Project"** → **"New Project"**
   - Name: `CaribbeanRecipe`
   - Click **"Create"**
3. **Enable YouTube Data API:**
   - In the search bar, type **"YouTube Data API v3"**
   - Click on it → Click **"Enable"**
4. **Create API Credentials:**
   - Go to **"Credentials"** (left sidebar)
   - Click **"Create Credentials"** → **"API Key"**
   - Copy the API key that appears

📝 **Save this key**

---

### 2.3 OpenAI API (AI Features) - *Optional but Recommended*

**Purpose:** Powers the AI chat assistant and recipe generation

> **Note:** This is paid (pay-as-you-go), but very affordable. Expect $5-20/month depending on usage.

1. Go to [platform.openai.com](https://platform.openai.com/)
2. **Sign up** or **Log in**
3. Go to **"API Keys"** section
4. Click **"Create new secret key"**
5. Name it: `CaribbeanRecipe`
6. Copy the key (starts with `sk-...`)

⚠️ **Important:** Save this immediately - you can't see it again!

7. **Add billing:**
   - Go to **"Billing"** → **"Payment methods"**
   - Add a credit/debit card
   - Set a **usage limit** (e.g., $20/month) to control costs

📝 **Save this key**

---

### 2.4 ElevenLabs API (Text-to-Speech) - *Optional*

**Purpose:** Voice-guided cooking instructions

> **Note:** Free tier includes 10,000 characters/month. Paid plans start at $5/month.

1. Go to [elevenlabs.io](https://elevenlabs.io/)
2. **Sign up** for free
3. Go to **Profile Settings** → **API Key**
4. Copy your API key

📝 **Save this key**

*Alternative:* You can skip this if you don't need voice guidance features.

---

## 🗄️ Step 3: Set Up the Database

We'll use **Supabase** - a free PostgreSQL database.

### 3.1 Create Supabase Account

1. Go to [supabase.com](https://supabase.com/)
2. Click **"Start your project"**
3. Sign up with **GitHub** or **Email**

### 3.2 Create a New Project

1. Click **"New Project"**
2. Fill in:
   - **Name:** `CaribbeanRecipe`
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to your target audience
   - **Plan:** Free
3. Click **"Create new project"**
4. Wait 2-3 minutes for setup

### 3.3 Get Database Connection String

1. In your Supabase project, click **"Settings"** (gear icon)
2. Go to **"Database"**
3. Scroll to **"Connection String"**
4. Select **"URI"** tab
5. Copy the connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@...`)
6. **Replace `[YOUR-PASSWORD]`** with the database password you created

📝 **Save this connection string**

### 3.4 Enable Necessary Extensions

1. In Supabase, go to **"SQL Editor"**
2. Click **"New Query"**
3. Paste this code:
   ```sql
   -- Enable required PostgreSQL extensions
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   CREATE EXTENSION IF NOT EXISTS "pg_trgm";
   ```
4. Click **"Run"**

---

## 📧 Step 4: Set Up Email Service

We'll use **Resend** for sending emails (verification, notifications).

### 4.1 Create Resend Account

1. Go to [resend.com](https://resend.com/)
2. Click **"Sign Up"**
3. Create account with email
4. Verify your email address

### 4.2 Get API Key

1. After login, go to **"API Keys"**
2. Click **"Create API Key"**
3. Name: `CaribbeanRecipe`
4. Click **"Create"**
5. Copy the API key (starts with `re_...`)

📝 **Save this key**

### 4.3 Set Up Domain (Do this AFTER purchasing domain)

**Important:** Come back to this step after you purchase your domain in Step 9.

1. In Resend, go to **"Domains"**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `caribbeanrecipe.com`)
4. Follow DNS verification instructions
5. Add the DNS records to your domain provider

For now, you can use `onboarding@resend.dev` for testing.

---

## 🔐 Step 5: Set Up Google Login

Allow users to sign in with their Google account.

### 5.1 Create OAuth Credentials

1. Go back to [console.cloud.google.com](https://console.cloud.google.com/)
2. Select your **"CaribbeanRecipe"** project
3. Go to **"APIs & Services"** → **"Credentials"**
4. Click **"Configure Consent Screen"**
   - **User Type:** External
   - Click **"Create"**
5. Fill in OAuth consent screen:
   - **App name:** CaribbeanRecipe
   - **User support email:** Your email
   - **Developer contact:** Your email
   - Click **"Save and Continue"**
   - Skip **"Scopes"** → Click **"Save and Continue"**
   - Add your email as a test user → **"Save and Continue"**

6. Go back to **"Credentials"** → **"Create Credentials"** → **"OAuth client ID"**
   - **Application type:** Web application
   - **Name:** CaribbeanRecipe Web
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (for testing)
   - **Authorized redirect URIs:**
     - `http://localhost:3000/api/auth/callback/google` (for testing)
   - Click **"Create"**

7. **Save these credentials:**
   - **Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSPX-...`)

📝 **Save both values**

> **Note:** You'll add your live domain URLs here later in Step 11.

---

## 📤 Step 6: Set Up File Uploads

We'll use **UploadThing** for user profile pictures and recipe images.

### 6.1 Create UploadThing Account

1. Go to [uploadthing.com](https://uploadthing.com/)
2. Click **"Sign In"** → Sign in with **GitHub** or **Google**
3. Create a new app: **"CaribbeanRecipe"**

### 6.2 Get API Keys

1. In your UploadThing dashboard
2. Go to **"API Keys"**
3. Copy:
   - **App ID**
   - **Secret Key**

📝 **Save both values**

---

## ⚙️ Step 7: Configure Your Website

Now let's put all those API keys into your website!

### 7.1 Create Environment File

1. In your website folder, find the file: `.env.example`
2. **Make a copy** of this file
3. **Rename the copy** to: `.env`
4. Open `.env` in a text editor (Notepad or VS Code)

### 7.2 Fill in All Values

Replace the placeholder values with your actual API keys:

```env
# Database
DATABASE_URL="your-supabase-connection-string-here"

# NextAuth Configuration
NEXTAUTH_SECRET="generate-a-random-string-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"

# Email Service (Resend)
RESEND_API_KEY="your-resend-api-key-here"
EMAIL_FROM="onboarding@resend.dev"

# File Upload (UploadThing)
UPLOADTHING_APP_ID="your-uploadthing-app-id-here"
UPLOADTHING_SECRET="your-uploadthing-secret-here"

# API Keys
SPOONACULAR_API_KEY="your-spoonacular-api-key-here"
YOUTUBE_API_KEY="your-youtube-api-key-here"
OPENAI_API_KEY="your-openai-api-key-here"
ELEVENLABS_API_KEY="your-elevenlabs-api-key-here"
```

#### How to Generate NEXTAUTH_SECRET

**Option 1 - Online Generator:**
1. Go to [generate-secret.vercel.app](https://generate-secret.vercel.app/32)
2. Copy the generated string

**Option 2 - Command Line:**
```bash
openssl rand -base64 32
```

### 7.3 Save the File

- Save `.env` file
- **⚠️ IMPORTANT:** Never share this file with anyone - it contains sensitive information!

---

## 🧪 Step 8: Test Locally

Let's make sure everything works before deploying!

### 8.1 Set Up Database Tables

1. Open Command Prompt/Terminal in your website folder
2. Run these commands one by one:

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push
```

Wait for each command to complete (shows ✅ when done).

### 8.2 Start the Development Server

```bash
npm run dev
```

You should see:
```
✓ Ready in 3.2s
○ Local:   http://localhost:3000
```

### 8.3 Test Your Website

1. Open your browser
2. Go to: `http://localhost:3000`
3. **Test these features:**
   - ✅ Homepage loads
   - ✅ Click on a recipe
   - ✅ Try to sign up with email
   - ✅ Try Google login
   - ✅ AI chat works (if you added OpenAI key)
   - ✅ Try creating a recipe

If everything works, you're ready to deploy! 🎉

To stop the server, press `Ctrl + C` in the terminal.

---

## 🌐 Step 9: Purchase Domain & Hosting

### 9.1 Choose and Buy a Domain

**Best Domain Registrars:**
- [Namecheap](https://www.namecheap.com/) - Recommended, $8-12/year
- [GoDaddy](https://www.godaddy.com/) - Popular, $12-20/year
- [Google Domains](https://domains.google/) - Simple, $12/year
- [Porkbun](https://porkbun.com/) - Affordable, $8-15/year

**Choosing Your Domain:**
- Make it short and memorable
- Use `.com` if possible
- Examples: `caribbeanrecipe.com`, `tastycaribbeanfood.com`

**Steps:**
1. Search for your desired domain name
2. Add to cart
3. Checkout (usually $10-15/year)
4. **Save your login credentials!**

### 9.2 Hosting Solution

**We'll use Vercel** - it's free and perfect for this website!

- ✅ Free forever for personal projects
- ✅ Unlimited bandwidth
- ✅ Automatic SSL (HTTPS)
- ✅ Global CDN (fast worldwide)
- ✅ Easy deployment

No paid hosting needed! 💰

---

## 🚀 Step 10: Deploy Your Website

### 10.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com/)
2. Click **"Sign Up"**
3. **Choose "Hobby" (Free plan)**
4. Sign up with **GitHub**, **GitLab**, or **Email**

### 10.2 Prepare Your Code

**Option A - With Git (Recommended):**

1. Open Command Prompt/Terminal in your website folder
2. Run these commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Create a GitHub repository:
   - Go to [github.com](https://github.com/)
   - Click **"New"** repository
   - Name: `caribbean-recipe`
   - Make it **Private**
   - Click **"Create repository"**
4. Connect and push:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/caribbean-recipe.git
   git branch -M main
   git push -u origin main
   ```

**Option B - Without Git:**
- You'll upload files directly through Vercel CLI (we'll cover this if needed)

### 10.3 Deploy to Vercel

#### If you used GitHub:

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Select your **`caribbean-recipe`** repository
4. Click **"Import"**
5. **Configure Project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

6. **Add Environment Variables:**
   - Click **"Environment Variables"**
   - Add ALL variables from your `.env` file (except `NEXTAUTH_URL`)
   - For each variable, click **"Add"**

   Key variables to add:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `RESEND_API_KEY`
   - `EMAIL_FROM`
   - `UPLOADTHING_APP_ID`
   - `UPLOADTHING_SECRET`
   - `SPOONACULAR_API_KEY`
   - `YOUTUBE_API_KEY`
   - `OPENAI_API_KEY`
   - `ELEVENLABS_API_KEY`

7. Click **"Deploy"**

Wait 2-5 minutes for deployment. ⏱️

### 10.4 Get Your Live URL

After deployment:
- Vercel gives you a URL like: `https://caribbean-recipe.vercel.app`
- **Test this URL** - your website is now live!

---

## 🔧 Step 11: Post-Deployment Setup

### 11.1 Connect Your Custom Domain

1. In Vercel, go to your project
2. Click **"Settings"** → **"Domains"**
3. Click **"Add"**
4. Enter your domain: `caribbeanrecipe.com`
5. Vercel shows you DNS records to add

6. **Add DNS Records to Your Domain:**
   - Go to your domain registrar (Namecheap, GoDaddy, etc.)
   - Find **DNS Settings** or **DNS Management**
   - Add the records Vercel shows you:
     - Type: `A`, Name: `@`, Value: `76.76.21.21`
     - Type: `CNAME`, Name: `www`, Value: `cname.vercel-dns.com`
   - Save changes

7. Wait 10-60 minutes for DNS propagation
8. Your site will be live at `https://caribbeanrecipe.com` ✨

### 11.2 Update Google OAuth URLs

1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Select your project → **"Credentials"**
3. Click on your OAuth client ID
4. **Add your live URLs:**
   - **Authorized JavaScript origins:**
     - `https://yourdomain.com`
   - **Authorized redirect URIs:**
     - `https://yourdomain.com/api/auth/callback/google`
5. Click **"Save"**

### 11.3 Update Environment Variables in Vercel

1. In Vercel, go to **"Settings"** → **"Environment Variables"**
2. Add a new variable:
   - **Key:** `NEXTAUTH_URL`
   - **Value:** `https://yourdomain.com`
3. Click **"Save"**
4. Go to **"Deployments"**
5. Find latest deployment → Click **"..."** → **"Redeploy"**

### 11.4 Set Up Email Domain (Optional)

1. In Resend, add your custom domain
2. Add DNS records provided by Resend to your domain registrar
3. Update `EMAIL_FROM` environment variable in Vercel:
   - `noreply@yourdomain.com`
4. Redeploy

---

## 🎨 Customization Tips

### Change Website Name

1. Open `src/app/layout.tsx`
2. Change the `title` and `description`:
   ```typescript
   export const metadata = {
     title: 'Your Recipe Site Name',
     description: 'Your description here',
   }
   ```

### Update Logo Text

1. Open `src/components/layout/Navbar.tsx`
2. Find the logo text (around line 50)
3. Change `CaribbeanRecipe` to your name

### Change Color Scheme

1. Open `tailwind.config.ts`
2. Modify colors in the theme section
3. Main brand color is `orange` - you can change it to any color

---

## ❗ Troubleshooting

### Build Fails on Vercel

**Error:** TypeScript errors
- **Fix:** Run `npm run build` locally first to catch errors
- Fix any errors shown, then redeploy

**Error:** Environment variables missing
- **Fix:** Double-check all environment variables are added in Vercel

### Google Login Not Working

**Error:** "redirect_uri_mismatch"
- **Fix:** Make sure your live domain is added to Google OAuth authorized redirect URIs

### Database Connection Issues

**Error:** "Can't reach database server"
- **Fix:** Check your `DATABASE_URL` in Vercel environment variables
- Make sure it has your actual password (not `[YOUR-PASSWORD]`)

### Emails Not Sending

**Error:** 403 Forbidden
- **Fix:** Verify your email in Resend
- For production, add and verify your domain in Resend

### Images Not Uploading

**Error:** UploadThing errors
- **Fix:** Verify `UPLOADTHING_APP_ID` and `UPLOADTHING_SECRET` in Vercel
- Check UploadThing dashboard for usage limits

---

## 🔄 Maintenance & Updates

### How to Update Content

1. Make changes to your code locally
2. Test with `npm run dev`
3. Commit changes:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
4. Vercel automatically deploys updates!

### View Logs

- In Vercel, go to your project → **"Deployments"**
- Click on a deployment → **"View Function Logs"**
- See any errors or issues

### Monitor Usage

**Check API usage regularly:**
- **Spoonacular:** [spoonacular.com/food-api/console](https://spoonacular.com/food-api/console)
- **OpenAI:** [platform.openai.com/usage](https://platform.openai.com/usage)
- **Vercel:** Dashboard shows bandwidth usage
- **Supabase:** Dashboard shows database size

### Scaling Up

When you need more resources:
- **Spoonacular:** Upgrade to paid plan ($50-150/month)
- **OpenAI:** Already pay-as-you-go, just monitor costs
- **Supabase:** Upgrade to Pro ($25/month) for more storage
- **Vercel:** Stays free unless you need team features

---

## 📞 Support Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Resend Docs](https://resend.com/docs)

### Community Help
- [Next.js Discord](https://nextjs.org/discord)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)

### Video Tutorials
- Search YouTube for: "Deploy Next.js to Vercel"
- Search YouTube for: "Supabase setup tutorial"

---

## ✅ Final Checklist

Before handing off to your client, make sure:

- [ ] All API keys are obtained
- [ ] Database is set up and connected
- [ ] Local testing completed successfully
- [ ] Code is pushed to GitHub
- [ ] Deployed to Vercel successfully
- [ ] Custom domain connected (if purchased)
- [ ] Google OAuth updated with live URLs
- [ ] All environment variables set in Vercel
- [ ] Email domain verified (if using custom domain)
- [ ] Test all features on live site
- [ ] Show client how to access Vercel dashboard
- [ ] Show client how to view logs
- [ ] Provide this guide to client

---

## 🎉 Congratulations!

Your website is now live! 🌟

**What you've accomplished:**
- ✅ Full-stack recipe website with AI features
- ✅ User authentication (email + Google)
- ✅ Recipe management system
- ✅ Community features
- ✅ Live streaming capability
- ✅ AI-powered cooking assistant
- ✅ Professional hosting with custom domain
- ✅ Automated deployments

**Enjoy your new website!** 🚀

---

*Last Updated: January 2026*
*Questions? Refer to the troubleshooting section or check the documentation links above.*
