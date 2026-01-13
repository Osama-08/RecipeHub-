// Startup initialization script
// This runs when the dev server starts

import { autoInitializeContent, startContentScheduler } from "@/lib/auto-init";

export async function initializeApp() {
    console.log("🚀 CaribbeanRecipe AI - Starting initialization...");

    try {
        // Auto-initialize content if database is empty
        await autoInitializeContent();

        // Start background scheduler (generates new content every hour)
        // Uncomment the line below to enable automatic hourly generation
        // startContentScheduler(60); // Every 60 minutes

        console.log("✅ CaribbeanRecipe AI initialization complete!");
    } catch (error) {
        console.error("❌ Initialization error:", error);
    }
}

// Auto-run on import (will run once on server start)
if (typeof window === "undefined") {
    // Server-side only
    initializeApp();
}
