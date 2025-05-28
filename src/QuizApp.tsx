import { quizData } from "./data/quizData";
import { useQuiz } from "./hooks/useQuiz";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { QuizHeader } from "./components/QuizHeader";
import { QuestionCard } from "./components/QuestionCard";
import { QuizResults } from "./components/QuizResults";
import { NavigationButtons } from "./components/NavigationButtons";

const QuizApp = () => {
    const questions = quizData.questions;
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
        canGoForward: hasSelectedAnswer
    });

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
            <NavigationButtons
                onPrevious={quiz.prevQuestion}
                onNext={quiz.nextQuestion}
                isFirstQuestion={isFirstQuestion}
                hasSelectedAnswer={hasSelectedAnswer}
            />

            <div className="max-w-4xl w-full mx-auto px-4 py-8 h-full flex flex-col">
                <QuizHeader
                    currentQuestion={quiz.currentQuestion}
                    totalQuestions={questions.length}
                />

                <div className="flex-1 overflow-y-auto">
                    <QuestionCard
                        question={currentQuestion}
                        selectedAnswer={selectedAnswer}
                        showExplanation={showExplanation}
                        onAnswerSelect={(choiceIndex) =>
                            quiz.handleAnswerSelect(currentQuestion.id, choiceIndex)
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

export default QuizApp;