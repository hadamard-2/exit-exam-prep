import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface QuizNavigationProps {
    currentQuestion: number;
    totalQuestions: number;
    hasSelectedAnswer: boolean;
    onPrevious: () => void;
    onNext: () => void;
}

export const QuizNavigation: React.FC<QuizNavigationProps> = ({
    currentQuestion,
    totalQuestions,
    hasSelectedAnswer,
    onPrevious,
    onNext,
}) => {
    const isFirstQuestion = currentQuestion === 0;
    const isLastQuestion = currentQuestion === totalQuestions - 1;

    return (
        <div className="flex justify-between items-center">
            <button
                onClick={onPrevious}
                disabled={isFirstQuestion}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    isFirstQuestion
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                        : "bg-slate-700 hover:bg-slate-600 text-slate-100 hover:scale-105"
                }`}
            >
                <ArrowLeft className="h-5 w-5" />
                Previous
            </button>

            <div className="text-slate-400 text-sm">
                {hasSelectedAnswer
                    ? "Answer selected"
                    : "Select an answer to continue"}
            </div>

            <button
                onClick={onNext}
                disabled={!hasSelectedAnswer}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    !hasSelectedAnswer
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-105 shadow-lg"
                }`}
            >
                {isLastQuestion ? "Finish Quiz" : "Next"}
                <ArrowRight className="h-5 w-5" />
            </button>
        </div>
    );
};
