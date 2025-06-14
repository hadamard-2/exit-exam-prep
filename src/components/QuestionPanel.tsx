import type { Question } from "../types/quiz";
import { QuestionCard } from "./QuestionCard";
import { RotateCcw, Filter } from "lucide-react";

interface QuestionPanelProps {
    currentQuestion: number;
    totalQuestions: number;
    questionData: Question;
    onStartOver?: () => void;
    showWrongOnly?: boolean;
    onToggleFilter?: () => void;
}

export const QuestionPanel = ({
    currentQuestion,
    totalQuestions,
    questionData,
    onStartOver,
    showWrongOnly = false,
    onToggleFilter,
}: QuestionPanelProps) => {
    return (
        <div className="w-1/2 border-r border-slate-800 flex flex-col">
            {/* Header */}
            <div className="h-16 pl-6 pr-4 border-b border-slate-800 flex items-center justify-between">
                <span className="text-sm text-slate-400">
                    {currentQuestion + 1} of {totalQuestions}
                    {showWrongOnly && (
                        <span className="ml-2 text-xs text-red-400">
                            (wrong only)
                        </span>
                    )}
                </span>
                <div className="flex items-center gap-2">
                    {onToggleFilter && (
                        <button
                            onClick={onToggleFilter}
                            className={`p-2 rounded-md transition-colors ${
                                showWrongOnly
                                    ? "text-red-400 bg-red-400/10 hover:bg-red-400/20"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            }`}
                            title={
                                showWrongOnly
                                    ? "Show all questions"
                                    : "Show wrong answers only"
                            }
                        >
                            <Filter size={16} />
                        </button>
                    )}
                    <button
                        onClick={onStartOver}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                        title="Start Over"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <QuestionCard
                    question={questionData}
                    selectedAnswer={questionData.choices.findIndex(
                        (choice) => questionData.user_answer === choice.id
                    )}
                    showExplanation={true}
                    onAnswerSelect={() => {}}
                />
            </div>
        </div>
    );
};
