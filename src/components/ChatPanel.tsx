import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, Copy, Trash2, Check } from "lucide-react";

interface ChatMessage {
    id: string;
    sender: "user" | "ai";
    message: string;
    timestamp: Date;
}

interface ChatPanelProps {
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
    onClearChat: () => void;
}

export const ChatPanel = ({ messages, onSendMessage, onClearChat }: ChatPanelProps) => {
    const [inputMessage, setInputMessage] = useState("");
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
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

    const handleCopyMessage = async (message: string, messageId: string) => {
        try {
            await navigator.clipboard.writeText(message);
            setCopiedMessageId(messageId);
            setTimeout(() => setCopiedMessageId(null), 2000);
        } catch (err) {
            console.error("Failed to copy message:", err);
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
            <div className="h-16 pl-6 pr-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-300">Discussion</span>
                </div>
                {messages.length > 0 && (
                    <button
                        onClick={onClearChat}
                        className="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Clear chat"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex items-start gap-2 group ${
                            message.sender === "user"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-[75%] p-3 rounded-lg text-sm ${
                                message.sender === "user"
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-800 text-slate-200"
                            }`}
                        >
                            <div className="whitespace-pre-wrap">{message.message}</div>
                        </div>
                        
                        {/* Copy button */}
                        {message.sender === "ai" && (
                            <button
                                onClick={() => handleCopyMessage(message.message, message.id)}
                                className="p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700 hover:bg-slate-600 flex-shrink-0 mt-1"
                                title="Copy message"
                            >
                                {copiedMessageId === message.id ? (
                                    <Check className="h-3 w-3 text-green-400" />
                                ) : (
                                    <Copy className="h-3 w-3 text-slate-300" />
                                )}
                            </button>
                        )}
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
                        className="flex-1 bg-slate-800 border-0 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none min-h-[40px] max-h-[200px] overflow-y-auto"
                        rows={1}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 p-2.5 rounded-lg transition-colors flex-shrink-0"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};