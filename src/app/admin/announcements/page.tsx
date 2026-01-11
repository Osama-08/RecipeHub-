"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Megaphone, Send, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function AnnouncementsPage() {
    const { data: session, status } = useSession();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [checkingAdmin, setCheckingAdmin] = useState(true);

    // Check if user is admin by trying to make a test request
    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            // User is logged in, show the form
            // The API will check if they're admin when they submit
            setIsAdmin(true);
            setCheckingAdmin(false);
        } else if (status === 'unauthenticated') {
            setIsAdmin(false);
            setCheckingAdmin(false);
        }
    }, [status, session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus('loading');
        setErrorMsg('');

        try {
            const res = await fetch('/api/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, message }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error ?? 'Failed to create announcement');
            }

            setSubmitStatus('success');
            setTitle('');
            setMessage('');

            // Reset success message after 3 seconds
            setTimeout(() => setSubmitStatus('idle'), 3000);
        } catch (err: any) {
            setErrorMsg(err.message);
            setSubmitStatus('error');
        }
    };

    if (checkingAdmin || status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
                    <p className="text-xl text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">Please log in to access this page</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mb-4">
                            <Megaphone className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                            Create Announcement
                        </h1>
                        <p className="text-gray-600">Send a notification to all users</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Announcement Title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    placeholder="e.g., System Maintenance, New Feature Launch"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-lg"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    rows={6}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    placeholder="Write your announcement message here..."
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    This will be sent as a notification to all users
                                </p>
                            </div>

                            {/* Status Messages */}
                            {submitStatus === 'success' && (
                                <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <p className="text-green-700 font-medium">Announcement created successfully!</p>
                                </div>
                            )}

                            {submitStatus === 'error' && (
                                <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                                    <XCircle className="w-5 h-5 text-red-600" />
                                    <p className="text-red-700 font-medium">Error: {errorMsg}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submitStatus === 'loading'}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitStatus === 'loading' ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating Announcement...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Send Announcement
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Info Box */}
                        <div className="mt-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                            <h3 className="font-semibold text-orange-900 mb-2">📢 How it works</h3>
                            <ul className="text-sm text-orange-800 space-y-1">
                                <li>• Your announcement will be sent to all registered users</li>
                                <li>• Users will see it in their notifications bell</li>
                                <li>• Announcements are also displayed on the homepage</li>
                                <li>• Only admins can create announcements (checked by the API)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
