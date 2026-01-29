# API Keys Setup Guide for RecipeHub

This guide will help you obtain all the necessary API keys and configure your RecipeHub application. Follow each section carefully.

---

## Table of Contents
1. [Database Setup (PostgreSQL)](#1-database-setup-postgresql)
2. [Authentication (NextAuth)](#2-authentication-nextauth)
3. [Google OAuth](#3-google-oauth)
4. [Email Service (Resend)](#4-email-service-resend)
5. [File Upload (Cloudinary)](#5-file-upload-cloudinary)
6. [Payment Processing (Stripe)](#6-payment-processing-stripe)
7. [AI Features (Groq)](#7-ai-features-groq)
8. [YouTube API](#8-youtube-api)
9. [Final Configuration](#9-final-configuration)

---

## 1. Database Setup (PostgreSQL)

### What you need:
- `DATABASE_URL`

### Option A: Neon (Recommended - Free Tier Available)

1. Go to [neon.tech](https://neon.tech)
2. Click **Sign Up** and create a free account
3. Click **Create a project**
4. Choose a project name and region (select closest to your users)
5. Copy the connection string that looks like:
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
6. Paste this into your `.env` file as `DATABASE_URL`

### Option B: Supabase (Alternative - Free Tier Available)

1. Go to [supabase.com](https://supabase.com)
2. Sign up and create a new project
3. Go to **Project Settings** → **Database**
4. Copy the **Connection string** (URI mode)
5. Paste into `.env` as `DATABASE_URL`

---

## 2. Authentication (NextAuth)

### What you need:
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

### Steps:

1. **Generate NEXTAUTH_SECRET:**
   - Open a terminal/command prompt
   - Run this command:
     ```bash
     openssl rand -base64 32
     ```
   - If you don't have OpenSSL, use [this online generator](https://generate-secret.vercel.app/32)
   - Copy the generated string

2. **Set NEXTAUTH_URL:**
   - For local development: `http://localhost:3000`
   - For production: Your actual domain (e.g., `https://yoursite.com`)

**Example:**
```env
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000
```

---

## 3. Google OAuth

### What you need:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### Steps:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API**:
   - Click **APIs & Services** → **Library**
   - Search for "Google+ API" and click **Enable**
4. Create OAuth credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Choose **Web application**
   - Set **Authorized JavaScript origins**:
     - `http://localhost:3000` (for local)
     - Your production URL (for live site)
   - Set **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google` (for local)
     - `https://yoursite.com/api/auth/callback/google` (for production)
5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

**Cost:** FREE ✅

---

## 4. Email Service (Resend)

### What you need:
- `RESEND_API_KEY`

### Steps:

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Click **API Keys** in the sidebar
4. Click **Create API Key**
5. Give it a name (e.g., "RecipeHub Production")
6. Copy the API key (you can only see it once!)

**Free Tier:** 100 emails/day, 3,000 emails/month ✅

---

## 5. File Upload (Cloudinary)

### What you need:
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Steps:

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. After login, go to your **Dashboard**
4. Find your credentials in the **Account Details** section:
   - **Cloud Name** → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET` (click "show" to reveal)
5. Copy all three values

**Free Tier:** 25 GB storage, 25 GB bandwidth/month ✅

---

## 6. Payment Processing (Stripe)

### What you need:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Steps:

1. Go to [stripe.com](https://stripe.com)
2. Create an account (business details required)
3. Get API Keys:
   - Go to **Developers** → **API keys**
   - Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copy **Secret key** → `STRIPE_SECRET_KEY`
   
4. Setup Webhook (for production):
   - Go to **Developers** → **Webhooks**
   - Click **Add endpoint**
   - Enter your webhook URL: `https://yoursite.com/api/stripe/webhook`
   - Select events to listen to:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
   - Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

5. For local testing:
   - Install Stripe CLI: [stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
   - Run: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
   - Copy the webhook secret displayed

**Cost:** Transaction fees apply (2.9% + $0.30 per successful charge)

---

## 7. AI Features (Groq)

### What you need:
- `GROQ_API_KEY`

### Steps:

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Go to **API Keys** section
4. Click **Create API Key**
5. Give it a name and copy the key

**Free Tier:** Generous free tier available ✅

---

## 8. YouTube API

### What you need:
- `YOUTUBE_API_KEY`

### Steps:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Use the same project as Google OAuth (or create a new one)
3. Enable **YouTube Data API v3**:
   - Click **APIs & Services** → **Library**
   - Search for "YouTube Data API v3"
   - Click **Enable**
4. Create API Key:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **API key**
   - Copy the API key
   - (Optional) Click **Restrict Key** and limit to YouTube Data API v3

**Free Tier:** 10,000 quota units/day ✅

---

## 9. Final Configuration

### Create your .env file:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in all the values you collected:

```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# Authentication
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email
RESEND_API_KEY="your-resend-api-key"

# File Upload
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AI
GROQ_API_KEY="your-groq-api-key"

# YouTube
YOUTUBE_API_KEY="your-youtube-api-key"
```

### Run Database Migrations:

After configuring all environment variables, initialize the database:

```bash
npx prisma generate
npx prisma db push
```

### Test Your Setup:

```bash
npm run dev
```

Visit `http://localhost:3000` to verify everything works!

---

## Cost Summary

| Service | Free Tier | Cost |
|---------|-----------|------|
| Neon (Database) | 500 MB storage | FREE ✅ |
| Google OAuth | Unlimited | FREE ✅ |
| Resend (Email) | 3,000 emails/month | FREE ✅ |
| Cloudinary | 25 GB storage | FREE ✅ |
| Stripe | N/A | 2.9% + $0.30 per transaction |
| Groq (AI) | Generous limits | FREE ✅ |
| YouTube API | 10,000 units/day | FREE ✅ |

**Total Monthly Cost:** $0 (until you have paying customers through Stripe)

---

## Troubleshooting

### "Invalid DATABASE_URL"
- Make sure the connection string has no extra spaces
- Verify it starts with `postgresql://`
- Check that SSL mode is included: `?sslmode=require`

### "Google OAuth not working"
- Verify redirect URIs exactly match (including http/https)
- Make sure Google+ API is enabled
- Check that credentials are for "Web application" type

### "Email not sending"
- Verify Resend API key is correct
- Check domain verification if using custom domain
- Look at Resend dashboard for delivery logs

### "Stripe webhook failing"
- For local testing, make sure Stripe CLI is running
- For production, verify webhook URL is publicly accessible
- Ensure selected events include `checkout.session.completed`

---

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` file to Git
- Keep all API keys secret
- Use different keys for development and production
- Regenerate keys if accidentally exposed
- Enable 2FA on all service accounts

---

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Check the application logs for specific error messages
4. Consult the official documentation for each service

**Happy cooking! 👨‍🍳**
