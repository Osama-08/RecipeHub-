# RecipeHub - Complete Client Setup Guide
## Step-by-Step Instructions for Non-Technical Users

**Version:** 1.0  
**Date:** January 2025  
**Project:** RecipeHub AI-Powered Recipe Platform

---

## Table of Contents

1. [Introduction](#introduction)
2. [What You'll Need](#what-youll-need)
3. [Step 1: Install Required Software](#step-1-install-required-software)
4. [Step 2: Set Up Your Database](#step-2-set-up-your-database)
5. [Step 3: Get API Keys - Part 1 (Free Services)](#step-3-get-api-keys---part-1-free-services)
6. [Step 4: Get API Keys - Part 2 (Premium Services)](#step-4-get-api-keys---part-2-premium-services)
7. [Step 5: Configure Your Project](#step-5-configure-your-project)
8. [Step 6: Test Your Website Locally](#step-6-test-your-website-locally)
9. [Step 7: Buy a Domain Name](#step-7-buy-a-domain-name)
10. [Step 8: Deploy Your Website](#step-8-deploy-your-website)
11. [Step 9: Connect Your Domain](#step-9-connect-your-domain)
12. [Step 10: Final Configuration](#step-10-final-configuration)
13. [Troubleshooting](#troubleshooting)
14. [Support & Contact](#support--contact)

---

## Introduction

Welcome! This guide will walk you through setting up your RecipeHub website from start to finish. Even if you've never set up a website before, this guide will help you every step of the way.

**What is RecipeHub?**  
RecipeHub is a modern recipe website with AI-powered features, live streaming, community features, and much more. It's a complete platform for sharing and discovering recipes.

**How long will this take?**  
- Initial setup: 2-3 hours
- Getting all API keys: 1-2 hours
- Deployment: 30-60 minutes
- **Total: 4-6 hours** (can be done over multiple days)

**Don't worry!** You can pause at any step and come back later. Each step is clearly marked.

---

## What You'll Need

Before you start, make sure you have:

- ✅ A computer (Windows, Mac, or Linux)
- ✅ Internet connection
- ✅ A credit/debit card (for premium services and domain)
- ✅ An email address (you'll need several accounts)
- ✅ About 4-6 hours of time
- ✅ Basic computer skills (opening websites, copying/pasting text)

**Estimated Monthly Costs:**
- Database (Neon): **FREE** (or $19/month for production)
- Hosting (Vercel): **FREE** (or $20/month for team)
- Domain: **$10-15/year**
- API Services: **$20-100/month** (depending on usage)
- **Total: $30-150/month** (can start with free tier)

---

## Step 1: Install Required Software

### 1.1 Install Node.js

**What is Node.js?**  
Node.js is the software that runs your website's code. Think of it as the engine of your car.

**How to Install:**

1. **Open your web browser** and go to: https://nodejs.org/
2. **Download the LTS version** (it will say "LTS" - this means Long Term Support)
   - For Windows: Click the green "Download Node.js (LTS)" button
   - For Mac: Click the macOS installer
   - The website will automatically detect your operating system
3. **Run the installer:**
   - Windows: Double-click the downloaded `.msi` file
   - Mac: Double-click the downloaded `.pkg` file
4. **Follow the installation wizard:**
   - Click "Next" on all screens
   - Accept the license agreement
   - Click "Install"
   - Enter your computer password if asked
5. **Verify installation:**
   - Open "Command Prompt" (Windows) or "Terminal" (Mac)
   - Type: `node --version`
   - Press Enter
   - You should see a version number like `v20.11.0`
   - Type: `npm --version`
   - Press Enter
   - You should see a version number like `10.2.4`

**✅ Checkpoint:** If you see version numbers, you're done! Move to Step 1.2.

**❌ Problem?** If you see "command not found", try restarting your computer and try again.

### 1.2 Install Git (Optional but Recommended)

**What is Git?**  
Git helps manage your code. It's like a backup system for your website.

**How to Install:**

1. **Go to:** https://git-scm.com/downloads
2. **Download Git** for your operating system
3. **Run the installer** and follow the prompts
   - Use default settings for everything
   - Click "Next" on all screens
4. **Verify installation:**
   - Open Command Prompt/Terminal
   - Type: `git --version`
   - Press Enter
   - You should see a version number

**✅ Checkpoint:** Git is installed! Move to Step 1.3.

### 1.3 Install a Code Editor (Optional but Recommended)

**What is a Code Editor?**  
A code editor helps you view and edit your website files. Think of it as Microsoft Word, but for code.

**We recommend Visual Studio Code (VS Code):**

1. **Go to:** https://code.visualstudio.com/
2. **Download VS Code** for your operating system
3. **Run the installer** and follow the prompts
4. **Open VS Code** after installation

**✅ Checkpoint:** VS Code is installed! Move to Step 2.

---

## Step 2: Set Up Your Database

**What is a Database?**  
A database stores all your website's data - recipes, users, comments, etc. Think of it as a filing cabinet for your website.

**We'll use Neon (Free PostgreSQL Database):**

### 2.1 Create a Neon Account

1. **Go to:** https://neon.tech/
2. **Click "Sign Up"** (top right corner)
3. **Sign up with:**
   - Your email address, OR
   - Your GitHub account (if you have one)
4. **Verify your email** if required
5. **Log in** to your Neon account

### 2.2 Create a New Project

1. **Click "Create Project"** (or "New Project")
2. **Fill in the form:**
   - **Project Name:** `recipehub` (or any name you like)
   - **Region:** Choose the closest region to you (e.g., "US East" if you're in the US)
   - **PostgreSQL Version:** Leave as default (15)
3. **Click "Create Project"**
4. **Wait 30-60 seconds** for the database to be created

### 2.3 Get Your Database Connection String

1. **After the project is created**, you'll see a dashboard
2. **Look for "Connection String"** or "Connection Details"
3. **You'll see something like:**
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
   ```
4. **Click "Copy"** to copy this entire string
5. **Save it somewhere safe** (we'll use it later)
   - Create a text file on your computer
   - Paste the connection string
   - Save it as "database-connection.txt"

**⚠️ Important:** This connection string contains your password. Keep it secret!

**✅ Checkpoint:** You have your database connection string saved! Move to Step 3.

---

## Step 3: Get API Keys - Part 1 (Free Services)

Now we'll get the API keys you need. An API key is like a password that lets your website talk to other services.

**We'll start with the FREE services:**

### 3.1 Google OAuth (For Google Sign-In)

**What is this?**  
Allows users to sign in with their Google account.

**How to Get It:**

1. **Go to:** https://console.cloud.google.com/
2. **Sign in** with your Google account
3. **Create a new project:**
   - Click the project dropdown (top left, shows "Select a project")
   - Click "New Project"
   - **Project Name:** `RecipeHub`
   - Click "Create"
   - Wait 10-20 seconds
4. **Enable Google+ API:**
   - In the search bar at the top, type: "Google+ API"
   - Click on "Google+ API"
   - Click "Enable"
5. **Create OAuth Credentials:**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "Create Credentials" → "OAuth client ID"
   - If asked, configure the OAuth consent screen:
     - **User Type:** External
     - Click "Create"
     - **App Name:** RecipeHub
     - **User support email:** Your email
     - **Developer contact:** Your email
     - Click "Save and Continue" (3 times)
     - Click "Back to Dashboard"
   - **Application type:** Web application
   - **Name:** RecipeHub Web Client
   - **Authorized JavaScript origins:**
     - Add: `http://localhost:3000`
     - Add: `https://yourdomain.com` (we'll add your real domain later)
   - **Authorized redirect URIs:**
     - Add: `http://localhost:3000/api/auth/callback/google`
     - Add: `https://yourdomain.com/api/auth/callback/google` (we'll add your real domain later)
   - Click "Create"
6. **Copy your credentials:**
   - **Client ID:** Copy this (looks like: `123456789-abc.apps.googleusercontent.com`)
   - **Client Secret:** Click "Show" and copy this (looks like: `GOCSPX-xxxxx`)
   - **Save both** in your text file

**✅ Checkpoint:** You have Google OAuth credentials! Move to Step 3.2.

### 3.2 YouTube Data API (For Video Integration)

**What is this?**  
Allows your website to search and display YouTube cooking videos.

**How to Get It:**

1. **In the same Google Cloud Console** (from Step 3.1)
2. **Enable YouTube Data API v3:**
   - In the search bar, type: "YouTube Data API v3"
   - Click on it
   - Click "Enable"
3. **Create an API Key:**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "Create Credentials" → "API Key"
   - **Copy the API key** (looks like: `AIzaSy...`)
   - **Save it** in your text file
4. **Restrict the API Key (Optional but Recommended):**
   - Click on the API key you just created
   - Under "API restrictions", select "Restrict key"
   - Check "YouTube Data API v3"
   - Click "Save"

**✅ Checkpoint:** You have YouTube API key! Move to Step 3.3.

### 3.3 Resend (For Email Service)

**What is this?**  
Sends emails to users (verification emails, password resets, etc.).

**How to Get It:**

1. **Go to:** https://resend.com/
2. **Click "Sign Up"** (top right)
3. **Sign up** with your email
4. **Verify your email** (check your inbox)
5. **Log in** to Resend
6. **Get your API Key:**
   - Go to: https://resend.com/api-keys
   - Click "Create API Key"
   - **Name:** RecipeHub Production
   - Click "Add"
   - **Copy the API key** (starts with `re_`)
   - **⚠️ Important:** This is the only time you'll see the full key! Copy it now.
   - **Save it** in your text file
7. **Add a Domain (Optional - for production):**
   - Go to: https://resend.com/domains
   - Click "Add Domain"
   - Enter your domain (we'll do this after you buy a domain)
   - Follow DNS setup instructions

**For now, you can use the default sender:** `RecipeHub <onboarding@resend.dev>`

**✅ Checkpoint:** You have Resend API key! Move to Step 3.4.

### 3.4 Uploadthing (For Image Uploads)

**What is this?**  
Allows users to upload images (recipe photos, profile pictures, etc.).

**How to Get It:**

1. **Go to:** https://uploadthing.com/
2. **Click "Sign Up"** (top right)
3. **Sign up** with your email or GitHub
4. **Verify your email** if required
5. **Log in** to Uploadthing
6. **Create a new app:**
   - Click "Create App" or "New App"
   - **App Name:** RecipeHub
   - Click "Create"
7. **Get your keys:**
   - You'll see two keys:
     - **App ID** (looks like: `xxxxx`)
     - **Secret Key** (starts with `sk_`)
   - **Copy both** and save them in your text file

**✅ Checkpoint:** You have Uploadthing keys! Move to Step 4.

---

## Step 4: Get API Keys - Part 2 (Premium Services)

Now we'll get the PAID services. These have free tiers, but you may need to upgrade later.

### 4.1 OpenAI API (For AI Features)

**What is this?**  
Powers the AI recipe assistant, voice guide, and content generation.

**Pricing:** 
- Free tier: $5 credit (trial)
- Pay-as-you-go: ~$0.002 per 1,000 words
- Estimated: $20-50/month for moderate use

**How to Get It:**

1. **Go to:** https://platform.openai.com/
2. **Click "Sign Up"**
3. **Create an account** with your email
4. **Verify your email**
5. **Add payment method:**
   - Go to: https://platform.openai.com/account/billing
   - Click "Add payment method"
   - Enter your credit card details
   - Set a **spending limit** (recommended: $50/month to start)
6. **Get your API Key:**
   - Go to: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - **Name:** RecipeHub Production
   - Click "Create secret key"
   - **Copy the key** (starts with `sk-`)
   - **⚠️ Important:** Copy it now - you won't see it again!
   - **Save it** in your text file

**✅ Checkpoint:** You have OpenAI API key! Move to Step 4.2.

### 4.2 Spoonacular API (For Recipe Data)

**What is this?**  
Provides recipe data, ingredients, nutrition info, and cooking instructions.

**Pricing:**
- Free tier: 150 requests/day
- Basic: $9.99/month (5,000 requests/day)
- Pro: $49.99/month (unlimited requests)
- **Recommended:** Start with Basic plan

**How to Get It:**

1. **Go to:** https://spoonacular.com/food-api
2. **Click "Get Started"** or "Sign Up"
3. **Create an account**
4. **Choose a plan:**
   - Start with **Free** to test
   - Upgrade to **Basic** ($9.99/month) when ready
5. **Get your API Key:**
   - After signing up, go to your dashboard
   - Look for "API Key" or "Your API Key"
   - **Copy the key** (looks like: `abc123def456...`)
   - **Save it** in your text file

**✅ Checkpoint:** You have Spoonacular API key! Move to Step 4.3.

### 4.3 Google Gemini API (Alternative AI - Optional)

**What is this?**  
Alternative to OpenAI. You can use either OpenAI OR Gemini (not both needed).

**Pricing:**
- Free tier: 60 requests/minute
- Pay-as-you-go after free tier

**How to Get It:**

1. **Go to:** https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click "Create API Key"**
4. **Copy the API key** and save it

**Note:** You only need ONE AI provider (OpenAI OR Gemini). OpenAI is recommended.

**✅ Checkpoint:** Optional - Gemini API key obtained! Move to Step 4.4.

### 4.4 100ms (For Live Streaming - Optional)

**What is this?**  
Powers the live cooking sessions feature.

**Pricing:**
- Free tier: 10,000 minutes/month
- Paid: $0.0025 per participant-minute after free tier

**How to Get It:**

1. **Go to:** https://www.100ms.live/
2. **Click "Sign Up"**
3. **Create an account**
4. **Create a new app:**
   - Go to: https://dashboard.100ms.live/
   - Click "Create App"
   - **App Name:** RecipeHub
   - Click "Create"
5. **Get your keys:**
   - Go to "Developer" or "API Keys" section
   - **Copy:**
     - **App Access Key** (starts with `xxxxx`)
     - **App Secret** (starts with `xxxxx`)
   - **Save both** in your text file
6. **Create a Template:**
   - Go to "Templates" section
   - Click "Create Template"
   - Use default settings
   - **Copy the Template ID** and save it

**✅ Checkpoint:** Optional - 100ms keys obtained! Move to Step 5.

---

## Step 5: Configure Your Project

Now we'll set up your project files with all the API keys.

### 5.1 Get Your Project Files

**Option A: If you received the project as a ZIP file:**

1. **Extract the ZIP file** to a folder on your computer
   - Example: `C:\Users\YourName\RecipeWebsite` (Windows)
   - Example: `/Users/YourName/RecipeWebsite` (Mac)
2. **Remember this location** - you'll need it!

**Option B: If you received a GitHub link:**

1. **Open Command Prompt/Terminal**
2. **Navigate to where you want the project:**
   ```bash
   cd C:\Users\YourName\Documents
   ```
3. **Clone the repository:**
   ```bash
   git clone <your-github-repo-url>
   ```
4. **Navigate into the project:**
   ```bash
   cd RecipeWebsite
   ```

### 5.2 Install Dependencies

1. **Open Command Prompt/Terminal**
2. **Navigate to your project folder:**
   ```bash
   cd C:\Users\YourName\RecipeWebsite
   ```
   (Replace with your actual path)
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Wait 2-5 minutes** for installation to complete
5. **You should see:** "added X packages" when done

**✅ Checkpoint:** Dependencies installed! Move to Step 5.3.

### 5.3 Create Environment File

1. **In your project folder**, look for a file named `.env.example`
2. **Copy this file** and rename it to `.env.local`
   - Windows: Right-click → Copy, then Paste, rename to `.env.local`
   - Mac: Copy the file, rename to `.env.local`
3. **Open `.env.local`** in a text editor (Notepad, VS Code, etc.)

### 5.4 Fill in Your Environment Variables

**Open your text file** where you saved all your API keys, and fill in `.env.local`:

```env
# Database
DATABASE_URL="paste-your-neon-database-connection-string-here"

# NextAuth
NEXTAUTH_SECRET="generate-this-below"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="paste-your-google-client-id-here"
GOOGLE_CLIENT_SECRET="paste-your-google-client-secret-here"

# AI Provider (choose one: "openai", "gemini", or "openrouter")
AI_PROVIDER="openai"

# OpenAI
OPENAI_API_KEY="paste-your-openai-api-key-here"

# Google Gemini (Optional - only if using Gemini instead of OpenAI)
GEMINI_API_KEY="paste-your-gemini-key-here-if-using"

# OpenRouter (Optional - alternative AI provider)
OPENROUTER_API_KEY=""

# Uploadthing
UPLOADTHING_SECRET="paste-your-uploadthing-secret-key-here"
UPLOADTHING_APP_ID="paste-your-uploadthing-app-id-here"

# Email Service (Resend)
RESEND_API_KEY="paste-your-resend-api-key-here"
EMAIL_FROM="RecipeHub <onboarding@resend.dev>"

# YouTube API
YOUTUBE_API_KEY="paste-your-youtube-api-key-here"

# Spoonacular API
SPOONACULAR_API_KEY="paste-your-spoonacular-api-key-here"

# Live Streaming (100ms - Optional)
NEXT_PUBLIC_100MS_APP_ACCESS_KEY="paste-your-100ms-access-key-here"
HMS_TEMPLATE_ID="paste-your-100ms-template-id-here"

# Admin
ADMIN_EMAILS="your-email@example.com"

# Google AdSense (Optional - leave empty for now)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=""
NEXT_PUBLIC_ADSENSE_HOME_HERO_SLOT=""
NEXT_PUBLIC_ADSENSE_HOME_MID_SLOT=""
```

### 5.5 Generate NEXTAUTH_SECRET

**You need to generate a secret key for authentication:**

1. **Open Command Prompt/Terminal**
2. **Run this command:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
3. **Copy the output** (a long string of random characters)
4. **Paste it** into `.env.local` as the value for `NEXTAUTH_SECRET`

**✅ Checkpoint:** All environment variables filled in! Move to Step 5.6.

### 5.6 Set Up Database

1. **Open Command Prompt/Terminal** in your project folder
2. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```
3. **Push database schema:**
   ```bash
   npx prisma db push
   ```
4. **Wait for completion** - you should see "Database synchronized"

**✅ Checkpoint:** Database is set up! Move to Step 6.

---

## Step 6: Test Your Website Locally

Before deploying, let's make sure everything works on your computer.

### 6.1 Start the Development Server

1. **Open Command Prompt/Terminal** in your project folder
2. **Run:**
   ```bash
   npm run dev
   ```
3. **Wait 30-60 seconds** - you'll see:
   ```
   ▲ Next.js 15.5.9
   - Local:        http://localhost:3000
   ```
4. **Open your browser** and go to: http://localhost:3000

### 6.2 Test Your Website

**Check these things:**

1. ✅ **Homepage loads** - You should see the RecipeHub homepage
2. ✅ **No error messages** in the browser console (press F12 to open)
3. ✅ **Try signing up:**
   - Click "Sign Up"
   - Create a test account
   - Check your email for verification (if Resend is working)
4. ✅ **Try browsing recipes:**
   - Click "Recipes" in the menu
   - Recipes should load (if Spoonacular API is working)

### 6.3 Common Issues

**Problem: "Database connection error"**
- **Solution:** Check your `DATABASE_URL` in `.env.local`
- Make sure it's the full connection string from Neon

**Problem: "API key invalid"**
- **Solution:** Double-check all API keys in `.env.local`
- Make sure there are no extra spaces or quotes

**Problem: "Port 3000 already in use"**
- **Solution:** Close other applications using port 3000
- Or change the port: `npm run dev -- -p 3001`

**✅ Checkpoint:** Website works locally! Move to Step 7.

---

## Step 7: Buy a Domain Name

**What is a Domain?**  
A domain is your website's address (like `recipehub.com`). Instead of `http://localhost:3000`, users will visit `https://yourdomain.com`.

### 7.1 Choose a Domain Registrar

**Recommended registrars:**
- **Namecheap** (https://www.namecheap.com/) - Easy to use, good prices
- **Google Domains** (https://domains.google/) - Simple interface
- **GoDaddy** (https://www.godaddy.com/) - Popular, good support

**We'll use Namecheap as an example:**

### 7.2 Search for a Domain

1. **Go to:** https://www.namecheap.com/
2. **Click "Sign Up"** and create an account
3. **Search for your domain:**
   - Type your desired name (e.g., "recipehub")
   - Click "Search"
   - See available options (`.com`, `.net`, `.org`, etc.)
4. **Choose a domain:**
   - `.com` is most popular ($10-15/year)
   - Other extensions are cheaper ($5-10/year)
5. **Add to cart** and proceed to checkout

### 7.3 Purchase the Domain

1. **Review your order**
2. **Enter payment information**
3. **Complete purchase**
4. **Wait for confirmation email** (usually instant)

### 7.4 Configure Domain Settings

1. **Log in** to your domain registrar account
2. **Go to "Domain List"** or "My Domains"
3. **Click on your domain**
4. **Note your nameservers** (we'll need these later)
   - Usually something like:
     - `dns1.registrar.com`
     - `dns2.registrar.com`

**✅ Checkpoint:** Domain purchased! Move to Step 8.

---

## Step 8: Deploy Your Website

**What is Deployment?**  
Deployment means putting your website on the internet so everyone can access it.

**We'll use Vercel (Free hosting for Next.js):**

### 8.1 Create a Vercel Account

1. **Go to:** https://vercel.com/
2. **Click "Sign Up"**
3. **Sign up with GitHub** (recommended) or email
4. **Verify your email** if required

### 8.2 Prepare Your Code

**Option A: Using GitHub (Recommended):**

1. **Create a GitHub account** (if you don't have one): https://github.com/
2. **Create a new repository:**
   - Click "New Repository"
   - **Name:** `recipehub` (or any name)
   - Make it **Private** (recommended)
   - Click "Create repository"
3. **Upload your code:**
   - **If you have Git installed:**
     ```bash
     cd C:\Users\YourName\RecipeWebsite
     git init
     git add .
     git commit -m "Initial commit"
     git remote add origin https://github.com/yourusername/recipehub.git
     git push -u origin main
     ```
   - **If you don't have Git:**
     - Use GitHub Desktop (https://desktop.github.com/)
     - Or upload files through GitHub web interface

**Option B: Deploy directly from your computer:**

- We'll use Vercel CLI (see Step 8.3)

### 8.3 Deploy to Vercel

**Method 1: Deploy from GitHub (Easiest):**

1. **Log in to Vercel**
2. **Click "Add New Project"**
3. **Import your GitHub repository:**
   - Select your repository
   - Click "Import"
4. **Configure project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
5. **Add Environment Variables:**
   - Click "Environment Variables"
   - **Add each variable** from your `.env.local` file:
     - Click "Add"
     - **Name:** `DATABASE_URL`
     - **Value:** (paste from your `.env.local`)
     - Click "Add"
   - **Repeat for ALL variables:**
     - `NEXTAUTH_SECRET`
     - `NEXTAUTH_URL` (set to `https://yourdomain.com` - we'll update this)
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `OPENAI_API_KEY`
     - `UPLOADTHING_SECRET`
     - `UPLOADTHING_APP_ID`
     - `RESEND_API_KEY`
     - `YOUTUBE_API_KEY`
     - `SPOONACULAR_API_KEY`
     - `EMAIL_FROM`
     - `ADMIN_EMAILS`
     - And any others you configured
6. **Click "Deploy"**
7. **Wait 2-5 minutes** for deployment
8. **You'll get a URL** like: `https://recipehub.vercel.app`

**Method 2: Deploy using Vercel CLI:**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```
2. **Login to Vercel:**
   ```bash
   vercel login
   ```
3. **Deploy:**
   ```bash
   cd C:\Users\YourName\RecipeWebsite
   vercel
   ```
4. **Follow the prompts:**
   - Link to existing project? No
   - Project name? recipehub
   - Directory? ./
   - Override settings? No
5. **Add environment variables:**
   ```bash
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_SECRET
   # ... repeat for all variables
   ```
6. **Redeploy:**
   ```bash
   vercel --prod
   ```

**✅ Checkpoint:** Website is deployed! You have a URL like `https://recipehub.vercel.app`. Move to Step 9.

---

## Step 9: Connect Your Domain

Now we'll connect your custom domain to your Vercel deployment.

### 9.1 Add Domain to Vercel

1. **Go to your Vercel project dashboard**
2. **Click "Settings"** → **"Domains"**
3. **Enter your domain** (e.g., `yourdomain.com`)
4. **Click "Add"**
5. **Vercel will show you DNS records** to add

### 9.2 Configure DNS

**You need to add DNS records at your domain registrar:**

1. **Log in** to your domain registrar (Namecheap, GoDaddy, etc.)
2. **Go to "DNS Management"** or "Advanced DNS"
3. **Add these records** (Vercel will show you the exact values):

   **Record 1:**
   - **Type:** A
   - **Host:** @
   - **Value:** `76.76.21.21` (Vercel's IP - check Vercel dashboard for current IP)
   - **TTL:** Automatic

   **Record 2:**
   - **Type:** CNAME
   - **Host:** www
   - **Value:** `cname.vercel-dns.com.` (or what Vercel shows)
   - **TTL:** Automatic

4. **Save the DNS records**
5. **Wait 5-60 minutes** for DNS to propagate

### 9.3 Verify Domain

1. **In Vercel**, wait for the domain to show as "Valid"
2. **Vercel will automatically issue an SSL certificate** (free HTTPS)
3. **Test your domain:**
   - Go to `https://yourdomain.com`
   - Your website should load!

**✅ Checkpoint:** Domain is connected! Move to Step 10.

---

## Step 10: Final Configuration

### 10.1 Update Environment Variables

**Update these in Vercel:**

1. **Go to Vercel** → Your Project → Settings → Environment Variables
2. **Update `NEXTAUTH_URL`:**
   - Change from `http://localhost:3000`
   - To: `https://yourdomain.com`
3. **Update Google OAuth redirect URIs:**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Edit your OAuth client
   - **Add authorized redirect URI:**
     - `https://yourdomain.com/api/auth/callback/google`
   - **Add authorized JavaScript origin:**
     - `https://yourdomain.com`
   - Click "Save"

### 10.2 Update Resend Domain (Optional)

**To send emails from your domain:**

1. **Go to:** https://resend.com/domains
2. **Add your domain**
3. **Add DNS records** (Resend will show you which ones)
4. **Verify domain** (can take 24-48 hours)

### 10.3 Redeploy

1. **In Vercel**, go to "Deployments"
2. **Click the three dots** on the latest deployment
3. **Click "Redeploy"**
4. **Wait for deployment** to complete

### 10.4 Test Everything

**Test these features:**

1. ✅ **Homepage loads** at `https://yourdomain.com`
2. ✅ **Sign up** - Create a new account
3. ✅ **Email verification** - Check if emails are sent
4. ✅ **Google Sign-In** - Test OAuth login
5. ✅ **Browse recipes** - Check if recipes load
6. ✅ **Upload images** - Test image uploads
7. ✅ **AI features** - Test AI assistant (if configured)

**✅ Checkpoint:** Everything is working! Your website is live!

---

## Troubleshooting

### Common Problems and Solutions

#### Problem: "Database connection failed"

**Solutions:**
1. Check your `DATABASE_URL` in Vercel environment variables
2. Make sure your Neon database is active (not paused)
3. Verify the connection string format is correct
4. Check if your database allows connections from Vercel's IPs

#### Problem: "API key invalid"

**Solutions:**
1. Double-check all API keys are copied correctly (no extra spaces)
2. Verify API keys are active in their respective dashboards
3. Check if you've exceeded rate limits
4. Ensure billing is set up for paid APIs

#### Problem: "Email not sending"

**Solutions:**
1. Check Resend API key is correct
2. Verify `EMAIL_FROM` format: `"Name <email@domain.com>"`
3. For production, set up a custom domain in Resend
4. Check Resend dashboard for error logs

#### Problem: "Google Sign-In not working"

**Solutions:**
1. Verify redirect URI matches exactly: `https://yourdomain.com/api/auth/callback/google`
2. Check Google OAuth credentials are correct
3. Ensure Google+ API is enabled
4. Check authorized JavaScript origins include your domain

#### Problem: "Recipes not loading"

**Solutions:**
1. Check Spoonacular API key is valid
2. Verify you haven't exceeded free tier limits (150/day)
3. Consider upgrading to Basic plan ($9.99/month)
4. Check browser console for errors (F12)

#### Problem: "Build failed on Vercel"

**Solutions:**
1. Check build logs in Vercel dashboard
2. Ensure all environment variables are set
3. Verify `DATABASE_URL` is correct
4. Check if `NEXTAUTH_SECRET` is set
5. Review error messages in build logs

#### Problem: "Domain not connecting"

**Solutions:**
1. Wait 24-48 hours for DNS propagation
2. Verify DNS records are correct
3. Use a DNS checker tool: https://dnschecker.org/
4. Contact your domain registrar support

### Getting Help

**If you're stuck:**

1. **Check the error message** carefully
2. **Search for the error** on Google
3. **Check service dashboards** (Vercel, Neon, etc.) for status
4. **Review this guide** - you might have missed a step
5. **Contact support** - Most services have live chat or email support

---

## Support & Contact

### Service Support Links

- **Vercel Support:** https://vercel.com/support
- **Neon Support:** https://neon.tech/docs/introduction/support
- **OpenAI Support:** https://help.openai.com/
- **Spoonacular Support:** https://spoonacular.com/food-api/docs
- **Resend Support:** https://resend.com/support

### Project Support

**If you need help with the RecipeHub project itself:**

- Review the README.md file
- Check the troubleshooting section above
- Contact your developer/freelancer

---

## Quick Reference Checklist

Use this checklist to track your progress:

### Setup Phase
- [ ] Node.js installed
- [ ] Git installed (optional)
- [ ] VS Code installed (optional)
- [ ] Database (Neon) created
- [ ] Database connection string saved

### API Keys - Free Services
- [ ] Google OAuth credentials
- [ ] YouTube API key
- [ ] Resend API key
- [ ] Uploadthing keys

### API Keys - Premium Services
- [ ] OpenAI API key (with billing set up)
- [ ] Spoonacular API key
- [ ] Gemini API key (optional)
- [ ] 100ms keys (optional)

### Configuration
- [ ] Project files downloaded/extracted
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` file created and filled
- [ ] `NEXTAUTH_SECRET` generated
- [ ] Database schema pushed (`npx prisma db push`)

### Testing
- [ ] Website runs locally (`npm run dev`)
- [ ] Homepage loads
- [ ] Sign up works
- [ ] Recipes load
- [ ] No major errors

### Deployment
- [ ] Domain purchased
- [ ] Vercel account created
- [ ] Code uploaded to GitHub (or Vercel)
- [ ] Environment variables added to Vercel
- [ ] Website deployed
- [ ] Domain connected to Vercel
- [ ] DNS configured
- [ ] Website accessible at custom domain

### Final Steps
- [ ] `NEXTAUTH_URL` updated in Vercel
- [ ] Google OAuth redirect URIs updated
- [ ] Resend domain configured (optional)
- [ ] All features tested on live site
- [ ] Website is fully functional!

---

## Cost Summary

### One-Time Costs
- **Domain:** $10-15/year

### Monthly Costs (Starting)
- **Database (Neon):** FREE (or $19/month for production)
- **Hosting (Vercel):** FREE (or $20/month for team)
- **OpenAI API:** $20-50/month (pay-as-you-go)
- **Spoonacular API:** $9.99/month (Basic plan)
- **Resend:** FREE (up to 3,000 emails/month)
- **Uploadthing:** FREE (up to 2GB storage)
- **100ms:** FREE (up to 10,000 minutes/month)

### Total Monthly Cost
- **Minimum (Free tier):** $0-20/month
- **Recommended (Production):** $50-100/month
- **With all premium features:** $100-200/month

**Note:** Costs scale with usage. Start with free tiers and upgrade as needed.

---

## Congratulations! 🎉

You've successfully set up your RecipeHub website! Your website is now live and accessible to the world.

### Next Steps

1. **Customize your website:**
   - Update branding and colors
   - Add your logo
   - Customize content

2. **Add recipes:**
   - Use the admin panel to import recipes
   - Or let the system auto-populate from Spoonacular

3. **Invite users:**
   - Share your website URL
   - Encourage sign-ups
   - Build your community

4. **Monitor usage:**
   - Check API usage in dashboards
   - Monitor costs
   - Upgrade plans as needed

5. **Maintain your website:**
   - Regular backups
   - Update dependencies
   - Monitor for errors

---

**Good luck with your RecipeHub website!** 🍳

If you have any questions or run into issues, refer back to this guide or contact support.

---

*Document Version: 1.0*  
*Last Updated: January 2025*

