"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";

interface AIRecipeChatProps {
    recipeId: string;
    recipeTitle: string;
}

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function AIRecipeChat({ recipeId, recipeTitle }: AIRecipeChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const suggestedQuestions = [
        "What ingredients do I need?",
        "What's the next step?",
        "Can I substitute any ingredients?",
        "How many calories is this?",
        "How do I scale this recipe?",
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;

        const userMessage: Message = {
            role: "user",
            content: messageText.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/ai/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipeId,
                    message: messageText.trim(),
                    conversationId,
                    userId: "anonymous", // TODO: Get from session
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to get AI response");
            }

            const data = await response.json();

            setConversationId(data.conversationId || null);

            const assistantMessage: Message = {
                role: "assistant",
                content: data.response,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("AI Chat Error:", error);
            const errorMessage: Message = {
                role: "assistant",
                content: "Sorry, I'm having trouble responding right now. Please try again.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestedQuestion = (question: string) => {
        sendMessage(question);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center gap-2 group"
                >
                    <Sparkles className="w-6 h-6" />
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-semibold">
                        Ask AI Chef
                    </span>
                </button>
            )}

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border-2 border-orange-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            <div>
                                <h3 className="font-bold">AI Chef Assistant</h3>
                                <p className="text-xs text-white/80 truncate max-w-xs">
                                    {recipeTitle}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 p-2 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 ? (
                            <div className="text-center py-8">
                                <Sparkles className="w-12 h-12 mx-auto mb-3 text-orange-500" />
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    Hi! I&apos;m your AI Chef! 👨‍🍳
                                </h4>
                                <p className="text-sm text-gray-600 mb-4">
                                    Ask me anything about this recipe
                                </p>

                                {/* Suggested Questions */}
                                <div className="space-y-2">
                                    <p className="text-xs text-gray-500 font-semibold">
                                        SUGGESTED QUESTIONS:
                                    </p>
                                    {suggestedQuestions.map((question, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSuggestedQuestion(question)}
                                            className="w-full text-left p-3 bg-gray-50 hover:bg-orange-50 hover:border-orange-300 border border-gray-200 rounded-lg text-sm transition-colors"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl ${msg.role === "user"
                                            ? "bg-orange-500 text-white"
                                            : "bg-gray-100 text-gray-900"
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                    </div>
                                </div>
                            ))
                        )}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 p-3 rounded-2xl">
                                    <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 border-t">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
