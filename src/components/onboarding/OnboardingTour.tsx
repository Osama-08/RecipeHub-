"use client";

import { useEffect, useRef } from 'react';
import { homepageTutorialSteps } from './tourSteps';

interface OnboardingTourProps {
    shouldStart: boolean;
    onComplete: () => void;
    onSkip: () => void;
}

export default function OnboardingTour({ shouldStart, onComplete, onSkip }: OnboardingTourProps) {
    const introRef = useRef<any>(null);
    const hasStartedRef = useRef(false);

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;

        // Only initialize once and only if shouldStart is true
        if (!shouldStart || hasStartedRef.current) return;

        // Dynamically import intro.js only on the client
        const initTour = async () => {
            try {
                const introJs = (await import('intro.js')).default;
                // Import CSS (side effect only)
                import('intro.js/introjs.css');
                // Load custom styles
                const customStyles = document.createElement('link');
                customStyles.rel = 'stylesheet';
                customStyles.href = '/intro-custom.css';
                if (!document.querySelector('link[href="/intro-custom.css"]')) {
                    document.head.appendChild(customStyles);
                }

                // Wait for DOM to be fully loaded
                setTimeout(() => {
                    try {
                        const intro = introJs();
                        introRef.current = intro;
                        hasStartedRef.current = true;

                        intro.setOptions({
                            steps: homepageTutorialSteps,
                            showProgress: true,
                            showBullets: true,
                            exitOnOverlayClick: false,
                            exitOnEsc: true,
                            nextLabel: 'Next →',
                            prevLabel: '← Back',
                            doneLabel: 'Done ✓',
                            skipLabel: 'Skip Tour',
                            hidePrev: false,
                            hideNext: false,
                            scrollToElement: true,
                            scrollPadding: 30,
                            showStepNumbers: false,
                            disableInteraction: true,
                            overlayOpacity: 0.8,
                        });

                        intro.oncomplete(() => {
                            onComplete();
                        });

                        intro.onexit(() => {
                            onSkip();
                        });

                        intro.start();
                    } catch (error) {
                        console.error('Error starting tutorial:', error);
                        onSkip();
                    }
                }, 1000); // Wait 1s for page to fully render
            } catch (error) {
                console.error('Error loading intro.js:', error);
                onSkip();
            }
        };

        initTour();

        return () => {
            if (introRef.current) {
                introRef.current.exit(true);
            }
        };
    }, [shouldStart, onComplete, onSkip]);

    // Expose method to manually start tour
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).startTour = async () => {
                if (introRef.current) {
                    hasStartedRef.current = false;
                    introRef.current.exit(true);
                }

                const introJs = (await import('intro.js')).default;

                setTimeout(() => {
                    const intro = introJs();
                    introRef.current = intro;

                    intro.setOptions({
                        steps: homepageTutorialSteps,
                        showProgress: true,
                        showBullets: true,
                        exitOnOverlayClick: false,
                        exitOnEsc: true,
                        nextLabel: 'Next →',
                        prevLabel: '← Back',
                        doneLabel: 'Done ✓',
                        skipLabel: 'Skip Tour',
                    });

                    intro.start();
                }, 100);
            };
        }
    }, []);

    return null; // This component doesn't render anything
}
