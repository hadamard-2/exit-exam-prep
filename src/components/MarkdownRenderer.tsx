import React from "react";

interface MarkdownRendererProps {
    text: string;
    applyMargin?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
    text,
    applyMargin = true,
}) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;

    const renderContent = () => {
        return text.split(codeBlockRegex).map((part, index) => {
            if (index % 3 === 0) {
                // Regular text
                return part.split("\n").map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                        {line}
                        {lineIndex < part.split("\n").length - 1 && <br />}
                    </React.Fragment>
                ));
            } else if (index % 3 === 1) {
                // Language identifier
                return null;
            } else {
                // Code content
                return (
                    <div
                        key={index}
                        className={`bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-base font-normal overflow-x-auto ${
                            applyMargin ? "my-6" : ""
                        }`}
                    >
                        <pre className="whitespace-pre-wrap">{part.trim()}</pre>
                    </div>
                );
            }
        });
    };

    return <>{renderContent()}</>;
};
