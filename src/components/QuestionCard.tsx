import React from "react";
import { Check, X } from "lucide-react";
import type { Question } from "../types/quiz";
import { MarkdownRenderer } from "./MarkdownRenderer";

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
            <div className="text-lg font-semibold text-slate-100 mb-8 leading-relaxed">
                <MarkdownRenderer text={question.question} />
            </div>

            <div className="space-y-4">
                {question.choices.map((choice, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = choice.correct;
                    const showResult = showExplanation && isSelected;

                    return (
                        <div key={index} className="space-y-3">
                            <button
                                onClick={() => onAnswerSelect(index)}
                                disabled={showExplanation}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                                    isSelected && showResult
                                        ? isCorrect
                                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-100"
                                            : "border-red-500 bg-red-500/10 text-red-100"
                                        : isSelected
                                        ? "border-emerald-500 bg-emerald-500/5"
                                        : "border-slate-600 bg-slate-800 hover:border-slate-500"
                                } ${
                                    showExplanation
                                        ? "cursor-default"
                                        : "cursor-pointer hover:scale-[1.01]"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            isSelected && showResult
                                                ? isCorrect
                                                    ? "border-emerald-500 bg-emerald-500"
                                                    : "border-red-500 bg-red-500"
                                                : isSelected
                                                ? "border-emerald-500 bg-emerald-500"
                                                : "border-slate-500"
                                        }`}
                                    >
                                        {isSelected &&
                                            showResult &&
                                            (isCorrect ? (
                                                <Check className="h-3 w-3 text-white" />
                                            ) : (
                                                <X className="h-3 w-3 text-white" />
                                            ))}
                                    </div>
                                    <span className="font-medium text-sm">
                                        <MarkdownRenderer text={choice.text} applyMargin={false}/>
                                    </span>
                                </div>
                            </button>

                            {showExplanation && isSelected && (
                                <div
                                    className={`ml-6 p-4 border-l-4 ${
                                        isCorrect
                                            ? "border-emerald-500 bg-emerald-500/5 text-emerald-100"
                                            : "border-red-500 bg-red-500/5 text-red-100"
                                    }`}
                                >
                                    <div className="text-sm font-medium mb-1">
                                        {isCorrect ? "Correct!" : "Incorrect"}
                                    </div>
                                    <div className="text-sm opacity-90">
                                        <MarkdownRenderer
                                            text={choice.explanation}
                                        />
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
