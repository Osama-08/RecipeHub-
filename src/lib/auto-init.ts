// Auto-initialization utility
// Call this on app startup to ensure content exists

import { prisma } from "./db";

let initializationPromise: Promise<void> | null = null;

export async function autoInitializeContent(): Promise<void> {
    // Prevent multiple simultaneous initializations
    if (initializationPromise) {
        return initializationPromise;
    }

    initializationPromise = (async () => {
        try {
            // Check if we have any content
            const [tipsCount, hacksCount, trendsCount] = await Promise.all([
                prisma.kitchenTip.count(),
                prisma.cookingHack.count(),
                prisma.trendPost.count(),
            ]);

            const totalContent = tipsCount + hacksCount + trendsCount;

            if (totalContent > 0) {
                console.log(`✅ Content exists: ${tipsCount} tips, ${hacksCount} hacks, ${trendsCount} trends`);
                return;
            }

            console.log("🚀 No content found - triggering auto-initialization...");
            console.log("📞 Calling /api/admin/init-content...");

            // Call the init endpoint
            const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
            const response = await fetch(`${baseUrl}/api/admin/init-content`);

            if (response.ok) {
                const data = await response.json();
                console.log("✅ Auto-initialization complete:", data);
            } else {
                console.error("❌ Auto-initialization failed:", await response.text());
            }
        } catch (error) {
            console.error("❌ Error during auto-initialization:", error);
        } finally {
            // Reset promise after completion
            initializationPromise = null;
        }
    })();

    return initializationPromise;
}

// Background scheduler for periodic content generation (local development)
export function startContentScheduler(intervalMinutes: number = 60) {
    console.log(`⏰ Starting content scheduler (every ${intervalMinutes} minutes)...`);

    // Initial generation after 30 seconds
    setTimeout(async () => {
        try {
            const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
            const response = await fetch(`${baseUrl}/api/cron/daily-content`);

            if (response.ok) {
                console.log("✅ Initial scheduled content generated");
            }
        } catch (error) {
            console.error("❌ Scheduled generation error:", error);
        }
    }, 30000); // 30 seconds

    // Periodic generation
    const interval = setInterval(async () => {
        try {
            const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

            // Generate daily content
            const dailyResponse = await fetch(`${baseUrl}/api/cron/daily-content`);
            if (dailyResponse.ok) {
                console.log("✅ Scheduled daily content generated");
            }

            // Rotate featured content
            const rotateResponse = await fetch(`${baseUrl}/api/cron/rotate-featured`);
            if (rotateResponse.ok) {
                console.log("✅ Featured content rotated");
            }
        } catch (error) {
            console.error("❌ Scheduled task error:", error);
        }
    }, intervalMinutes * 60 * 1000);

    // Return cleanup function
    return () => {
        console.log("⏹️  Stopping content scheduler...");
        clearInterval(interval);
    };
}
