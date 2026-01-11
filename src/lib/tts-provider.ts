// Text-to-Speech provider abstraction layer
// Supports OpenAI TTS and ElevenLabs

export type TTSProvider = "openai" | "elevenlabs";

interface TTSConfig {
    provider: TTSProvider;
    apiKey: string;
}

export class TTSService {
    private config: TTSConfig;

    constructor(provider?: TTSProvider) {
        const selectedProvider = provider || (process.env.TTS_PROVIDER as TTSProvider) || "openai";

        const apiKey =
            selectedProvider === "openai"
                ? process.env.OPENAI_API_KEY || ""
                : process.env.ELEVENLABS_API_KEY || "";

        if (!apiKey) {
            throw new Error(`${selectedProvider.toUpperCase()} API key not found`);
        }

        this.config = {
            provider: selectedProvider,
            apiKey,
        };
    }

    /**
     * Generate speech from text using OpenAI TTS
     */
    private async generateWithOpenAI(text: string, voice: string = "alloy"): Promise<ArrayBuffer> {
        const response = await fetch("https://api.openai.com/v1/audio/speech", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.config.apiKey}`,
            },
            body: JSON.stringify({
                model: "tts-1", // or "tts-1-hd" for higher quality
                input: text,
                voice, // alloy, echo, fable, onyx, nova, shimmer
                speed: 1.0,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenAI TTS API error: ${response.statusText}`);
        }

        return await response.arrayBuffer();
    }

    /**
     * Generate speech from text using ElevenLabs
     */
    private async generateWithElevenLabs(
        text: string,
        voiceId: string = "21m00Tcm4TlvDq8ikWAM" // Default: Rachel voice
    ): Promise<ArrayBuffer> {
        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "xi-api-key": this.config.apiKey,
                },
                body: JSON.stringify({
                    text,
                    model_id: "eleven_monolingual_v1",
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75,
                    },
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`ElevenLabs API error: ${response.statusText}`);
        }

        return await response.arrayBuffer();
    }

    /**
     * Generate speech audio from text
     * Returns audio data as base64 string
     */
    async generateSpeech(text: string, options?: { voice?: string }): Promise<string> {
        try {
            let audioBuffer: ArrayBuffer;

            if (this.config.provider === "openai") {
                audioBuffer = await this.generateWithOpenAI(text, options?.voice || "alloy");
            } else {
                audioBuffer = await this.generateWithElevenLabs(text, options?.voice || "21m00Tcm4TlvDq8ikWAM");
            }

            // Convert to base64
            const bytes = new Uint8Array(audioBuffer);
            let binary = "";
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            const base64 = btoa(binary);

            return `data:audio/mpeg;base64,${base64}`;
        } catch (error) {
            console.error("TTS generation error:", error);
            throw error;
        }
    }

    /**
     * Generate speech for a recipe step
     * Formats the text nicely for voice output
     */
    async generateStepAudio(stepNumber: number, instruction: string): Promise<string> {
        const formattedText = `Step ${stepNumber}. ${instruction}`;
        return this.generateSpeech(formattedText);
    }
}
