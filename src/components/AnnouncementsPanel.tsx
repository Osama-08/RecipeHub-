import React from 'react';
import useSWR from 'swr';

interface Announcement {
    id: string;
    title: string;
    message: string;
    createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AnnouncementsPanel() {
    const { data, error } = useSWR<Announcement[]>('/api/announcements', fetcher, {
        refreshInterval: 30000,
    });

    if (error) return <div className="text-red-500">Failed to load announcements.</div>;
    if (!data) return <div className="text-gray-500">Loading announcements…</div>;

    return (
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Announcements</h2>
            {data.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No announcements at the moment.</p>
            ) : (
                <ul className="space-y-3">
                    {data.map((a: Announcement) => (
                        <li key={a.id} className="border-b pb-2 last:border-b-0">
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">{a.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{a.message}</p>
                            <time className="text-xs text-gray-500 dark:text-gray-600" dateTime={a.createdAt}>
                                {new Date(a.createdAt).toLocaleString()}
                            </time>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
