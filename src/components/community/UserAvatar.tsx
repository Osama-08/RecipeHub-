'use client';

import { User } from '@prisma/client';
import Image from 'next/image';

interface UserAvatarProps {
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
    size?: 'sm' | 'md' | 'lg';
}

export default function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-16 h-16 text-lg',
    };

    const getInitials = (name: string | null) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold`}>
            {user.image ? (
                <Image
                    src={user.image}
                    alt={user.name || 'User'}
                    width={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
                    height={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
                    className="object-cover w-full h-full"
                />
            ) : (
                <span>{getInitials(user.name)}</span>
            )}
        </div>
    );
}
