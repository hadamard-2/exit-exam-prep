import { useState, useEffect } from "react";
import type { Question } from "../types/quiz";
import type { ChatMessage } from "../types/chat";
import { AIService } from "../services/aiService";
import { buildSystemPrompt } from "../utils/promptBuilder";
import { useThinkingAnimation } from "./useThinkingAnimation";

const INITIAL_MESSAGE: ChatMessage = {
    id: "1",
    sender: "ai",
    message: "Ask me anything about this question!",
    timestamp: new Date(),
};

export const useChat = ({ currentQuestion }: { currentQuestion: Question }) => {
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        INITIAL_MESSAGE,
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const { getThinkingMessage } = useThinkingAnimation(isLoading);

    const sendMessage = async (message: string) => {
        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: "user",
            message,
            timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, newMessage]);

        setIsLoading(true);

        const thinkingMessage: ChatMessage = {
            id: "thinking-temp",
            sender: "ai",
            message: getThinkingMessage(),
            timestamp: new Date(),
            isThinking: true,
        };
        setChatMessages((prev) => [...prev, thinkingMessage]);

        try {
            const systemPrompt = buildSystemPrompt(currentQuestion);
            const aiResponseText = await AIService.getResponse(
                systemPrompt,
                message
            );

            const aiResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: "ai",
                message: aiResponseText,
                timestamp: new Date(),
            };

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

            setChatMessages((prev) =>
                prev
                    .filter((msg) => msg.id !== "thinking-temp")
                    .concat(errorResponse)
            );
        } finally {
            setIsLoading(false);
        }
    };

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
    }, [getThinkingMessage, isLoading]);

    const clearMessages = () => {
        setChatMessages([INITIAL_MESSAGE]);
    };

    return {
        messages: chatMessages,
        sendMessage,
        clearMessages,
        isLoading,
    };
};
