"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, SkipForward, SkipBack, Repeat, Volume2, VolumeX, Loader2 } from "lucide-react";

interface Direction {
    stepNumber: number;
    instruction: string;
}

interface VoiceGuideProps {
    directions: Direction[];
}

export default function VoiceGuide({ directions }: VoiceGuideProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [error, setError] = useState("");

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioCache = useRef<Map<number, string>>(new Map());

    // Play audio for current step
    const playStep = useCallback(async (stepIndex: number) => {
        setIsLoading(true);
        setError("");

        try {
            const direction = directions[stepIndex];

            // Check cache first
            let audioData = audioCache.current.get(stepIndex);

            if (!audioData) {
                // Generate new audio
                const response = await fetch("/api/tts/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        text: direction.instruction,
                        stepNumber: direction.stepNumber,
                    }),
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || "Failed to generate speech");
                }

                const data = await response.json();
                const generatedAudio = data.audio;

                if (!generatedAudio) {
                    throw new Error("No audio data received");
                }

                audioData = generatedAudio;

                // Cache the audio
                audioCache.current.set(stepIndex, generatedAudio);
            }

            // Play audio
            if (audioRef.current && audioData) {
                audioRef.current.src = audioData;
                audioRef.current.play();
                setIsPlaying(true);
            }
        } catch (err: any) {
            console.error("Voice guide error:", err);
            setError(err.message || "Failed to play audio");
            setIsPlaying(false);
        } finally {
            setIsLoading(false);
        }
    }, [directions]);

    const handlePlayPause = useCallback(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            if (audioRef.current.src) {
                audioRef.current.play();
                setIsPlaying(true);
            } else {
                playStep(currentStep);
            }
        }
    }, [isPlaying, currentStep, playStep]);

    const handleNext = useCallback(() => {
        if (currentStep < directions.length - 1) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            playStep(nextStep);
        }
    }, [currentStep, directions.length, playStep]);

    const handlePrevious = useCallback(() => {
        if (currentStep > 0) {
            const prevStep = currentStep - 1;
            setCurrentStep(prevStep);
            playStep(prevStep);
        }
    }, [currentStep, playStep]);

    const handleRepeat = useCallback(() => {
        playStep(currentStep);
    }, [currentStep, playStep]);

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    // Handle audio end - auto-play next step
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleEnded = () => {
            setIsPlaying(false);
            // Auto-advance to next step after a short delay
            if (currentStep < directions.length - 1) {
                setTimeout(() => {
                    const nextStep = currentStep + 1;
                    setCurrentStep(nextStep);
                    playStep(nextStep);
                }, 1000);
            }
        };

        audio.addEventListener("ended", handleEnded);
        return () => audio.removeEventListener("ended", handleEnded);
    }, [currentStep, directions.length, playStep]);

    // Keyboard shortcuts
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault();
                handlePlayPause();
            } else if (e.code === "ArrowRight") {
                e.preventDefault();
                handleNext();
            } else if (e.code === "ArrowLeft") {
                e.preventDefault();
                handlePrevious();
            } else if (e.code === "KeyR") {
                e.preventDefault();
                handleRepeat();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [isOpen, handlePlayPause, handleNext, handlePrevious, handleRepeat]);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 font-semibold"
            >
                <Volume2 className="w-6 h-6" />
                Start Voice-Guided Cooking
            </button>
        );
    }

    return (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
            <audio ref={audioRef} className="hidden" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <Volume2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Voice Guide</h3>
                        <p className="text-sm text-gray-600">
                            Step {currentStep + 1} of {directions.length}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-600 hover:text-gray-900"
                >
                    Close
                </button>
            </div>

            {/* Current Step Display */}
            <div className="bg-white rounded-lg p-4 mb-4 border border-purple-200">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {directions[currentStep].stepNumber}
                    </div>
                    <p className="text-gray-900 leading-relaxed">
                        {directions[currentStep].instruction}
                    </p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 mb-4">
                <button
                    onClick={handlePrevious}
                    disabled={currentStep === 0 || isLoading}
                    className="p-3 bg-white border border-purple-200 rounded-full hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Previous (←)"
                >
                    <SkipBack className="w-5 h-5 text-purple-600" />
                </button>

                <button
                    onClick={handleRepeat}
                    disabled={isLoading}
                    className="p-3 bg-white border border-purple-200 rounded-full hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Repeat (R)"
                >
                    <Repeat className="w-5 h-5 text-purple-600" />
                </button>

                <button
                    onClick={handlePlayPause}
                    disabled={isLoading}
                    className="p-4 bg-purple-500 text-white rounded-full hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                    title="Play/Pause (Space)"
                >
                    {isLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : isPlaying ? (
                        <Pause className="w-6 h-6" fill="white" />
                    ) : (
                        <Play className="w-6 h-6 ml-1" fill="white" />
                    )}
                </button>

                <button
                    onClick={handleNext}
                    disabled={currentStep === directions.length - 1 || isLoading}
                    className="p-3 bg-white border border-purple-200 rounded-full hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Next (→)"
                >
                    <SkipForward className="w-5 h-5 text-purple-600" />
                </button>

                <button
                    onClick={toggleMute}
                    className="p-3 bg-white border border-purple-200 rounded-full hover:bg-purple-50 transition-colors"
                    title="Mute/Unmute"
                >
                    {isMuted ? (
                        <VolumeX className="w-5 h-5 text-purple-600" />
                    ) : (
                        <Volume2 className="w-5 h-5 text-purple-600" />
                    )}
                </button>
            </div>

            {/* Keyboard Shortcuts Help */}
            <div className="text-xs text-gray-600 text-center">
                <p>Keyboard: Space (play/pause) • ← → (navigate) • R (repeat)</p>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{
                            width: `${((currentStep + 1) / directions.length) * 100}%`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
