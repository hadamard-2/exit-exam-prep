import { useState } from "react";

interface ChatMessage {
    id: string;
    sender: "user" | "ai";
    message: string;
    timestamp: Date;
}

export const useChat = () => {
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: "1",
            sender: "ai",
            message: "Ask me anything about this question!",
            timestamp: new Date(),
        },
    ]);

    const sendMessage = (message: string) => {
        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: "user",
            message,
            timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, newMessage]);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: "ai",
                message:
                    "I'll help you understand this better! (AI coming soon)",
                timestamp: new Date(),
            };
            setChatMessages((prev) => [...prev, aiResponse]);
        }, 1000);
    };

    return {
        messages: chatMessages,
        sendMessage,
    };
};
