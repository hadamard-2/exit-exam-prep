import React from "react";

interface QuizHeaderProps {
    currentQuestion: number;
    totalQuestions: number;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
    currentQuestion,
    totalQuestions,
}) => {
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;

    return (
        <div className="text-center mb-8">
            <div className="text-slate-400">
                Question {currentQuestion + 1} of {totalQuestions}
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-4">
                <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};
