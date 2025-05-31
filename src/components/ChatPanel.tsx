import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, Copy, Trash2, Check } from "lucide-react";
import Markdown from "react-markdown";

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

export const ChatPanel = ({
    messages,
    onSendMessage,
    onClearChat,
}: ChatPanelProps) => {
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
                            {message.sender === "ai" ? (
                                <div className="prose prose-sm prose-invert max-w-none">
                                    <Markdown
    components={{
        p: ({ children }) => (
            <p className="mb-3 last:mb-0 leading-relaxed">
                {children}
            </p>
        ),
        code: ({ children }) => (
            <code className="bg-slate-700 mx-1 px-1 py-0.5 rounded text-xs font-mono">
                {children}
            </code>
        ),
        pre: ({ children }) => (
            <pre className="bg-slate-700 p-4 rounded-lg mt-3 mb-3 overflow-x-auto">
                {children}
            </pre>
        ),
        ul: ({ children }) => (
            <ul className="ml-6 mb-3 list-disc">
                {children}
            </ul>
        ),
        ol: ({ children }) => (
            <ol className="ml-6 mb-3 list-decimal">
                {children}
            </ol>
        ),
        li: ({ children }) => (
            <li className="mb-1 leading-relaxed">{children}</li>
        ),
        h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-4 mt-6 first:mt-0 text-slate-100 border-b border-slate-700 pb-2">
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-lg font-bold mb-3 mt-5 first:mt-0 text-slate-200">
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-base font-semibold mb-2 mt-4 first:mt-0 text-slate-300">
                {children}
            </h3>
        ),
        h4: ({ children }) => (
            <h4 className="text-sm font-semibold mb-2 mt-3 first:mt-0 text-slate-400">
                {children}
            </h4>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 ml-2 my-3 text-slate-300 bg-slate-800/50 py-2 rounded-r">
                {children}
            </blockquote>
        ),
        strong: ({ children }) => (
            <strong className="font-semibold text-slate-100">
                {children}
            </strong>
        ),
        em: ({ children }) => (
            <em className="italic text-slate-300">
                {children}
            </em>
        ),
        hr: () => (
            <hr className="border-slate-600 my-6" />
        ),
    }}
>
    {message.message}
</Markdown>
                                </div>
                            ) : (
                                <div className="whitespace-pre-wrap">
                                    {message.message}
                                </div>
                            )}
                        </div>

                        {/* Copy button */}
                        {message.sender === "ai" && (
                            <button
                                onClick={() =>
                                    handleCopyMessage(
                                        message.message,
                                        message.id
                                    )
                                }
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
