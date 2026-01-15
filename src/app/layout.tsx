import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Footer from "@/components/layout/Footer";
import Script from "next/script";

// Import startup initialization
import "@/lib/startup";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "CaribbeanRecipe - Premium Cooking Platform",
    description: "Discover amazing Caribbean and international recipes with AI-powered cooking assistance, automated content generation, live streams, and community videos.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

    return (
        <html lang="en">
            <body className={inter.className}>
                <LanguageProvider>
                    <AuthProvider>
                        <div className="min-h-screen flex flex-col">
                            <main className="flex-grow">
                                {children}
                            </main>
                            <Footer />
                        </div>
                    </AuthProvider>
                </LanguageProvider>

                {/* Google AdSense Script */}
                {adsenseClientId && (
                    <Script
                        async
                        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
                        crossOrigin="anonymous"
                        strategy="afterInteractive"
                    />
                )}
            </body>
        </html>
    );
}
