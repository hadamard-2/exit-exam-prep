import React from "react";
import { Check, X } from "lucide-react";
import Markdown from "react-markdown";
import type { Question } from "../types/quiz";

interface QuestionCardProps {
    question: Question;
    selectedAnswer?: number;
    showExplanation: boolean;
    onAnswerSelect: (choiceIndex: number) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    selectedAnswer,
    showExplanation,
    onAnswerSelect,
}) => {
    return (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">
            <div className="text-[17px] font-semibold text-slate-100 mb-8 leading-relaxed">
                <Markdown
                    components={{
                        p: ({ children }) => (
                            <p className="mb-3 last:mb-0 leading-relaxed">
                                {children}
                            </p>
                        ),
                        code: ({ children }) => (
                            <code
                                className={`bg-slate-800 py-1 rounded text-sm font-mono text-emerald-300 ${
                                    typeof children === "string" &&
                                    !children.includes("\n")
                                        ? "px-1.5"
                                        : ""
                                }`}
                            >
                                {children}
                            </code>
                        ),
                        pre: ({ children }) => (
                            <pre className="bg-slate-800 p-4 rounded-lg mt-3 mb-3 overflow-x-auto">
                                {children}
                            </pre>
                        ),
                    }}
                >
                    {question.question}
                </Markdown>
            </div>

            <div className="space-y-4">
                {question.choices.map((choice, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = question.correct_answer === choice.id;

                    return (
                        <div key={index} className="space-y-3">
                            <button
                                onClick={() => onAnswerSelect(index)}
                                disabled={showExplanation}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                                    showExplanation
                                        ? isCorrect
                                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-100"
                                            : isSelected
                                            ? "border-red-500 bg-red-500/10 text-red-100"
                                            : "border-slate-600 bg-slate-800/50"
                                        : isSelected
                                        ? "border-emerald-500 bg-emerald-500/5"
                                        : "border-slate-600 bg-slate-800/50 hover:border-slate-600"
                                } ${
                                    showExplanation
                                        ? "cursor-default"
                                        : "cursor-pointer hover:scale-[1.01]"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            showExplanation
                                                ? isCorrect
                                                    ? "border-emerald-500 bg-emerald-500"
                                                    : isSelected
                                                    ? "border-red-500 bg-red-500"
                                                    : "border-slate-500"
                                                : isSelected
                                                ? "border-emerald-500 bg-emerald-500"
                                                : "border-slate-500"
                                        }`}
                                    >
                                        {showExplanation && isCorrect && (
                                            <Check className="h-3 w-3 text-white" />
                                        )}
                                        {showExplanation &&
                                            isSelected &&
                                            !isCorrect && (
                                                <X className="h-3 w-3 text-white" />
                                            )}
                                    </div>
                                    <span className="font-medium text-sm">
                                        <Markdown
                                            components={{
                                                p: ({ children }) => (
                                                    <span>{children}</span>
                                                ),
                                                code: ({ children }) => (
                                                    <code className="bg-slate-800 py-0.5 rounded text-xs font-mono text-emerald-300">
                                                        {children}
                                                    </code>
                                                ),
                                            }}
                                        >
                                            {choice.text}
                                        </Markdown>
                                    </span>
                                </div>
                            </button>

                            {showExplanation && choice.explanation && (
                                <div
                                    className={`ml-6 p-4 border-l-4 ${
                                        isCorrect
                                            ? "border-emerald-500 bg-emerald-500/5 text-emerald-100"
                                            : isSelected
                                            ? "border-red-500 bg-red-500/5 text-red-100"
                                            : "border-slate-500 bg-slate-500/5 text-slate-300"
                                    }`}
                                >
                                    <div className="text-sm font-medium mb-1">
                                        {isCorrect
                                            ? "Correct!"
                                            : isSelected
                                            ? "Incorrect"
                                            : "Info"}
                                    </div>
                                    <div className="text-sm opacity-90">
                                        <Markdown
                                            components={{
                                                p: ({ children }) => (
                                                    <p className="mb-2 last:mb-0 leading-relaxed">
                                                        {children}
                                                    </p>
                                                ),
                                                code: ({ children }) => (
                                                    <code className="bg-slate-700 py-0.5 rounded text-xs font-mono text-emerald-300">
                                                        {children}
                                                    </code>
                                                ),
                                                pre: ({ children }) => (
                                                    <pre className="bg-slate-700 p-3 rounded-lg mt-2 mb-2 overflow-x-auto">
                                                        {children}
                                                    </pre>
                                                ),
                                            }}
                                        >
                                            {choice.explanation}
                                        </Markdown>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
