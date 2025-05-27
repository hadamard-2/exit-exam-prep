import { quizData } from "./data/quizData";
import { useQuiz } from "./hooks/useQuiz";
import { QuizHeader } from "./components/QuizHeader";
import { QuestionCard } from "./components/QuestionCard";
import { QuizNavigation } from "./components/QuizNavigation";
import { QuizResults } from "./components/QuizResults";

const QuizApp = () => {
    const questions = quizData.questions;
    const quiz = useQuiz(questions);

    if (quiz.quizCompleted) {
        return (
            <QuizResults
                score={quiz.score}
                totalQuestions={questions.length}
                onRestart={quiz.resetQuiz}
            />
        );
    }

    const currentQuestion = questions[quiz.currentQuestion];
    const selectedAnswer = quiz.selectedAnswers[currentQuestion.id];
    const showExplanation = quiz.showExplanations[currentQuestion.id];

    return (
        // <div className="min-h-screen bg-slate-950 text-slate-100">
        //   <div className="max-w-4xl mx-auto">
        <div className="h-screen overflow-hidden bg-slate-950 text-slate-100 flex items-center justify-center">
            <div className="max-w-4xl w-full mx-auto px-4 pb-8">
                <QuizHeader
                    currentQuestion={quiz.currentQuestion}
                    totalQuestions={questions.length}
                />

                <QuestionCard
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    showExplanation={showExplanation}
                    onAnswerSelect={(choiceIndex) =>
                        quiz.handleAnswerSelect(currentQuestion.id, choiceIndex)
                    }
                />

                <QuizNavigation
                    currentQuestion={quiz.currentQuestion}
                    totalQuestions={questions.length}
                    hasSelectedAnswer={selectedAnswer !== undefined}
                    onPrevious={quiz.prevQuestion}
                    onNext={quiz.nextQuestion}
                />
            </div>
        </div>
    );
};

export default QuizApp;
