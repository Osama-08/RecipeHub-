"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Bell, Lock, Globe, Moon, Sun, Loader2, Shield, FileText, Users, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const { language, setLanguage, t } = useLanguage();
    const [activeTab, setActiveTab] = useState('profile');
    const [darkMode, setDarkMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);

    // Profile State
    const [name, setName] = useState(session?.user?.name || '');
    const [bio, setBio] = useState('');

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        // Initialize theme from local storage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/user/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, bio }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                await update({ name }); // Update session
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/user/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: 'Password changed successfully!' });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to change password' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: t('settings.tabs.profile'), icon: User },
        { id: 'notifications', label: t('settings.tabs.notifications'), icon: Bell },
        { id: 'privacy', label: t('settings.tabs.privacy'), icon: Lock },
        { id: 'preferences', label: t('settings.tabs.preferences'), icon: Globe },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                            {t('settings.title')}
                        </h1>
                        <p className="text-gray-600">{t('settings.subtitle')}</p>
                    </div>

                    {/* Main Content */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="md:flex">
                            {/* Sidebar Navigation */}
                            <div className="md:w-64 bg-gradient-to-b from-orange-500 to-amber-500 p-6">
                                <nav className="space-y-2">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id
                                                    ? 'bg-white text-orange-600 shadow-lg'
                                                    : 'text-white hover:bg-white/20'
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="font-medium">{tab.label}</span>
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 p-8">
                                {activeTab === 'profile' && (
                                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">{t('settings.profile.title')}</h2>
                                            <p className="text-gray-600 mb-6 dark:text-gray-400">{t('settings.profile.subtitle')}</p>
                                        </div>

                                        {message.text && (
                                            <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {message.text}
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">{t('settings.profile.name')}</label>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                                    placeholder="Your name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">{t('settings.profile.email')}</label>
                                                <input
                                                    type="email"
                                                    value={session?.user?.email || ''}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-500"
                                                    placeholder="your@email.com"
                                                    disabled
                                                />
                                                <p className="text-xs text-gray-500 mt-1">{t('settings.profile.emailNote')}</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">{t('settings.profile.bio')}</label>
                                                <textarea
                                                    rows={4}
                                                    value={bio}
                                                    onChange={(e) => setBio(e.target.value)}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                                    placeholder={t('settings.profile.bioPlaceholder')}
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSaving}
                                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                                            >
                                                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                                {t('settings.profile.saveChanges')}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {activeTab === 'notifications' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Notification Settings</h2>
                                            <p className="text-gray-600 mb-6">Choose how you want to be notified</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">Email Notifications</h3>
                                                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                                                </div>
                                                <button
                                                    onClick={() => setEmailNotifications(!emailNotifications)}
                                                    className={`relative w-14 h-8 rounded-full transition-colors ${emailNotifications ? 'bg-green-500' : 'bg-gray-300'
                                                        }`}
                                                >
                                                    <div
                                                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${emailNotifications ? 'translate-x-6' : ''
                                                            }`}
                                                    />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">Push Notifications</h3>
                                                    <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                                                </div>
                                                <button
                                                    onClick={() => setPushNotifications(!pushNotifications)}
                                                    className={`relative w-14 h-8 rounded-full transition-colors ${pushNotifications ? 'bg-green-500' : 'bg-gray-300'
                                                        }`}
                                                >
                                                    <div
                                                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${pushNotifications ? 'translate-x-6' : ''
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'privacy' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800 mb-2 dark:text-white">Privacy & Security</h2>
                                            <p className="text-gray-600 mb-6 dark:text-gray-400">Manage your privacy and security settings</p>
                                        </div>

                                        {message.text && (
                                            <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {message.text}
                                            </div>
                                        )}

                                        {/* Card Grid Layout */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Privacy Policy Card */}
                                            <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-900 overflow-hidden">
                                                <div className="p-6">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-xl">
                                                            <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Privacy Policy</h3>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                                        Learn how we collect, use, and protect your personal information
                                                    </p>
                                                    <Link
                                                        href="/privacy-policy"
                                                        className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-semibold text-sm group-hover:gap-3 transition-all"
                                                    >
                                                        Read Privacy Policy
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Terms and Conditions Card */}
                                            <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-900 overflow-hidden">
                                                <div className="p-6">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                                                            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Terms & Conditions</h3>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                                        Review the terms of service for using RecipeHub
                                                    </p>
                                                    <Link
                                                        href="/terms"
                                                        className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-semibold text-sm group-hover:gap-3 transition-all"
                                                    >
                                                        Read Terms & Conditions
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Community Guidelines Card */}
                                            <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-900 overflow-hidden">
                                                <div className="p-6">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
                                                            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Community Guidelines</h3>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                                                        Learn about our community standards
                                                    </p>
                                                    <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5 mb-4">
                                                        <li className="flex items-start gap-2">
                                                            <span className="text-purple-500 mt-0.5">•</span>
                                                            <span>Be respectful and kind to all members</span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <span className="text-purple-500 mt-0.5">•</span>
                                                            <span>Share authentic recipes and experiences</span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <span className="text-purple-500 mt-0.5">•</span>
                                                            <span>No spam or inappropriate content</span>
                                                        </li>
                                                    </ul>
                                                    <Link
                                                        href="/community-guidelines"
                                                        className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-semibold text-sm group-hover:gap-3 transition-all"
                                                    >
                                                        View Full Guidelines
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Download Your Data Card */}
                                            <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-900 overflow-hidden">
                                                <div className="p-6">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl">
                                                            <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Download Your Data</h3>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                                        Export a copy of all your personal data, recipes, and activity
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => alert('Data export feature coming soon!')}
                                                        className="w-full px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
                                                    >
                                                        Download Data
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Delete Account Card - Full Width */}
                                            <div className="md:col-span-2 group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-red-100 dark:border-red-900/50 hover:border-red-300 dark:hover:border-red-700 overflow-hidden">
                                                <div className="p-6">
                                                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                                                        <div className="flex items-start gap-4 flex-1">
                                                            <div className="p-3 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 rounded-xl">
                                                                <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">Delete Account</h3>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                                    Permanently delete your account and all associated data. This action cannot be undone.
                                                                </p>
                                                                <div className="mt-3 flex flex-wrap gap-2">
                                                                    <span className="inline-flex items-center px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs font-medium rounded-full">
                                                                        ⚠️ Irreversible
                                                                    </span>
                                                                    <span className="inline-flex items-center px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs font-medium rounded-full">
                                                                        All data will be lost
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="md:w-48">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                                                                        alert('Account deletion feature coming soon!');
                                                                    }
                                                                }}
                                                                className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
                                                            >
                                                                Delete Account
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'preferences' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Preferences</h2>
                                            <p className="text-gray-600 mb-6">Customize your experience</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">Dark Mode</h3>
                                                    <p className="text-sm text-gray-600">Switch between light and dark theme</p>
                                                </div>
                                                <button
                                                    onClick={toggleDarkMode}
                                                    type="button"
                                                    className={`relative w-14 h-8 rounded-full transition-colors ${darkMode ? 'bg-gray-800' : 'bg-gray-300'
                                                        }`}
                                                >
                                                    <div
                                                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform flex items-center justify-center ${darkMode ? 'translate-x-6' : ''
                                                            }`}
                                                    >
                                                        {darkMode ? (
                                                            <Moon className="w-4 h-4 text-gray-800" />
                                                        ) : (
                                                            <Sun className="w-4 h-4 text-yellow-500" />
                                                        )}
                                                    </div>
                                                </button>
                                            </div>

                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <h3 className="font-semibold text-gray-800 mb-2">{t('settings.preferences.language')}</h3>
                                                <select
                                                    value={language}
                                                    onChange={(e) => setLanguage(e.target.value as 'en' | 'es' | 'fr' | 'de')}
                                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                                                >
                                                    <option value="en">{t('settings.preferences.languages.en')}</option>
                                                    <option value="es">{t('settings.preferences.languages.es')}</option>
                                                    <option value="fr">{t('settings.preferences.languages.fr')}</option>
                                                    <option value="de">{t('settings.preferences.languages.de')}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
