import React from "react";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuizResultsProps {
    score: number;
    totalQuestions: number;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
    score,
    totalQuestions,
}) => {
    const percentage = Math.round((score / totalQuestions) * 100);
    const navigate = useNavigate();

    const getMessage = () => {
        if (percentage >= 80) return "Excellent work! 🎉";
        if (percentage >= 60) return "Good job! 👍";
        return "Keep practicing! 📚";
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-slate-100 mb-8">
                        Quiz Complete!
                    </h1>
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-12 shadow-2xl">
                        <div className="text-6xl font-bold text-emerald-400 mb-4">
                            {score}/{totalQuestions}
                        </div>
                        <div className="text-2xl text-slate-300 mb-2">
                            You scored {percentage}%
                        </div>
                        <div className="text-slate-400 mb-8">
                            {getMessage()}
                        </div>
                        <button
                            onClick={() => navigate("/")}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
                        >
                            <Home className="h-5 w-5" />
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
