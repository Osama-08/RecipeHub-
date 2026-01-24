'use client';

import { Facebook, Instagram, Youtube } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';

interface SocialMediaButtonsProps {
    facebookUrl?: string | null;
    instagramUrl?: string | null;
    tiktokUrl?: string | null;
    youtubeUrl?: string | null;
}

export default function SocialMediaButtons({
    facebookUrl,
    instagramUrl,
    tiktokUrl,
    youtubeUrl,
}: SocialMediaButtonsProps) {
    const buttons = [
        {
            url: facebookUrl,
            icon: Facebook,
            label: 'Facebook',
            color: 'bg-blue-600 hover:bg-blue-700',
        },
        {
            url: instagramUrl,
            icon: Instagram,
            label: 'Instagram',
            color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
        },
        {
            url: tiktokUrl,
            icon: FaTiktok,
            label: 'TikTok',
            color: 'bg-gray-900 hover:bg-black',
        },
        {
            url: youtubeUrl,
            icon: Youtube,
            label: 'YouTube',
            color: 'bg-red-600 hover:bg-red-700',
        },
    ];

    const activeButtons = buttons.filter((btn) => btn.url);

    if (activeButtons.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-3">
            {activeButtons.map((btn) => {
                const Icon = btn.icon;
                return (
                    <a
                        key={btn.label}
                        href={btn.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${btn.color} text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all transform hover:scale-105`}
                    >
                        <Icon className="w-5 h-5" />
                        <span>{btn.label}</span>
                    </a>
                );
            })}
        </div>
    );
}
