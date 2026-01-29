# RecipeHub - Complete Setup & Backend Architecture Guide

**Document for Client Handoff**  
**Version:** 1.0  
**Date:** January 2026

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Stripe Payment Setup](#2-stripe-payment-setup)
3. [Payment Markup Configuration (2-3% Commission)](#3-payment-markup-configuration-2-3-commission)
4. [Backend Architecture Overview](#4-backend-architecture-overview)
5. [Recipe Fetching System](#5-recipe-fetching-system)
6. [AI Chatbot & Assistance Features](#6-ai-chatbot--assistance-features)
7. [Testing Your Setup](#7-testing-your-setup)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Introduction

Welcome to RecipeHub! This document provides comprehensive instructions for setting up the Stripe payment system with custom markup/commission, and explains how the backend systems work, including:

- **E-Store Payment Processing** with Stripe
- **Commission/Markup Configuration** (2% or 3% per transaction)
- **Recipe Fetching** from database and external APIs
- **AI-Powered Chatbot** for cooking assistance
- **AI Recipe Assistant** features

This guide is designed for non-technical users and will walk you through each step carefully.

---

## 2. Stripe Payment Setup

### What is Stripe?

Stripe is a payment processing platform that allows your website to accept credit card payments securely. Your RecipeHub website uses Stripe to sell cooking documents (e-books, recipe books) through the E-Store section.

### Step-by-Step Stripe Setup

#### Step 1: Create a Stripe Account

1. **Go to Stripe:**
   - Visit [https://stripe.com](https://stripe.com)
   - Click **"Start now"** or **"Sign up"**

2. **Fill in Business Information:**
   - Business name: Your company/website name
   - Business type: Select appropriate category (Individual, Company, etc.)
   - Country: Your country of operation
   - Email and password

3. **Verify Your Email:**
   - Check your email inbox
   - Click the verification link from Stripe

4. **Complete Business Profile:**
   - Provide business details as requested
   - Add banking information (where you'll receive payments)
   - Submit required identification documents

> **Note:** Stripe verification can take 1-3 business days

#### Step 2: Get Your API Keys

Once your Stripe account is approved:

1. **Login to Stripe Dashboard:**
   - Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)

2. **Navigate to API Keys:**
   - Click **"Developers"** in the left sidebar
   - Click **"API keys"**

3. **Copy Your Keys:**
   You'll see two types of keys:
   
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
     - This is safe to share publicly
     - Used in your website's frontend
   
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)
     - **Keep this private!** Never share it
     - Used in your website's backend

4. **Save These Keys:**
   
   Open your `.env` file (in your website folder) and add:
   
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_SECRET_KEY=sk_test_your_key_here
   ```

> **Important:** 
> - Test keys (with `test_`) are for testing - no real money is charged
> - Live keys (with `live_`) are for production - real transactions!
> - Start with test keys, switch to live when ready to go live

#### Step 3: Setup Stripe Webhooks

Webhooks notify your website when payments succeed or fail. This is crucial for processing purchases.

**For Testing (Local Development):**

1. **Install Stripe CLI:**
   - Download from [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
   - Follow installation instructions for your operating system

2. **Login to Stripe CLI:**
   ```bash
   stripe login
   ```
   - This will open your browser to authorize

3. **Forward Webhooks to Your Local Server:**
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   
4. **Copy the Webhook Secret:**
   - The CLI will display a webhook signing secret (starts with `whsec_`)
   - Add it to your `.env` file:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
   ```

**For Production (Live Website):**

1. **Go to Stripe Dashboard:**
   - Click **"Developers"** → **"Webhooks"**

2. **Add Endpoint:**
   - Click **"Add endpoint"**
   - Enter your webhook URL: `https://your-domain.com/api/stripe/webhook`
   - Replace `your-domain.com` with your actual website domain

3. **Select Events:**
   
   Choose these events to listen for:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.payment_failed`

4. **Copy Webhook Secret:**
   - After creating the endpoint, click on it
   - Copy the **"Signing secret"** (starts with `whsec_`)
   - Add to your `.env` file:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_production_secret_here
   ```

#### Step 4: Test Your Payment Setup

1. **Use Stripe Test Cards:**
   
   For testing, use these test card numbers:
   
   | Card Number | Result |
   |-------------|--------|
   | `4242 4242 4242 4242` | ✅ Payment succeeds |
   | `4000 0000 0000 0002` | ❌ Payment declined |
   | `4000 0025 0000 3155` | ⚠️ Requires 3D Secure |
   
   - Use any future expiry date (e.g., 12/25)
   - Use any 3-digit CVC (e.g., 123)
   - Use any ZIP code (e.g., 12345)

2. **Make a Test Purchase:**
   - Go to your E-Store page
   - Select a document to purchase
   - Click "Purchase"
   - Use a test card number above
   - Verify you're redirected to success page
   - Check Stripe Dashboard to see the transaction

---

## 3. Payment Markup Configuration (2-3% Commission)

### Understanding Platform Fees

Currently, your RecipeHub platform sells documents at their full price, and you (as the platform owner) receive the full payment minus Stripe's transaction fee.

**Stripe's Standard Fees:**
- **2.9% + $0.30** per successful transaction

**Your Markup/Commission:**
- You want to add **2-3%** additional markup for platform revenue

### How Markup Works

Let's say a document costs **$10.00**:

**Without Platform Markup:**
- Document price: $10.00
- Stripe fee: $0.59 (2.9% + $0.30)
- You receive: $9.41

**With 3% Platform Markup:**
- Document price: $10.00
- Your markup (3%): $0.30
- Stripe fee: $0.59
- Document author receives: $9.11
- You receive: $0.30 (your commission)
- Total to author: $9.11

### Implementation Options

Your website code currently processes payments at the full document price. To implement a markup system, you have **two options**:

#### Option A: Simple Markup (Recommended for Start)

**Add markup to document prices:**

1. When setting document prices in the admin panel, simply price them 2-3% higher than the base cost
2. Example: If a book costs $10, price it at $10.30 (3% markup)
3. You receive the full amount minus Stripe fees

**Pros:**
- Simple to implement
- No code changes needed
- Easy to understand

**Cons:**
- Less transparent to document authors
- Not automated

#### Option B: Automated Commission Split (Advanced)

**Use Stripe Connect to automatically split payments:**

This requires additional development but allows automatic commission splitting.

1. **Setup Stripe Connect:**
   - Enables marketplace functionality
   - Document authors create Stripe accounts
   - Payments automatically split between you and authors

2. **Code Modifications Needed:**
   
   The current checkout code in `src/app/api/stripe/checkout/route.ts` would need to be modified to include:
   
   ```typescript
   // Add application fee (your commission)
   const applicationFeeAmount = Math.round(document.price * 0.03); // 3% fee
   
   const checkoutSession = await stripe.checkout.sessions.create({
     payment_method_types: ['card'],
     line_items: [/* ... */],
     mode: 'payment',
     payment_intent_data: {
       application_fee_amount: applicationFeeAmount,
       transfer_data: {
         destination: documentOwnerStripeAccountId, // Author's Stripe account
       },
     },
     // ... rest of configuration
   });
   ```

3. **Requirements:**
   - Document authors need to connect their Stripe accounts
   - Additional verification processes
   - More complex setup

**Recommendation:** Start with Option A (simple markup) and upgrade to Option B if you have many content creators.

### Setting Your Commission Percentage

To set a specific commission percentage (2% or 3%), you can configure this in your environment variables:

1. **Add to `.env` file:**
   ```env
   PLATFORM_COMMISSION_PERCENTAGE=3
   ```

2. **This would require a code update** in `src/app/api/stripe/checkout/route.ts` to read this value:
   ```typescript
   const commissionPercentage = parseFloat(process.env.PLATFORM_COMMISSION_PERCENTAGE || "3");
   const platformFee = Math.round(document.price * (commissionPercentage / 100));
   ```

> **Note:** If you need help implementing the automated commission split, please contact your developer for code modifications.

### Stripe Fee Calculator

Here's a quick reference for understanding fees:

| Sale Price | Stripe Fee | Your 3% | Author Gets | You Receive |
|------------|-----------|---------|-------------|-------------|
| $5.00 | $0.45 | $0.15 | $4.40 | $0.15 |
| $10.00 | $0.59 | $0.30 | $9.11 | $0.30 |
| $20.00 | $0.88 | $0.60 | $18.52 | $0.60 |
| $50.00 | $1.75 | $1.50 | $46.75 | $1.50 |

---

## 4. Backend Architecture Overview

### System Architecture

Your RecipeHub website is built with modern technologies:

```
┌─────────────────────────────────────────────────────────┐
│                     Web Browser                          │
│                   (User Interface)                       │
└────────────┬────────────────────────────────────────────┘
             │
             │ HTTPS Requests
             ▼
┌─────────────────────────────────────────────────────────┐
│                  Next.js Frontend                        │
│          (Pages, Components, UI Logic)                   │
└────────────┬────────────────────────────────────────────┘
             │
             │ API Calls
             ▼
┌─────────────────────────────────────────────────────────┐
│                  Next.js API Routes                      │
│                  (Backend Logic)                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  ├─ /api/recipes     → Recipe Management         │  │
│  │  ├─ /api/ai          → AI Features               │  │
│  │  ├─ /api/stripe      → Payment Processing        │  │
│  │  ├─ /api/auth        → Authentication            │  │
│  │  └─ /api/community   → Social Features           │  │
│  └──────────────────────────────────────────────────┘  │
└─────┬──────────┬──────────┬──────────┬─────────────────┘
      │          │          │          │
      ▼          ▼          ▼          ▼
┌──────────┐ ┌────────┐ ┌──────────┐ ┌───────────────┐
│PostgreSQL│ │ Stripe │ │ Groq AI  │ │  Spoonacular  │
│ Database │ │   API  │ │   API    │ │      API      │
└──────────┘ └────────┘ └──────────┘ └───────────────┘
```

### Technology Stack

- **Frontend Framework:** Next.js 15 (React-based)
- **Backend:** Next.js API Routes (Serverless Functions)
- **Database:** PostgreSQL (via Prisma ORM)
- **Payment Processing:** Stripe
- **AI Services:** Groq (primary), OpenAI (fallback)
- **Recipe Data:** Spoonacular API + Local Database
- **Authentication:** NextAuth.js
- **File Storage:** Cloudinary
- **Email:** Gmail SMTP / Resend

### Database Schema

The website uses PostgreSQL database with the following main tables:

**Key Tables:**
1. **User** - User accounts and profiles
2. **Recipe** - Recipe information
3. **CookingDocument** - E-store products (e-books, guides)
4. **Purchase** - Payment records
5. **AIConversation** - Chatbot conversation history
6. **Group** - Community groups
7. **Post** - Community posts
8. **LiveSession** - Cooking livestreams

### API Routes Structure

The backend is organized into API routes located in `src/app/api/`:

```
api/
├── recipes/          → Recipe CRUD operations
├── stripe/
│   ├── checkout/     → Create payment sessions
│   └── webhook/      → Process payment events
├── ai/
│   ├── chat/         → Recipe-specific chatbot
│   ├── assistant/    → General cooking assistant
│   ├── generate-directions/  → AI recipe directions
│   └── voice-guide/  → Text-to-speech cooking guide
├── e-store/
│   ├── documents/    → Document management
│   └── purchases/    → Purchase history
├── community/        → Social features
├── groups/           → Group management
└── auth/             → User authentication
```

---

## 5. Recipe Fetching System

### How Recipes Are Loaded

RecipeHub uses a **hybrid approach** to provide users with a vast recipe collection:

#### Primary Source: Local Database

1. **Database Storage:**
   - Recipes are stored in PostgreSQL database
   - Includes: title, description, ingredients, directions, images, nutrition
   - Organized by categories (breakfast, lunch, dinner, etc.)

2. **API Endpoint:**
   ```
   GET /api/recipes
   ```
   
   **Parameters:**
   - `page` - Pagination (default: 1)
   - `limit` - Results per page (default: 12)
   - `category` - Filter by category
   - `search` - Search recipes by keyword
   - `sort` - Sort by: newest, popular, quickest

3. **Database Query Flow:**
   ```
   User visits homepage
     ↓
   Frontend calls: GET /api/recipes?page=1&limit=12
     ↓
   Backend queries PostgreSQL via Prisma
     ↓
   Returns: recipes + pagination + total count
     ↓
   Frontend displays recipe cards
   ```

#### Secondary Source: Spoonacular API

When local database has insufficient results (less than 6 recipes), the system automatically fetches from Spoonacular API:

1. **Spoonacular Integration:**
   - External recipe API with 300,000+ recipes
   - Free tier: 150 requests/day
   - Provides recipe data, nutrition, ingredients

2. **Fallback Logic:**
   
   ```typescript
   // From: src/app/api/recipes/route.ts (simplified)
   
   // Check if local results are insufficient
   if (recipes.length < 6 && (category || search)) {
     // Fetch from Spoonacular
     const spoonResults = await searchRecipes(query, limit);
     
     // Combine local + external results
     return [...localRecipes, ...spoonacularRecipes];
   }
   ```

3. **Spoonacular API Call:**
   ```javascript
   // Fetches recipes from Spoonacular
   const response = await fetch(
     `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${API_KEY}`
   );
   ```

#### Recipe Detail View

When a user clicks on a recipe:

1. **Route:** `/recipes/[slug]`
2. **API Call:** `GET /api/recipes/[slug]`
3. **Database Query:**
   ```sql
   SELECT recipe + ingredients + directions + nutrition + reviews
   FROM recipes
   WHERE slug = 'chocolate-cake'
   ```
4. **Response includes:**
   - Full recipe details
   - Step-by-step directions
   - Ingredient list with amounts
   - Nutritional information
   - User reviews and ratings
   - Related recipes

### Recipe Search & Filtering

The search system provides multiple filtering options:

1. **Text Search:**
   - Searches recipe titles, descriptions, and ingredients
   - Case-insensitive partial matching
   
2. **Category Filtering:**
   - Breakfast, Lunch, Dinner, Dessert, etc.
   - Filters by category slug or name

3. **Smart Search (AI-Enhanced):**
   - API: `POST /api/recipes/smart-search`
   - Uses AI to understand natural language queries
   - Example: "quick healthy dinner" → filters by time + category

### Caching & Performance

To improve performance:

1. **Database Indexing:**
   - Indexed on: slug, categoryId, createdAt
   - Faster query performance

2. **Pagination:**
   - Loads 12 recipes per page by default
   - Prevents loading thousands of recipes at once

3. **Lazy Loading:**
   - Images load as user scrolls
   - Improves initial page load time

---

## 6. AI Chatbot & Assistance Features

### Overview of AI Features

RecipeHub includes **four main AI-powered features**:

1. **Recipe-Specific Chatbot** - Ask questions about a specific recipe
2. **General Cooking Assistant** - General cooking advice
3. **AI Recipe Directions Generator** - Auto-generate cooking steps
4. **Voice-Guided Cooking** - Text-to-speech cooking instructions

### AI Provider: Groq

**Why Groq?**
- Fast inference speed (faster than OpenAI)
- Higher free tier limits
- Cost-effective for high-volume usage
- Uses Llama 3 models

**Configuration:**
```env
GROQ_API_KEY=your_groq_api_key
AI_PROVIDER=groq
```

**Fallback:** If Groq fails, system can fall back to OpenAI (if configured)

---

### Feature 1: Recipe-Specific Chatbot

**Location:** Available on each recipe detail page

**API Endpoint:**
```
POST /api/ai/chat
```

**How It Works:**

1. **User Opens Recipe:**
   - User views a recipe (e.g., "Chocolate Chip Cookies")
   - Chatbot interface appears on the page

2. **User Asks Question:**
   - Example: "Can I substitute butter with coconut oil?"
   - Frontend sends request to `/api/ai/chat`

3. **Backend Processing:**
   
   ```typescript
   // From: src/app/api/ai/chat/route.ts (simplified)
   
   // 1. Fetch recipe data from database
   const recipe = await prisma.recipe.findUnique({
     where: { id: recipeId },
     include: { ingredients, directions, nutrition }
   });
   
   // 2. Build context for AI
   const context = {
     title: "Chocolate Chip Cookies",
     ingredients: ["2 cups flour", "1 cup butter", ...],
     directions: ["Preheat oven to 350°F", ...],
     nutrition: { calories: 150, protein: 2, ... }
   };
   
   // 3. Send to Groq AI with context
   const aiResponse = await groq.chatWithRecipeContext(
     context,
     userMessage,
     conversationHistory
   );
   
   // 4. Return AI response
   return { response: "Yes, you can substitute...", ... };
   ```

4. **AI Response:**
   - AI understands the recipe context
   - Provides specific answer based on ingredients and directions
   - Maintains conversation history for follow-up questions

**Conversation History:**
- Stored in database (`AIConversation` table)
- Allows multi-turn conversations
- Example:
  ```
  User: "Can I make this vegan?"
  AI: "Yes, substitute eggs with flax eggs..."
  User: "How do I make flax eggs?"
  AI: "Mix 1 tbsp ground flaxseed with 3 tbsp water..."
  ```

**Rate Limiting:**
- 50 requests per hour per user
- Prevents abuse and API costs

---

### Feature 2: General Cooking Assistant

**Location:** Available site-wide (header chatbot icon)

**API Endpoint:**
```
POST /api/ai/assistant
```

**How It Works:**

1. **User Asks General Question:**
   - Not tied to a specific recipe
   - Example: "How do I properly season cast iron?"

2. **AI Orchestrator:**
   
   ```typescript
   // From: src/app/api/ai/assistant/route.ts
   
   const orchestrator = new AIOrchestrator();
   const response = await orchestrator.handleRequest(
     userMessage,
     { conversationHistory }
   );
   ```

3. **Intelligent Request Routing:**
   - Analyzes user intent
   - Routes to appropriate handler:
     - Recipe search
     - Cooking technique advice
     - Ingredient substitutions
     - Nutrition questions
     - Equipment recommendations

4. **Response Types:**
   - Text answers
   - Recipe suggestions (with links)
   - Step-by-step instructions
   - External resource links

---

### Feature 3: AI Recipe Directions Generator

**Location:** Recipe detail page (when directions are missing)

**API Endpoint:**
```
POST /api/ai/generate-directions
```

**Use Case:**
- Some imported recipes lack cooking directions
- AI generates step-by-step instructions based on ingredients

**How It Works:**

1. **User Clicks "Generate Directions" Button:**
   - Available when recipe has no directions

2. **Backend Process:**
   
   ```typescript
   // Fetch recipe ingredients
   const recipe = await prisma.recipe.findUnique({
     where: { id },
     include: { ingredients }
   });
   
   // Generate directions using AI
   const aiPrompt = `Create step-by-step cooking directions for:
   Recipe: ${recipe.title}
   Ingredients: ${recipe.ingredients.join(", ")}
   Serves: ${recipe.servings}`;
   
   const directions = await groq.generateDirections(aiPrompt);
   
   // Save to database
   await prisma.direction.createMany({
     data: directions.map((step, index) => ({
       recipeId: recipe.id,
       stepNumber: index + 1,
       instruction: step
     }))
   });
   ```

3. **Result:**
   - Directions saved to database
   - Page refreshes to show new directions
   - Future visitors see the directions

---

### Feature 4: Voice-Guided Cooking

**Location:** Recipe detail page (speaker icon)

**API Endpoint:**
```
POST /api/tts/generate
```

**How It Works:**

1. **User Clicks Voice Guide:**
   - Converts recipe directions to audio
   - Hands-free cooking experience

2. **Text-to-Speech Processing:**
   
   ```typescript
   // Uses OpenAI TTS or ElevenLabs
   const audioBuffer = await openai.audio.speech.create({
     model: "tts-1",
     voice: "alloy",
     input: recipeDirections.join(". ")
   });
   ```

3. **Audio Playback:**
   - Streams audio to browser
   - Controls: play, pause, skip steps
   - Progress indicator

**TTS Provider Options:**
- **OpenAI TTS** (default): High quality, multiple voices
- **ElevenLabs**: Ultra-realistic voices (premium)

**Configuration:**
```env
TTS_PROVIDER=openai
OPENAI_API_KEY=your_key
```

---

### AI Cost Management

**Free Tier Usage:**

| AI Feature | Provider | Free Tier | Cost After |
|-----------|----------|-----------|------------|
| Recipe Chat | Groq | Generous | ~$0.10/1M tokens |
| Assistant | Groq | Generous | ~$0.10/1M tokens |
| Directions Gen | Groq | Generous | ~$0.10/1M tokens |
| Voice Guide | OpenAI | $5 credit | $0.015/1K chars |

**Tips to Minimize Costs:**
1. Implement rate limiting (already done)
2. Cache common AI responses
3. Use Groq for most features (cheaper)
4. Monitor usage in Groq/OpenAI dashboards

---

## 7. Testing Your Setup

### Step 1: Verify Environment Variables

Run this checklist:

```bash
# Check .env file exists
ls .env

# Verify all keys are set (no empty values)
# Required variables:
# ✓ DATABASE_URL
# ✓ NEXTAUTH_SECRET
# ✓ STRIPE_SECRET_KEY
# ✓ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# ✓ STRIPE_WEBHOOK_SECRET
# ✓ GROQ_API_KEY
```

### Step 2: Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed initial data
npm run seed
```

### Step 3: Start Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

### Step 4: Test Each Feature

**Test Recipes:**
1. ✓ Homepage loads recipes
2. ✓ Click on a recipe → detail page loads
3. ✓ Search for "chicken" → results appear
4. ✓ Filter by category → recipes filter

**Test AI Chatbot:**
1. ✓ Open a recipe
2. ✓ Click chatbot icon
3. ✓ Type: "Can I make this ahead?"
4. ✓ AI responds with relevant answer

**Test Stripe Payment:**
1. ✓ Go to E-Store
2. ✓ Click "Purchase" on a document
3. ✓ Use test card: `4242 4242 4242 4242`
4. ✓ Complete checkout
5. ✓ Redirected to success page
6. ✓ Check Stripe Dashboard → payment appears

**Test Webhooks (Local):**
1. ✓ Run Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
2. ✓ Make a test purchase
3. ✓ Check webhook CLI output → events received
4. ✓ Check database → purchase record created

---

## 8. Troubleshooting

### Payment Issues

**Error: "Stripe is not defined"**
- **Cause:** Missing publishable key
- **Fix:** Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `.env`
- **Restart:** Server must be restarted after .env changes

**Error: "Webhook signature verification failed"**
- **Cause:** Incorrect webhook secret or Stripe CLI not running
- **Fix (Local):** Run `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- **Fix (Production):** Verify webhook secret matches Stripe dashboard

**Payment Succeeds but Purchase Not Recorded**
- **Cause:** Webhook not firing or database issue
- **Check:** Stripe Dashboard → Developers → Webhooks → Recent deliveries
- **Fix:** Ensure webhook endpoint is publicly accessible (production)
- **Fix:** Check database connection string

### AI Chatbot Issues

**Error: "Failed to get AI response"**
- **Cause:** Invalid or missing Groq API key
- **Fix:** Verify `GROQ_API_KEY` in `.env`
- **Test:** Visit [console.groq.com](https://console.groq.com) → check API key validity

**Chatbot Responds Slowly**
- **Normal:** First response may take 2-3 seconds
- **Cause:** Groq API latency (usually very fast)
- **Check:** Network connection and Groq status

**Rate Limit Error**
- **Cause:** Exceeded 50 requests/hour
- **Fix:** Wait for rate limit reset
- **Adjust:** Modify rate limit in `src/app/api/ai/chat/route.ts`

### Recipe Fetching Issues

**No Recipes Showing**
- **Cause:** Empty database
- **Fix:** Run seed script: `npm run seed`
- **Alternative:** Import recipes via admin panel

**Spoonacular API Error**
- **Cause:** Invalid API key or exceeded quota (150/day free tier)
- **Fix:** Check `SPOONACULAR_API_KEY` in `.env`
- **Check Quota:** Visit [spoonacular.com/food-api/console](https://spoonacular.com/food-api/console)

**Search Returns No Results**
- **Normal:** If searching for very specific terms
- **Check:** Try broader search terms
- **Fallback:** Spoonacular integration should provide results

### General Issues

**Error: "Database connection failed"**
- **Cause:** Invalid `DATABASE_URL`
- **Fix:** Verify connection string format:
  ```
  postgresql://user:password@host:5432/database?sslmode=require
  ```
- **Test:** Run `npx prisma db push` to test connection

**Error: "Module not found"**
- **Cause:** Missing dependencies
- **Fix:** Run `npm install`

**Changes Not Appearing**
- **Fix:** Restart dev server (`Ctrl+C` then `npm run dev`)
- **Clear Cache:** Delete `.next` folder: `rm -rf .next`

---

## Support & Next Steps

### Going Live Checklist

Before launching to production:

- [ ] Switch Stripe keys from test to live mode
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Setup production webhook endpoint in Stripe
- [ ] Configure custom domain
- [ ] Enable SSL certificate (HTTPS)
- [ ] Run database migrations on production database
- [ ] Test all payment flows with real cards
- [ ] Setup error monitoring (Sentry, etc.)
- [ ] Configure backups for database
- [ ] Review and adjust AI rate limits

### Monitoring Your Platform

**Stripe Dashboard:**
- Monitor daily/monthly revenue
- View transaction details
- Check for failed payments
- Download financial reports

**Database Management:**
- Use Prisma Studio: `npx prisma studio`
- View and edit data
- Monitor database size

**AI Usage:**
- Groq Console: [console.groq.com](https://console.groq.com)
- Monitor token usage
- Check API limits

### Getting Help

For technical support, contact your developer with:
1. Error messages (screenshots)
2. Steps to reproduce the issue
3. Browser console logs (F12 → Console tab)
4. Server logs (terminal output)

---

**Congratulations!** You now have a complete understanding of how your RecipeHub platform works, from payment processing to AI-powered features.

🎉 **Happy cooking and successful business!** 👨‍🍳
