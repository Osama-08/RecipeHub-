'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import Link from 'next/link';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    linkUrl: string | null;
    isRead: boolean;
    createdAt: string;
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Poll for new notifications every 10 seconds
        const interval = setInterval(fetchNotifications, 10000);

        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (notificationIds: string[]) => {
        try {
            const res = await fetch('/api/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationIds }),
            });

            if (res.ok) {
                await fetchNotifications();
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAllAsRead: true }),
            });

            if (res.ok) {
                await fetchNotifications();
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            const res = await fetch('/api/notifications', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationIds: [id] }),
            });

            if (res.ok) {
                setNotifications(notifications.filter((n) => n.id !== id));
                if (!notifications.find((n) => n.id === id)?.isRead) {
                    setUnreadCount(Math.max(0, unreadCount - 1));
                }
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                title="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Notification Panel */}
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-40 max-h-96 overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-3 flex items-center justify-between">
                            <h3 className="font-bold text-gray-800">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    disabled={isLoading}
                                    className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 disabled:opacity-50"
                                >
                                    <Check className="w-4 h-4" />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-3 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-2">
                                            <div className="flex-1 min-w-0">
                                                {notification.linkUrl ? (
                                                    <Link
                                                        href={notification.linkUrl}
                                                        onClick={() => {
                                                            if (!notification.isRead) {
                                                                markAsRead([notification.id]);
                                                            }
                                                            setIsOpen(false);
                                                        }}
                                                    >
                                                        <h4 className="font-semibold text-sm text-gray-800 hover:text-purple-600">
                                                            {notification.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {formatTime(notification.createdAt)}
                                                        </p>
                                                    </Link>
                                                ) : (
                                                    <>
                                                        <h4 className="font-semibold text-sm text-gray-800">
                                                            {notification.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {formatTime(notification.createdAt)}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => deleteNotification(notification.id)}
                                                className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
