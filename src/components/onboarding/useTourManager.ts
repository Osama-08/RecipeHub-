import { useEffect, useRef, useCallback } from 'react';

export type PageTourKey =
    | 'homepage'
    | 'recipes-list'
    | 'recipe-detail'
    | 'community'
    | 'live'
    | 'kitchen-tips'
    | 'groups'
    | 'settings';

interface UseTourManagerOptions {
    pageKey: PageTourKey;
    enabled?: boolean;
    onComplete?: () => void;
    onSkip?: () => void;
}

export function useTourManager({
    pageKey,
    enabled = true,
    onComplete,
    onSkip
}: UseTourManagerOptions) {
    const tourShownRef = useRef(false);

    // Check if user has seen this tour before
    const hasSeenTour = useCallback(() => {
        if (typeof window === 'undefined') return true;
        const seenTours = localStorage.getItem('seenTours');
        if (!seenTours) return false;
        const tours = JSON.parse(seenTours);
        return tours.includes(pageKey);
    }, [pageKey]);

    // Mark tour as seen
    const markTourAsSeen = useCallback(() => {
        if (typeof window === 'undefined') return;
        const seenTours = localStorage.getItem('seenTours');
        const tours = seenTours ? JSON.parse(seenTours) : [];
        if (!tours.includes(pageKey)) {
            tours.push(pageKey);
            localStorage.setItem('seenTours', JSON.stringify(tours));
        }
    }, [pageKey]);

    // Reset a specific tour
    const resetTour = useCallback(() => {
        if (typeof window === 'undefined') return;
        const seenTours = localStorage.getItem('seenTours');
        if (!seenTours) return;
        const tours = JSON.parse(seenTours);
        const filtered = tours.filter((t: string) => t !== pageKey);
        localStorage.setItem('seenTours', JSON.stringify(filtered));
    }, [pageKey]);

    // Reset all tours
    const resetAllTours = useCallback(() => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('seenTours');
    }, []);

    // Start the tour manually
    const startTour = useCallback(() => {
        if (typeof window !== 'undefined') {
            (window as any).startTour?.();
        }
    }, []);

    // Determine if tour should automatically start
    const shouldStartTour = enabled && !hasSeenTour() && !tourShownRef.current;

    useEffect(() => {
        if (shouldStartTour) {
            tourShownRef.current = true;
        }
    }, [shouldStartTour]);

    return {
        shouldStartTour,
        hasSeenTour: hasSeenTour(),
        markTourAsSeen,
        resetTour,
        resetAllTours,
        startTour,
    };
}
