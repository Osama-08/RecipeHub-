# 🚀 Complete Setup Guide - RecipeHub Website
## From Zero to Live Website - Step by Step

**Version:** 2.0  
**Date:** January 2025  
**For:** Non-Technical Users  
**Estimated Time:** 4-6 hours (can be done over multiple days)

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Part 1: Unzip and Prepare](#part-1-unzip-and-prepare)
3. [Part 2: Install Required Software](#part-2-install-required-software)
4. [Part 3: Set Up Database](#part-3-set-up-database)
5. [Part 4: Get API Keys](#part-4-get-api-keys)
6. [Part 5: Configure Your Website](#part-5-configure-your-website)
7. [Part 6: Test Locally](#part-6-test-locally)
8. [Part 7: Buy Domain & Hosting](#part-7-buy-domain--hosting)
9. [Part 8: Deploy to Production](#part-8-deploy-to-production)
10. [Part 9: Connect Domain](#part-9-connect-domain)
11. [Part 10: Final Steps](#part-10-final-steps)
12. [Troubleshooting](#troubleshooting)
13. [Quick Reference](#quick-reference)

---

## 🎯 Getting Started

### What You're Building

You're setting up a **RecipeHub** website - a modern recipe platform with:
- 🍳 Recipe browsing and search
- 🤖 AI-powered cooking assistant
- 👥 User accounts and profiles
- 💬 Community features
- 📧 Email notifications
- 🎥 YouTube video integration
- And much more!

### What You'll Need

- ✅ **Computer** (Windows, Mac, or Linux)
- ✅ **Internet connection**
- ✅ **Email address** (you'll create several accounts)
- ✅ **Credit/debit card** (for domain and some services)
- ✅ **4-6 hours** of time (can be split across days)
- ✅ **Basic computer skills** (opening websites, copying/pasting)

### Estimated Costs

**One-Time:**
- Domain name: **$10-15/year**

**Monthly (Starting):**
- Database (Neon): **FREE** (upgrade to $19/month later)
- Hosting (Vercel): **FREE** (upgrade to $20/month later)
- Email (Resend): **FREE** (up to 3,000 emails/month)
- Image uploads (Uploadthing): **FREE** (up to 2GB)
- YouTube API: **FREE**
- Google OAuth: **FREE**

**Monthly (Required):**
- OpenAI API: **$5-50/month** (pay-as-you-go, start with $5)
- Spoonacular API: **FREE** (150/day) or **$9.99/month** (5,000/day)

**Total Starting Cost: ~$15-25/month** (mostly free tier)

---

## 📦 Part 1: Unzip and Prepare

### Step 1.1: Extract the ZIP File

1. **Locate the ZIP file** you received (e.g., `RecipeWebsite.zip`)
2. **Right-click** on the ZIP file
3. **Select "Extract All"** (Windows) or **"Extract"** (Mac)
4. **Choose a location** to extract to:
   - Windows: `C:\Users\YourName\RecipeWebsite`
   - Mac: `/Users/YourName/RecipeWebsite`
5. **Click "Extract"** and wait for it to finish
6. **Open the extracted folder** - you should see files like:
   - `package.json`
   - `README.md`
   - `src/` folder
   - `prisma/` folder
   - And many other files

**✅ Checkpoint:** You have extracted the ZIP file and can see the project files.

### Step 1.2: Note Your Project Location

**Write down the full path** to your project folder. You'll need this later!

**Example:**
- Windows: `C:\Users\John\RecipeWebsite`
- Mac: `/Users/John/RecipeWebsite`

---

## 💻 Part 2: Install Required Software

### Step 2.1: Install Node.js

**What is Node.js?**  
Node.js is the software that runs your website. Think of it as the engine of your car.

**How to Install:**

1. **Open your web browser**
2. **Go to:** https://nodejs.org/
3. **Download the LTS version:**
   - You'll see a big green button saying "Download Node.js (LTS)"
   - LTS means "Long Term Support" - this is the stable version
   - The website will automatically detect if you're on Windows or Mac
4. **Run the installer:**
   - **Windows:** Double-click the downloaded `.msi` file
   - **Mac:** Double-click the downloaded `.pkg` file
5. **Follow the installation wizard:**
   - Click "Next" on all screens
   - Accept the license agreement
   - Click "Install"
   - Enter your computer password if asked
   - Wait for installation to complete
6. **Verify installation:**
   - **Windows:** Press `Win + R`, type `cmd`, press Enter
   - **Mac:** Press `Cmd + Space`, type `Terminal`, press Enter
   - In the window that opens, type: `node --version`
   - Press Enter
   - You should see something like: `v20.11.0`
   - Type: `npm --version`
   - Press Enter
   - You should see something like: `10.2.4`

**✅ Checkpoint:** If you see version numbers for both commands, Node.js is installed correctly!

**❌ Problem?** If you see "command not found" or "not recognized":
- Try restarting your computer
- Make sure you downloaded the LTS version
- Try the installation again

### Step 2.2: Install Git (Optional but Recommended)

**What is Git?**  
Git helps manage your code and makes deployment easier.

**How to Install:**

1. **Go to:** https://git-scm.com/downloads
2. **Download Git** for your operating system
3. **Run the installer** and use all default settings
4. **Verify installation:**
   - Open Command Prompt/Terminal
   - Type: `git --version`
   - Press Enter
   - You should see a version number

**✅ Checkpoint:** Git is installed (or you can skip this if you prefer).

### Step 2.3: Install VS Code (Optional but Recommended)

**What is VS Code?**  
VS Code is a code editor that makes it easier to edit files.

**How to Install:**

1. **Go to:** https://code.visualstudio.com/
2. **Download VS Code** for your operating system
3. **Run the installer** and follow the prompts
4. **Open VS Code** after installation

**✅ Checkpoint:** VS Code is installed (optional step).

---

## 🗄️ Part 3: Set Up Database

### Step 3.1: Create a Neon Account

**What is a Database?**  
A database stores all your website's data - recipes, users, comments, etc.

**We'll use Neon (Free PostgreSQL Database):**

1. **Go to:** https://neon.tech/
2. **Click "Sign Up"** (top right corner)
3. **Sign up with:**
   - Your email address, OR
   - Your GitHub account (if you have one)
4. **Verify your email** if required (check your inbox)
5. **Log in** to your Neon account

**✅ Checkpoint:** You have a Neon account and are logged in.

### Step 3.2: Create a New Database Project

1. **Click "Create Project"** (or "New Project" button)
2. **Fill in the form:**
   - **Project Name:** `recipehub` (or any name you like)
   - **Region:** Choose the closest region to you
     - US East (if you're in the US)
     - EU (if you're in Europe)
     - Asia Pacific (if you're in Asia)
   - **PostgreSQL Version:** Leave as default (15)
3. **Click "Create Project"**
4. **Wait 30-60 seconds** for the database to be created

**✅ Checkpoint:** Your database project is created!

### Step 3.3: Get Your Database Connection String

1. **After the project is created**, you'll see a dashboard
2. **Look for "Connection String"** or "Connection Details" section
3. **You'll see something like:**
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
   ```
4. **Click the "Copy" button** next to the connection string
5. **Save it somewhere safe:**
   - Open Notepad (Windows) or TextEdit (Mac)
   - Paste the connection string
   - Save the file as `database-connection.txt` on your Desktop
   - **⚠️ Important:** This contains your password - keep it secret!

**✅ Checkpoint:** You have your database connection string saved safely.

---

## 🔑 Part 4: Get API Keys

Now we'll get all the API keys your website needs. An API key is like a password that lets your website talk to other services.

**💡 Tip:** Create a text file called `api-keys.txt` on your Desktop to save all your keys as you get them.

### Step 4.1: Google OAuth (For Google Sign-In)

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
   - In the search bar at the top, type: `Google+ API`
   - Click on "Google+ API" from the results
   - Click "Enable" button
5. **Configure OAuth consent screen:**
   - Go to: https://console.cloud.google.com/apis/credentials/consent
   - Click "Create" or "Configure Consent Screen"
   - **User Type:** Select "External" (unless you have a Google Workspace)
   - Click "Create"
   - **App Name:** `RecipeHub`
   - **User support email:** Your email address
   - **Developer contact:** Your email address
   - Click "Save and Continue"
   - On "Scopes" page, click "Save and Continue"
   - On "Test users" page, click "Save and Continue"
   - Click "Back to Dashboard"
6. **Create OAuth Credentials:**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "Create Credentials" → "OAuth client ID"
   - **Application type:** Web application
   - **Name:** `RecipeHub Web Client`
   - **Authorized JavaScript origins:**
     - Click "Add URI"
     - Add: `http://localhost:3000`
     - Click "Add URI" again
     - Add: `https://yourdomain.com` (we'll update this later with your real domain)
   - **Authorized redirect URIs:**
     - Click "Add URI"
     - Add: `http://localhost:3000/api/auth/callback/google`
     - Click "Add URI" again
     - Add: `https://yourdomain.com/api/auth/callback/google` (we'll update this later)
   - Click "Create"
7. **Copy your credentials:**
   - **Client ID:** Copy this (looks like: `123456789-abc.apps.googleusercontent.com`)
   - **Client Secret:** Click "Show" and copy this (looks like: `GOCSPX-xxxxx`)
   - **Save both** in your `api-keys.txt` file

**✅ Checkpoint:** You have Google OAuth Client ID and Client Secret saved.

### Step 4.2: YouTube Data API Key

**What is this?**  
Allows your website to search and display YouTube cooking videos.

**How to Get It:**

1. **In the same Google Cloud Console** (from Step 4.1)
2. **Enable YouTube Data API v3:**
   - In the search bar, type: `YouTube Data API v3`
   - Click on it from the results
   - Click "Enable"
3. **Create an API Key:**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "Create Credentials" → "API Key"
   - **Copy the API key** (looks like: `AIzaSy...`)
   - **Save it** in your `api-keys.txt` file
4. **Restrict the API Key (Recommended):**
   - Click on the API key you just created
   - Under "API restrictions", select "Restrict key"
   - Check "YouTube Data API v3"
   - Click "Save"

**✅ Checkpoint:** You have YouTube API key saved.

### Step 4.3: Resend (Email Service)

**What is this?**  
Sends emails to users (verification emails, password resets, etc.).

**How to Get It:**

1. **Go to:** https://resend.com/
2. **Click "Sign Up"** (top right)
3. **Sign up** with your email
4. **Verify your email** (check your inbox for verification email)
5. **Log in** to Resend
6. **Get your API Key:**
   - Go to: https://resend.com/api-keys
   - Click "Create API Key"
   - **Name:** `RecipeHub Production`
   - Click "Add"
   - **Copy the API key** (starts with `re_`)
   - **⚠️ Important:** This is the only time you'll see the full key! Copy it now.
   - **Save it** in your `api-keys.txt` file

**For now, you can use the default sender:** `RecipeHub <onboarding@resend.dev>`

**✅ Checkpoint:** You have Resend API key saved.

### Step 4.4: Uploadthing (Image Uploads)

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
   - **App Name:** `RecipeHub`
   - Click "Create"
7. **Get your keys:**
   - You'll see two keys:
     - **App ID** (looks like: `xxxxx`)
     - **Secret Key** (starts with `sk_`)
   - **Copy both** and save them in your `api-keys.txt` file

**✅ Checkpoint:** You have Uploadthing App ID and Secret Key saved.

### Step 4.5: OpenAI API (AI Features)

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
   - **Set a spending limit** (recommended: $50/month to start)
6. **Get your API Key:**
   - Go to: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - **Name:** `RecipeHub Production`
   - Click "Create secret key"
   - **Copy the key** (starts with `sk-`)
   - **⚠️ Important:** Copy it now - you won't see it again!
   - **Save it** in your `api-keys.txt` file

**✅ Checkpoint:** You have OpenAI API key saved.

### Step 4.6: Spoonacular API (Recipe Data)

**What is this?**  
Provides recipe data, ingredients, nutrition info, and cooking instructions.

**Pricing:**
- Free tier: 150 requests/day
- Basic: $9.99/month (5,000 requests/day)
- Pro: $49.99/month (unlimited requests)
- **Recommended:** Start with Free tier, upgrade to Basic ($9.99/month) when ready

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
   - **Save it** in your `api-keys.txt` file

**✅ Checkpoint:** You have Spoonacular API key saved.

### Step 4.7: 100ms (Live Streaming - Optional)

**What is this?**  
Powers the live cooking sessions feature. This is optional - you can skip it if you don't need live streaming.

**Pricing:**
- Free tier: 10,000 minutes/month
- Paid: $0.0025 per participant-minute after free tier

**How to Get It (Optional):**

1. **Go to:** https://www.100ms.live/
2. **Click "Sign Up"**
3. **Create an account**
4. **Create a new app:**
   - Go to: https://dashboard.100ms.live/
   - Click "Create App"
   - **App Name:** `RecipeHub`
   - Click "Create"
5. **Get your keys:**
   - Go to "Developer" or "API Keys" section
   - **Copy:**
     - **App Access Key** (starts with `xxxxx`)
     - **App Secret** (starts with `xxxxx`)
   - **Save both** in your `api-keys.txt` file
6. **Create a Template:**
   - Go to "Templates" section
   - Click "Create Template"
   - Use default settings
   - **Copy the Template ID** and save it

**✅ Checkpoint:** Optional - 100ms keys obtained (or skipped).

---

## ⚙️ Part 5: Configure Your Website

### Step 5.1: Navigate to Your Project Folder

1. **Open Command Prompt** (Windows) or **Terminal** (Mac)
2. **Navigate to your project folder:**
   - **Windows:** Type: `cd C:\Users\YourName\RecipeWebsite` (replace with your actual path)
   - **Mac:** Type: `cd /Users/YourName/RecipeWebsite` (replace with your actual path)
   - Press Enter

**✅ Checkpoint:** You're in your project folder (you should see the path in your terminal).

### Step 5.2: Install Dependencies

1. **In the same terminal window**, type:
   ```
   npm install
   ```
2. **Press Enter**
3. **Wait 2-5 minutes** for installation to complete
4. **You should see:** "added X packages" when done

**✅ Checkpoint:** Dependencies are installed!

**❌ Problem?** If you see errors:
- Make sure you're in the correct folder
- Make sure Node.js is installed (run `node --version` to check)
- Try deleting `node_modules` folder and `package-lock.json`, then run `npm install` again

### Step 5.3: Create Environment File

1. **In your project folder**, look for a file named `.env.example`
   - If you don't see it, create a new file named `.env.local`
2. **Copy `.env.example`** and rename it to `.env.local`
   - **Windows:** Right-click → Copy, then Paste, rename to `.env.local`
   - **Mac:** Copy the file, rename to `.env.local`
3. **Open `.env.local`** in a text editor (Notepad, VS Code, etc.)

**✅ Checkpoint:** You have `.env.local` file open in a text editor.

### Step 5.4: Fill in Environment Variables

**Open your `api-keys.txt` file** and fill in `.env.local` with all your values:

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
GEMINI_API_KEY=""

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

**Important Notes:**
- Replace all the `paste-your-...-here` parts with your actual values
- Don't delete the quotes (`"`) around the values
- Make sure there are no extra spaces
- For `ADMIN_EMAILS`, use your own email address

**✅ Checkpoint:** All environment variables are filled in (except NEXTAUTH_SECRET).

### Step 5.5: Generate NEXTAUTH_SECRET

**You need to generate a secret key for authentication:**

1. **Open Command Prompt/Terminal**
2. **Run this command:**
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
3. **Copy the output** (a long string of random characters)
4. **Paste it** into `.env.local` as the value for `NEXTAUTH_SECRET`
   - It should look like: `NEXTAUTH_SECRET="aBc123XyZ456..."`

**✅ Checkpoint:** NEXTAUTH_SECRET is generated and added to `.env.local`.

### Step 5.6: Set Up Database

1. **Open Command Prompt/Terminal** in your project folder
2. **Generate Prisma Client:**
   ```
   npx prisma generate
   ```
   Press Enter and wait for it to complete.
3. **Push database schema:**
   ```
   npx prisma db push
   ```
   Press Enter and wait for completion.
4. **You should see:** "Database synchronized" or similar success message

**✅ Checkpoint:** Database is set up!

**❌ Problem?** If you see database connection errors:
- Check your `DATABASE_URL` in `.env.local`
- Make sure it's the full connection string from Neon
- Make sure there are no extra spaces or quotes

---

## 🧪 Part 6: Test Locally

Before deploying, let's make sure everything works on your computer.

### Step 6.1: Start the Development Server

1. **Open Command Prompt/Terminal** in your project folder
2. **Run:**
   ```
   npm run dev
   ```
3. **Wait 30-60 seconds** - you'll see:
   ```
   ▲ Next.js 15.5.9
   - Local:        http://localhost:3000
   ```
4. **Open your browser** and go to: http://localhost:3000

**✅ Checkpoint:** Your website should load in the browser!

### Step 6.2: Test Your Website

**Check these things:**

1. ✅ **Homepage loads** - You should see the RecipeHub homepage
2. ✅ **No error messages** in the browser console:
   - Press `F12` to open developer tools
   - Click "Console" tab
   - Look for any red error messages
3. ✅ **Try signing up:**
   - Click "Sign Up"
   - Create a test account
   - Check your email for verification (if Resend is working)
4. ✅ **Try browsing recipes:**
   - Click "Recipes" in the menu
   - Recipes should load (if Spoonacular API is working)

**✅ Checkpoint:** Website works locally! Move to Part 7.

### Step 6.3: Common Issues

**Problem: "Database connection error"**
- **Solution:** Check your `DATABASE_URL` in `.env.local`
- Make sure it's the full connection string from Neon

**Problem: "API key invalid"**
- **Solution:** Double-check all API keys in `.env.local`
- Make sure there are no extra spaces or quotes

**Problem: "Port 3000 already in use"**
- **Solution:** Close other applications using port 3000
- Or change the port: `npm run dev -- -p 3001`

---

## 🌐 Part 7: Buy Domain & Hosting

### Step 7.1: Buy a Domain Name

**What is a Domain?**  
A domain is your website's address (like `recipehub.com`). Instead of `http://localhost:3000`, users will visit `https://yourdomain.com`.

**Recommended Domain Registrars:**
- **Namecheap** (https://www.namecheap.com/) - Easy to use, good prices
- **Google Domains** (https://domains.google/) - Simple interface
- **GoDaddy** (https://www.godaddy.com/) - Popular, good support

**We'll use Namecheap as an example:**

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
6. **Enter payment information** and complete purchase
7. **Wait for confirmation email** (usually instant)

**✅ Checkpoint:** Domain purchased!

### Step 7.2: Set Up Hosting (Vercel)

**What is Hosting?**  
Hosting is where your website lives on the internet. We'll use Vercel (free for Next.js websites).

1. **Go to:** https://vercel.com/
2. **Click "Sign Up"**
3. **Sign up with GitHub** (recommended) or email
   - If you don't have GitHub, create one at https://github.com/
4. **Verify your email** if required

**✅ Checkpoint:** Vercel account created!

---

## 🚀 Part 8: Deploy to Production

### Step 8.1: Prepare Your Code for GitHub

**Option A: Using GitHub Desktop (Easiest for beginners):**

1. **Download GitHub Desktop:** https://desktop.github.com/
2. **Install and sign in** with your GitHub account
3. **Click "File" → "Add Local Repository"**
4. **Browse to your project folder** and select it
5. **Click "Publish repository"**
6. **Name it:** `recipehub` (or any name)
7. **Make it Private** (recommended)
8. **Click "Publish Repository"**

**Option B: Using Command Line:**

1. **Open Command Prompt/Terminal** in your project folder
2. **Run these commands one by one:**
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/recipehub.git
   git push -u origin main
   ```
   (Replace `yourusername` with your GitHub username)

**✅ Checkpoint:** Your code is on GitHub!

### Step 8.2: Deploy to Vercel

1. **Log in to Vercel**
2. **Click "Add New Project"**
3. **Import your GitHub repository:**
   - Select your repository (`recipehub`)
   - Click "Import"
4. **Configure project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
5. **Add Environment Variables:**
   - Click "Environment Variables" section
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
     - `AI_PROVIDER`
     - And any others you configured
6. **Click "Deploy"**
7. **Wait 2-5 minutes** for deployment
8. **You'll get a URL** like: `https://recipehub.vercel.app`

**✅ Checkpoint:** Website is deployed! You have a URL like `https://recipehub.vercel.app`.

---

## 🔗 Part 9: Connect Domain

### Step 9.1: Add Domain to Vercel

1. **Go to your Vercel project dashboard**
2. **Click "Settings"** → **"Domains"**
3. **Enter your domain** (e.g., `yourdomain.com`)
4. **Click "Add"**
5. **Vercel will show you DNS records** to add

### Step 9.2: Configure DNS

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

### Step 9.3: Verify Domain

1. **In Vercel**, wait for the domain to show as "Valid"
2. **Vercel will automatically issue an SSL certificate** (free HTTPS)
3. **Test your domain:**
   - Go to `https://yourdomain.com`
   - Your website should load!

**✅ Checkpoint:** Domain is connected!

---

## ✅ Part 10: Final Steps

### Step 10.1: Update Environment Variables

**Update these in Vercel:**

1. **Go to Vercel** → Your Project → Settings → Environment Variables
2. **Update `NEXTAUTH_URL`:**
   - Change from `http://localhost:3000`
   - To: `https://yourdomain.com`
3. **Redeploy:**
   - Go to "Deployments"
   - Click the three dots on the latest deployment
   - Click "Redeploy"

### Step 10.2: Update Google OAuth Redirect URIs

1. **Go to:** https://console.cloud.google.com/apis/credentials
2. **Click on your OAuth client** (RecipeHub Web Client)
3. **Add authorized redirect URI:**
   - `https://yourdomain.com/api/auth/callback/google`
4. **Add authorized JavaScript origin:**
   - `https://yourdomain.com`
5. **Click "Save"**

### Step 10.3: Update Resend Domain (Optional)

**To send emails from your domain:**

1. **Go to:** https://resend.com/domains
2. **Add your domain**
3. **Add DNS records** (Resend will show you which ones)
4. **Verify domain** (can take 24-48 hours)
5. **Update `EMAIL_FROM`** in Vercel to: `RecipeHub <noreply@yourdomain.com>`

### Step 10.4: Test Everything

**Test these features:**

1. ✅ **Homepage loads** at `https://yourdomain.com`
2. ✅ **Sign up** - Create a new account
3. ✅ **Email verification** - Check if emails are sent
4. ✅ **Google Sign-In** - Test OAuth login
5. ✅ **Browse recipes** - Check if recipes load
6. ✅ **Upload images** - Test image uploads
7. ✅ **AI features** - Test AI assistant (if configured)

**✅ Checkpoint:** Everything is working! Your website is live! 🎉

---

## 🆘 Troubleshooting

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

## 📚 Quick Reference

### Important URLs

- **Neon Database:** https://neon.tech/
- **Vercel Hosting:** https://vercel.com/
- **Google Cloud Console:** https://console.cloud.google.com/
- **OpenAI:** https://platform.openai.com/
- **Spoonacular:** https://spoonacular.com/food-api
- **Resend:** https://resend.com/
- **Uploadthing:** https://uploadthing.com/

### Important Commands

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push

# Run development server
npm run dev

# Build for production
npm run build
```

### Environment Variables Checklist

- [ ] `DATABASE_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `NEXTAUTH_URL`
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `OPENAI_API_KEY`
- [ ] `UPLOADTHING_SECRET`
- [ ] `UPLOADTHING_APP_ID`
- [ ] `RESEND_API_KEY`
- [ ] `YOUTUBE_API_KEY`
- [ ] `SPOONACULAR_API_KEY`
- [ ] `EMAIL_FROM`
- [ ] `ADMIN_EMAILS`
- [ ] `AI_PROVIDER`

---

## 🎉 Congratulations!

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

*Document Version: 2.0*  
*Last Updated: January 2025*
