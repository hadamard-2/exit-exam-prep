import { useState, useEffect, useRef } from "react";
import type { Question } from "../types/quiz";

const apiKey = import.meta.env.VITE_API_KEY;

interface ChatMessage {
    id: string;
    sender: "user" | "ai";
    message: string;
    timestamp: Date;
    isThinking?: boolean;
}

export const useChat = ({ currentQuestion }: { currentQuestion: Question }) => {
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: "1",
            sender: "ai",
            message: "Ask me anything about this question!",
            timestamp: new Date(),
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [thinkingDots, setThinkingDots] = useState(0);
    const thinkingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Animate thinking dots
    useEffect(() => {
        if (isLoading) {
            thinkingIntervalRef.current = setInterval(() => {
                setThinkingDots((prev) => (prev + 1) % 4); // Cycle 0, 1, 2, 3
            }, 500);
        } else {
            if (thinkingIntervalRef.current) {
                clearInterval(thinkingIntervalRef.current);
                thinkingIntervalRef.current = null;
            }
            setThinkingDots(0);
        }

        return () => {
            if (thinkingIntervalRef.current) {
                clearInterval(thinkingIntervalRef.current);
            }
        };
    }, [isLoading]);

    const getThinkingMessage = () => {
        const dots = ".".repeat(thinkingDots);
        return `Thinking${dots}`;
    };

    const buildSystemPrompt = (): string => {
        if (!currentQuestion) {
            return "You are an AI assistant helping students review quiz questions. Please provide helpful explanations and guidance.";
        }

        const correctAnswerText =
            currentQuestion.choices.find(
                (choice) => choice.id === currentQuestion.correct_answer
            )?.text ?? "Unknown";

        const userAnswerText =
            currentQuestion.choices.find(
                (choice) => choice.id === currentQuestion.user_answer
            )?.text ?? "No answer selected";

        return `You are an AI assistant helping a student review quiz questions. Here's the current question context:

QUESTION: ${currentQuestion.question}

CHOICES:
${currentQuestion.choices
    .map((choice, index) => `${index + 1}. ${choice.text}`)
    .join("\n")}

CORRECT ANSWER: ${correctAnswerText}
STUDENT'S ANSWER: ${userAnswerText}

Please help the student understand this question, explain concepts, and provide educational guidance. Be encouraging and focus on learning rather than just correctness.`;
    };

    const getAIResponse = async (userMessage: string): Promise<string> => {
        try {
            const systemPrompt = buildSystemPrompt();

            console.log(systemPrompt);

            const response = await fetch(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "deepseek/deepseek-r1-0528:free",
                        messages: [
                            {
                                role: "system",
                                content: systemPrompt,
                            },
                            {
                                role: "user",
                                content: userMessage,
                            },
                        ],
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error("Error getting AI response:", error);
            return "Sorry, I'm having trouble responding right now. Please try again.";
        }
    };

    const sendMessage = async (message: string) => {
        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: "user",
            message,
            timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, newMessage]);

        setIsLoading(true);

        // Add temporary "Thinking..." message
        const thinkingMessage: ChatMessage = {
            id: "thinking-temp",
            sender: "ai",
            message: getThinkingMessage(),
            timestamp: new Date(),
            isThinking: true,
        };
        setChatMessages((prev) => [...prev, thinkingMessage]);

        try {
            const aiResponseText = await getAIResponse(message);
            const aiResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: "ai",
                message: aiResponseText,
                timestamp: new Date(),
            };
            // Replace the thinking message with the actual response
            setChatMessages((prev) =>
                prev
                    .filter((msg) => msg.id !== "thinking-temp")
                    .concat(aiResponse)
            );
        } catch {
            const errorResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: "ai",
                message: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date(),
            };
            // Replace the thinking message with the error response
            setChatMessages((prev) =>
                prev
                    .filter((msg) => msg.id !== "thinking-temp")
                    .concat(errorResponse)
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Update thinking message in real-time
    useEffect(() => {
        if (isLoading) {
            setChatMessages((prev) =>
                prev.map((msg) =>
                    msg.id === "thinking-temp"
                        ? { ...msg, message: getThinkingMessage() }
                        : msg
                )
            );
        }
    }, [thinkingDots, isLoading]);

    const clearMessages = () => {
        setChatMessages([
            {
                id: "1",
                sender: "ai",
                message: "Ask me anything about this question!",
                timestamp: new Date(),
            },
        ]);
    };

    return {
        messages: chatMessages,
        sendMessage,
        clearMessages,
        isLoading,
    };
};
