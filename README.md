# RecipeHub - AI-Powered Recipe Platform 🍳

A modern, feature-rich recipe platform with AI-powered cooking assistance, live streaming, community engagement, and comprehensive recipe management. Built with Next.js 15, TypeScript, and PostgreSQL.

![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748)
![License](https://img.shields.io/badge/License-Private-red)

## 🌟 Features

### 🍽️ Recipe Management
- **Browse & Search**: Discover thousands of recipes with advanced filtering
- **Recipe Details**: Complete ingredients, step-by-step directions, and nutrition facts
- **YouTube Integration**: Automatic video tutorials for recipes
- **Recipe Import**: Import recipes from YouTube videos or Spoonacular API
- **Smart Search**: AI-powered recipe search and suggestions
- **Save Recipes**: Personal recipe collection
- **Reviews & Ratings**: Community-driven recipe ratings

### 🤖 AI-Powered Features
- **AI Recipe Assistant**: Get step-by-step cooking guidance
- **Voice Cooking Guide**: Hands-free cooking instructions via text-to-speech
- **AI Recipe Suggestions**: Personalized recipe recommendations
- **Grocery List Generator**: AI-generated shopping lists from recipes
- **Ingredient Substitutions**: Smart ingredient replacement suggestions
- **AI Chat**: Interactive cooking assistant

### 🎥 Live Streaming & Video
- **Live Cooking Sessions**: Watch and host live cooking streams
- **Group Live Sessions**: Collaborative cooking sessions in groups
- **YouTube Player**: Integrated video playback
- **Video Transcripts**: AI-powered video content parsing

### 👥 Community Features
- **Community Posts**: Share cooking experiences and tips
- **Groups**: Create and join cooking groups
- **Group Chat**: Real-time messaging in groups
- **Live Sessions**: Host live cooking sessions in groups
- **Reactions & Comments**: Engage with community content
- **Announcements**: Site-wide announcements system

### 📱 User Features
- **User Dashboard**: Personalized recipe dashboard
- **Saved Recipes**: Bookmark favorite recipes
- **Profile Management**: Customize your profile and bio
- **Notifications**: Real-time notification system
- **Settings**: Account and preference management

### 🛠️ Admin Features
- **Admin Panel**: Comprehensive content management
- **Recipe Management**: Create, edit, and manage recipes
- **Content Generation**: AI-powered automatic content generation
- **Category Management**: Organize recipes by categories
- **Announcements**: Manage site announcements
- **User Management**: User role and permission management

### 📊 Content Features
- **Kitchen Tips**: Daily cooking tips and tricks
- **Cooking Hacks**: Quick cooking shortcuts
- **Food Trends**: Latest food and cooking trends
- **Auto-Generated Content**: AI-powered content generation on startup

## 🚀 Tech Stack

### Frontend
- **Next.js 15.5.9** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Lucide React** - Beautiful icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Relational database
- **NextAuth.js** - Authentication system

### AI & Services
- **OpenAI API** - GPT models for AI features
- **Google Gemini API** - Alternative AI provider
- **OpenRouter** - Unified AI API access
- **Spoonacular API** - Recipe data and nutrition
- **YouTube Data API** - Video integration
- **Resend** - Email service
- **Uploadthing** - Image and file uploads
- **100ms** - Live streaming infrastructure

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Prisma Studio** - Database GUI

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm (or yarn/pnpm)
- **PostgreSQL** database (local or cloud-hosted like Neon, Supabase, or Railway)
- **Git** for version control

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd RecipeWebsite
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in all required values. See the [Environment Variables](#-environment-variables) section below for detailed explanations.

### 4. Database Setup

#### Generate Prisma Client

```bash
npx prisma generate
```

#### Run Database Migrations

```bash
npx prisma db push
```

Or if you prefer using migrations:

```bash
npx prisma migrate dev
```

#### (Optional) Seed the Database

```bash
npx prisma db seed
```

#### (Optional) Open Prisma Studio

To view and manage your database:

```bash
npx prisma studio
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
npm start
```

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Database Configuration

```env
# PostgreSQL Database URL
# Format: postgresql://user:password@host:port/database?sslmode=require
# Examples:
# - Neon: postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require
# - Supabase: postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres
# - Local: postgresql://postgres:password@localhost:5432/recipehub
DATABASE_URL=""
```

### Authentication (NextAuth.js)

```env
# Secret key for NextAuth.js (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=""

# Application URL (change for production)
NEXTAUTH_URL="http://localhost:3000"
```

### OAuth Providers

```env
# Google OAuth (for Google Sign-In)
# Get from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### AI Providers

```env
# AI Provider Selection: "openai", "gemini", or "openrouter"
AI_PROVIDER="openai"

# OpenAI API Key
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=""

# Google Gemini API Key
# Get from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=""

# OpenRouter API Key (unified AI access)
# Get from: https://openrouter.ai/keys
OPENROUTER_API_KEY=""
```

### Recipe & Content APIs

```env
# Spoonacular API Key (for recipe data)
# Get from: https://spoonacular.com/food-api
SPOONACULAR_API_KEY=""

# YouTube Data API v3 Key (for video integration)
# Get from: https://console.cloud.google.com/apis/credentials
YOUTUBE_API_KEY=""
```

### Email Service (Resend)

```env
# Resend API Key
# Get from: https://resend.com/api-keys
RESEND_API_KEY=""

# Email sender address
# Format: "RecipeHub <onboarding@resend.dev>" or "noreply@yourdomain.com"
EMAIL_FROM="RecipeHub <onboarding@resend.dev>"
```

### File Uploads (Uploadthing)

```env
# Uploadthing Secret Key
# Get from: https://uploadthing.com/dashboard
UPLOADTHING_SECRET=""

# Uploadthing App ID
UPLOADTHING_APP_ID=""
```

### Live Streaming (100ms)

```env
# 100ms App Access Key
# Get from: https://dashboard.100ms.live/
NEXT_PUBLIC_100MS_APP_ACCESS_KEY=""

# 100ms Template ID
HMS_TEMPLATE_ID=""
```

### Google AdSense (Optional)

```env
# AdSense Publisher ID
NEXT_PUBLIC_ADSENSE_CLIENT_ID="ca-pub-your-id-here"

# AdSense Slot IDs
NEXT_PUBLIC_ADSENSE_HOME_HERO_SLOT="your-hero-slot-id"
NEXT_PUBLIC_ADSENSE_HOME_MID_SLOT="your-mid-slot-id"
```

### Admin Configuration

```env
# Comma-separated list of admin email addresses
# Example: "admin@example.com,admin2@example.com"
ADMIN_EMAILS=""
```

## 📂 Project Structure

```
RecipeWebsite/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   │   ├── admin/            # Admin API endpoints
│   │   │   ├── ai/               # AI-related endpoints
│   │   │   ├── auth/             # Authentication endpoints
│   │   │   ├── recipes/          # Recipe API endpoints
│   │   │   ├── groups/           # Group management APIs
│   │   │   ├── community/        # Community features APIs
│   │   │   └── ...
│   │   ├── admin/                # Admin panel pages
│   │   ├── recipes/              # Recipe pages
│   │   ├── dashboard/            # User dashboard
│   │   ├── groups/               # Group pages
│   │   ├── live/                 # Live streaming pages
│   │   ├── community/            # Community pages
│   │   ├── tips/                  # Kitchen tips pages
│   │   └── ...
│   ├── components/               # React components
│   │   ├── layout/               # Layout components (Header, Footer)
│   │   ├── recipe/               # Recipe-related components
│   │   ├── community/            # Community components
│   │   ├── admin/                # Admin components
│   │   ├── ads/                  # AdSense components
│   │   └── ...
│   ├── lib/                      # Utilities and configurations
│   │   ├── db.ts                 # Database connection
│   │   ├── auth.ts               # Authentication config
│   │   ├── ai-provider.ts        # AI provider abstraction
│   │   ├── spoonacular.ts        # Spoonacular API client
│   │   ├── youtube.ts            # YouTube API client
│   │   └── ...
│   └── types/                    # TypeScript type definitions
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Database migrations
│   └── seed.ts                   # Database seed script
├── public/                       # Static assets
│   └── images/                   # Image assets
├── .env.example                  # Environment variables template
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: User accounts with authentication and profiles
- **Recipe**: Recipe details with ingredients, directions, and nutrition
- **Category**: Recipe categorization
- **Ingredient**: Recipe ingredients with amounts
- **Direction**: Step-by-step cooking instructions
- **Review**: Recipe ratings and reviews
- **SavedRecipe**: User's saved recipes
- **Group**: Cooking groups
- **GroupPost**: Posts within groups
- **GroupMessage**: Group chat messages
- **LiveCookingSession**: Live streaming sessions
- **Post**: Community posts
- **Comment**: Post comments
- **KitchenTip**: Cooking tips
- **CookingHack**: Quick cooking hacks
- **TrendPost**: Food trend articles
- **AIConversation**: AI chat history

View the complete schema in `prisma/schema.prisma`.

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma generate  # Generate Prisma Client
npx prisma db push   # Push schema changes to database
npx prisma migrate dev  # Create and run migrations
npx prisma studio    # Open Prisma Studio GUI
npx prisma db seed   # Seed the database
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- **Netlify**
- **Railway**
- **Render**
- **AWS Amplify**
- **DigitalOcean App Platform**

Make sure to:
- Set all environment variables
- Configure your database connection
- Run `npm run build` to verify the build succeeds

## 🔧 Key Features Explained

### Auto-Content Generation

The application automatically generates content (kitchen tips, cooking hacks, food trends) on startup if the database is empty. This is handled by `src/lib/auto-init.ts`.

### AI Recipe Assistant

The AI assistant uses OpenAI, Gemini, or OpenRouter to provide:
- Step-by-step cooking guidance
- Ingredient substitutions
- Recipe suggestions
- Grocery list generation

### Live Streaming

Groups can host live cooking sessions using 100ms infrastructure. Users can watch, chat, and interact in real-time.

### YouTube Integration

Recipes automatically search for related YouTube cooking videos and embed them in recipe pages.

## 🐛 Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Ensure your database server is running
- Check firewall settings if using a cloud database
- For Neon/Supabase, ensure SSL mode is enabled

### Authentication Issues

- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your deployment URL
- Ensure OAuth credentials are correct

### Build Errors

- Run `npx prisma generate` before building
- Ensure all environment variables are set
- Check for TypeScript errors with `npm run lint`

### API Key Issues

- Verify all API keys are valid and have proper permissions
- Check API rate limits
- Ensure billing is enabled for paid APIs (OpenAI, etc.)

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

This is a private project. For questions or support, contact the development team.

## 📄 License

This project is private and proprietary. All rights reserved.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Recipe data from [Spoonacular](https://spoonacular.com/)

---

**Status**: ✅ Production Ready | **Version**: 0.1.0

For issues or questions, please open an issue in the repository.
