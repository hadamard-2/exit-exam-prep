import type { Question } from "../types/quiz";
import { QuestionCard } from "./QuestionCard";

interface QuestionPanelProps {
    currentQuestion: number;
    totalQuestions: number;
    questionData: Question;
}

export const QuestionPanel = ({
    currentQuestion,
    totalQuestions,
    questionData,
}: QuestionPanelProps) => {
    return (
        <div className="w-1/2 border-r border-slate-800 flex flex-col">
            {/* Header */}
            <div className="h-16 pl-6 border-b border-slate-800 flex items-center">
                <span className="text-sm text-slate-400">
                    {currentQuestion + 1} of {totalQuestions}
                </span>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <QuestionCard
                    question={questionData}
                    selectedAnswer={questionData.choices.findIndex(
                        (choice) => questionData.correct_answer == choice.id
                    )}
                    showExplanation={true}
                    onAnswerSelect={() => {}}
                />
            </div>
        </div>
    );
};
