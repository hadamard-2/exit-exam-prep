import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle } from "lucide-react";

interface ChatMessage {
    id: string;
    sender: "user" | "ai";
    message: string;
    timestamp: Date;
}

interface ChatPanelProps {
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
}

export const ChatPanel = ({ messages, onSendMessage }: ChatPanelProps) => {
    const [inputMessage, setInputMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            onSendMessage(inputMessage);
            setInputMessage("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Auto-resize textarea based on content
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [inputMessage]);

    return (
        <div className="w-1/2 flex flex-col">
            {/* Header */}
            <div className="h-16 pl-6 border-b border-slate-800 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-slate-400" />
                <span className="text-slate-300">Discussion</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${
                            message.sender === "user"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-[75%] p-3 rounded-lg text-sm whitespace-pre-wrap ${
                                message.sender === "user"
                                    ? "bg-purple-600 text-white"
                                    : "bg-slate-800 text-slate-200"
                            }`}
                        >
                            {message.message}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-slate-800">
                <div className="flex gap-3 items-end">
                    <textarea
                        ref={textareaRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask about this question..."
                        className="flex-1 bg-slate-800 border-0 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none min-h-[40px] max-h-[200px] overflow-y-auto"
                        rows={1}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim()}
                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-800 p-2.5 rounded-lg transition-colors flex-shrink-0"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};