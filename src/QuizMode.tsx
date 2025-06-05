import { useState, useEffect } from "react";
import { useQuiz } from "./hooks/useQuiz";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { QuizHeader } from "./components/QuizHeader";
import { QuestionCard } from "./components/QuestionCard";
import { QuizResults } from "./components/QuizResults";
import { NavigationButtons } from "./components/NavigationButtons";
import { RotateCcw, Play } from "lucide-react";
import type { Question } from "./types/quiz";

const QuizMode = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showContinueOption, setShowContinueOption] = useState(false);

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
            
            // Check if there's saved progress
            const savedProgress = localStorage.getItem("quizProgress");
            if (savedProgress) {
                try {
                    const progress = JSON.parse(savedProgress);
                    // Show continue option if there's meaningful progress
                    if (progress.currentQuestion > 0 || Object.keys(progress.selectedAnswers).length > 0) {
                        setShowContinueOption(true);
                    }
                } catch {
                    // Clear corrupted progress
                    localStorage.removeItem("quizProgress");
                }
            }
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

    const handleStartFresh = () => {
        quiz.resetQuiz();
        setShowContinueOption(false);
    };

    const handleContinue = () => {
        setShowContinueOption(false);
    };

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

    if (showContinueOption) {
        return (
            <div className="h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-8">
                        <h2 className="text-2xl font-semibold mb-4">Continue Quiz?</h2>
                        <p className="text-slate-400 mb-6">
                            We found your previous quiz progress. Would you like to continue where you left off?
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={handleContinue}
                                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
                            >
                                <Play className="h-4 w-4" />
                                Continue
                            </button>
                            <button
                                onClick={handleStartFresh}
                                className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Start Fresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (quiz.quizCompleted) {
        return (
            <QuizResults
                score={quiz.score}
                totalQuestions={questions.length}
            />
        );
    }

    return (
        <div className="h-screen overflow-hidden bg-slate-950 text-slate-100 flex items-center justify-center relative">
            <NavigationButtons
                onPrevious={quiz.prevQuestion}
                onNext={quiz.nextQuestion}
                isFirstQuestion={isFirstQuestion}
                hasSelectedAnswer={hasSelectedAnswer}
            />

            <div className="max-w-4xl w-[60%] mx-auto px-4 py-10 h-full flex flex-col">
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
                    <div className="mt-1 text-xs text-slate-500">
                        Progress is automatically saved
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizMode;