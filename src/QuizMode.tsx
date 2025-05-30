import { useState, useEffect } from "react";
import { useQuiz } from "./hooks/useQuiz";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { QuizHeader } from "./components/QuizHeader";
import { QuestionCard } from "./components/QuestionCard";
import { QuizResults } from "./components/QuizResults";
import { NavigationButtons } from "./components/NavigationButtons";
import type { Question } from "./types/quiz";

const QuizMode = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem("quizData");
            if (!storedData) {
                setError("No quiz data found. Please upload a quiz file first.");
                setLoading(false);
                return;
            }

            const parsedData = JSON.parse(storedData);
            if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
                setError("Invalid quiz data format.");
                setLoading(false);
                return;
            }

            setQuestions(parsedData.questions);
        } catch {
            setError("Error loading quiz data.");
        } finally {
            setLoading(false);
        }
    }, []);

    const quiz = useQuiz(questions);

    const currentQuestion = questions[quiz.currentQuestion];
    const selectedAnswer = quiz.selectedAnswers[currentQuestion?.id];
    const showExplanation = quiz.showExplanations[currentQuestion?.id];

    const isFirstQuestion = quiz.currentQuestion === 0;
    const hasSelectedAnswer = selectedAnswer !== undefined;

    // Keyboard navigation
    useKeyboardNavigation({
        onPrevious: quiz.prevQuestion,
        onNext: quiz.nextQuestion,
        canGoBack: !isFirstQuestion,
        canGoForward: hasSelectedAnswer,
    });

    if (loading) {
        return (
            <div className="h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-300">Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
                        <p className="text-red-200">{error}</p>
                    </div>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (quiz.quizCompleted) {
        return (
            <QuizResults
                score={quiz.score}
                totalQuestions={questions.length}
                onRestart={quiz.resetQuiz}
            />
        );
    }

    return (
        <div className="h-screen overflow-hidden bg-slate-950 text-slate-100 flex items-center justify-center relative">
            {/* Quiz Mode Indicator */}
            <div className="absolute top-4 right-6 bg-slate-800 text-sm p-3 rounded shadow text-slate-200 font-semibold z-10">
                Quiz Mode
            </div>
            <NavigationButtons
                onPrevious={quiz.prevQuestion}
                onNext={quiz.nextQuestion}
                isFirstQuestion={isFirstQuestion}
                hasSelectedAnswer={hasSelectedAnswer}
            />

            <div className="max-w-4xl w-full mx-auto px-4 py-10 h-full flex flex-col">
                <QuizHeader
                    currentQuestion={quiz.currentQuestion}
                    totalQuestions={questions.length}
                />

                <div className="flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <QuestionCard
                        question={currentQuestion}
                        selectedAnswer={selectedAnswer}
                        showExplanation={showExplanation}
                        onAnswerSelect={(choiceIndex) =>
                            quiz.handleAnswerSelect(
                                currentQuestion.id,
                                choiceIndex
                            )
                        }
                    />
                </div>

                {/* Keyboard hint */}
                <div className="text-center mt-6 text-slate-400 text-sm">
                    Use arrow keys or side buttons to navigate
                    {!hasSelectedAnswer && " (select an answer first)"}
                </div>
            </div>
        </div>
    );
};

export default QuizMode;