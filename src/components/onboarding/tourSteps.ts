// Enhanced tour definitions for all pages
export interface TutorialStep {
    element?: string;
    intro: string;
    title?: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export const homepageTutorialSteps: TutorialStep[] = [
    {
        intro: `<div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 16px;">🌴🍽️</div>
            <h2 style="margin: 0 0 12px 0; font-size: 28px; font-weight: 700; color: #ea580c;">Welcome to CaribbeanRecipe!</h2>
            <p style="margin: 0; font-size: 17px; color: #64748b; line-height: 1.6;">Let's take a quick tour to help you discover all the amazing features and get cooking in no time!</p>
        </div>`,
        title: 'Welcome',
    },
    {
        element: '[data-tour="navigation"]',
        intro: `<div style="padding: 4px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 12px;">NAVIGATION</div>
            <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #1e293b;">🧭 Explore Our Recipes</h3>
            <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">Browse through different categories like <strong>Dinners</strong>, <strong>Meals</strong>, <strong>Cuisines</strong>, and <strong>Ingredients</strong> to find the perfect recipe for any occasion.</p>
        </div>`,
        title: 'Navigation',
        position: 'bottom',
    },
    {
        element: '[data-tour="live-sessions"]',
        intro: `<div style="padding: 4px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 12px;">LIVE</div>
            <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #1e293b;">🎥 Live Cooking Sessions</h3>
            <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">Join live cooking sessions to learn from expert chefs in real-time! Watch, interact, and cook along with the community.</p>
        </div>`,
        title: 'Live Sessions',
        position: 'bottom',
    },
    {
        element: '[data-tour="community"]',
        intro: `<div style="padding: 4px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 12px;">KITCHENS</div>
            <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #1e293b;">👥 Join Our Community</h3>
            <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">Connect with other food lovers, share your creations, join groups, and discover new recipes from passionate home cooks and chefs!</p>
        </div>`,
        title: 'Community',
        position: 'bottom',
    },
    {
        element: '[data-tour="saved-recipes"]',
        intro: `<div style="padding: 4px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 12px;">FAVORITES</div>
            <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #1e293b;">❤️ Save Your Favorites</h3>
            <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">Click the heart icon on any recipe to save it to your collection. Access all your saved recipes anytime from your profile!</p>
        </div>`,
        title: 'Saved Recipes',
        position: 'bottom',
    },
    {
        element: '[data-tour="user-menu"]',
        intro: `<div style="padding: 4px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 12px;">PROFILE</div>
            <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #1e293b;">👤 Your Profile Hub</h3>
            <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">Access your dashboard, settings, notifications, and saved recipes. You can also restart any tour from here whenever you need a refresher!</p>
        </div>`,
        title: 'User Menu',
        position: 'bottom',
    },
    {
        intro: `<div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
            <h2 style="margin: 0 0 12px 0; font-size: 26px; font-weight: 700; color: #ea580c;">You're All Set!</h2>
            <p style="margin: 0 0 16px 0; font-size: 16px; color: #64748b; line-height: 1.6;">Start exploring delicious recipes, join live sessions, and connect with fellow food enthusiasts!</p>
            <p style="margin: 0; font-size: 14px; color: #94a3b8;">💡 Tip: Each section has its own detailed tour when you visit it for the first time.</p>
        </div>`,
        title: 'Ready to Cook!',
    },
];

// Recipe List Page Tour
export const recipesListTutorialSteps: TutorialStep[] = [
    {
        intro: `<div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 16px;">📖🍲</div>
            <h2 style="margin: 0 0 12px 0; font-size: 26px; font-weight: 700; color: #ea580c;">Recipe Explorer</h2>
            <p style="margin: 0; font-size: 16px; color: #64748b; line-height: 1.6;">Discover thousands of delicious recipes. Let me show you how to find your perfect dish!</p>
        </div>`,
    },
    {
        element: '[data-tour="search-bar"]',
        intro: `<div style="padding: 4px;">
            <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #1e293b;">🔍 Search Recipes</h3>
            <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">Type in any ingredient, dish name, or cuisine to quickly find recipes. Try "chicken curry" or "chocolate cake"!</p>
        </div>`,
        position: 'bottom',
    },
    {
        element: '[data-tour="filters"]',
        intro: `<div style="padding: 4px;">
            <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #1e293b;">🎯 Filter & Sort</h3>
            <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">Use filters to narrow down by cuisine, diet, cook time, or difficulty. Sort by popularity, rating, or newest first!</p>
        </div>`,
        position: 'left',
    },
    {
        element: '[data-tour="recipe-card"]',
        intro: `<div style="padding: 4px;">
            <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #1e293b;">🃏 Interactive Recipe Cards</h3>
            <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">Hover over any card to see quick details, or click to view the full recipe with step-by-step instructions!</p>
        </div>`,
        position: 'top',
    },
];

// Recipe Detail Page Tour
export const recipeDetailTutorialSteps: TutorialStep[] = [
    {
        intro: `<div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 16px;">👨‍🍳✨</div>
            <h2 style="margin: 0 0 12px 0; font-size: 26px; font-weight: 700; color: #ea580c;">Ready to Cook?</h2>
            <p style="margin: 0; font-size: 16px; color: #64748b; line-height: 1.6;">Let me show you all the tools to make this recipe perfect!</p>
        </div>`,
    },
    {
        element: '[data-tour="ingredients"]',
        intro: `<div style="padding: 4px;">
            <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #1e293b;">📝 Ingredients List</h3>
            <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">Check off ingredients as you add them. Adjust servings using the controls to automatically scale quantities!</p>
        </div>`,
        position: 'right',
    },
    {
        element: '[data-tour="directions"]',
        intro: `<div style="padding: 4px;">
            <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #1e293b;">📋 Step-by-Step Directions</h3>
            <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">Follow along with detailed instructions. Each step includes helpful images and tips!</p>
        </div>`,
        position: 'left',
    },
    {
        element: '[data-tour="ai-chat"]',
        intro: `<div style="padding: 4px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 12px;">AI POWERED</div>
            <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #1e293b;">🤖 AI Cooking Assistant</h3>
            <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">Ask questions about the recipe, get substitution suggestions, or request cooking tips from our AI assistant!</p>
        </div>`,
        position: 'top',
    },
    {
        element: '[data-tour="save-recipe"]',
        intro: `<div style="padding: 4px;">
            <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #1e293b;">❤️ Save & Share</h3>
            <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">Save this recipe to your collection or share it with friends on social media!</p>
        </div>`,
        position: 'bottom',
    },
];

// Community Page Tour
export const communityTutorialSteps: TutorialStep[] = [
    {
        intro: `<div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 16px;">🌍👨‍🍳</div>
            <h2 style="margin: 0 0 12px 0; font-size: 26px; font-weight: 700; color: #8b5cf6;">Welcome to the Community!</h2>
            <p style="margin: 0; font-size: 16px; color: #64748b; line-height: 1.6;">Connect, share, and learn from food lovers around the world!</p>
        </div>`,
    },
    {
        element: '[data-tour="create-post"]',
        intro: `<div style="padding: 4px;">
            <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #1e293b;">✍️ Share Your Creations</h3>
            <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">Post photos of your cooking, share tips, or ask questions. Engage with the community!</p>
        </div>`,
        position: 'bottom',
    },
    {
        element: '[data-tour="community-feed"]',
        intro: `<div style="padding: 4px;">
            <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #1e293b;">📰 Community Feed</h3>
            <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">See what others are cooking, like and comment on posts, and get inspired by creative recipes!</p>
        </div>`,
        position: 'top',
    },
    {
        element: '[data-tour="groups"]',
        intro: `<div style="padding: 4px;">
            <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #1e293b;">👥 Join Groups</h3>
            <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">Join cooking groups based on your interests - vegan, baking, Caribbean cuisine, and more!</p>
        </div>`,
        position: 'right',
    },
];

// Live Streaming Page Tour
export const liveTutorialSteps: TutorialStep[] = [
    {
        intro: `<div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 16px;">📹🔴</div>
            <h2 style="margin: 0 0 12px 0; font-size: 26px; font-weight: 700; color: #dc2626;">Live Cooking Sessions</h2>
            <p style="margin: 0; font-size: 16px; color: #64748b; line-height: 1.6;">Watch and learn from live cooking demonstrations in real-time!</p>
        </div>`,
    },
    {
        element: '[data-tour="active-streams"]',
        intro: `<div style="padding: 4px;">
            <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #1e293b;">🔴 Live Now</h3>
            <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">Click on any live session to join the stream and watch chefs cook in real-time!</p>
        </div>`,
        position: 'bottom',
    },
    {
        element: '[data-tour="go-live-button"]',
        intro: `<div style="padding: 4px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 12px;">HOST</div>
            <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #1e293b;">🎬 Start Your Own Stream</h3>
            <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">Click here to start your own live cooking session and share your culinary skills with the community!</p>
        </div>`,
        position: 'bottom',
    },
    {
        element: '[data-tour="upcoming-sessions"]',
        intro: `<div style="padding: 4px;">
            <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #1e293b;">📅 Upcoming Sessions</h3>
            <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">Browse scheduled sessions and set reminders so you never miss your favorite chefs!</p>
        </div>`,
        position: 'top',
    },
];

// Kitchen Tips Page Tour
export const kitchenTipsTutorialSteps: TutorialStep[] = [
    {
        intro: `<div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 16px;">💡🔪</div>
            <h2 style="margin: 0 0 12px 0; font-size: 26px; font-weight: 700; color: #f59e0b;">Kitchen Tips & Tricks</h2>
            <p style="margin: 0; font-size: 16px; color: #64748b; line-height: 1.6;">Level up your cooking skills with expert tips and hacks!</p>
        </div>`,
    },
    {
        element: '[data-tour="tips-categories"]',
        intro: `<div style="padding: 4px;">
            <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #1e293b;">🏷️ Browse by Category</h3>
            <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">Explore tips organized by category: knife skills, food safety, storage, meal prep, and more!</p>
        </div>`,
        position: 'bottom',
    },
    {
        element: '[data-tour="daily-tip"]',
        intro: `<div style="padding: 4px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 12px;">FEATURED</div>
            <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #1e293b;">⭐ Daily Tip</h3>
            <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">Check back daily for new featured tips to improve your cooking game!</p>
        </div>`,
        position: 'bottom',
    },
];
