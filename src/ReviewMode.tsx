import { useState, useEffect } from "react";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { useChat } from "./hooks/useChat";
import { QuestionPanel } from "./components/QuestionPanel";
import { ChatPanel } from "./components/ChatPanel";
import type { Question } from "./types/quiz";

const ReviewMode = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const { messages, sendMessage, clearMessages } = useChat({currentQuestion: questions[currentQuestion]});

    useEffect(() => {
        try {
            const storedData = localStorage.getItem("quizData");
            if (!storedData) {
                setError(
                    "No quiz data found. Please upload a quiz file first."
                );
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

    const currentQuestionData = questions[currentQuestion];
    const isFirstQuestion = currentQuestion === 0;
    const isLastQuestion = currentQuestion === questions.length - 1;

    const nextQuestion = () => {
        if (!isLastQuestion) {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    const prevQuestion = () => {
        if (!isFirstQuestion) {
            setCurrentQuestion((prev) => prev - 1);
        }
    };

    const handleStartOver = () => {
        setCurrentQuestion(0);
        clearMessages();
    };

    useKeyboardNavigation({
        onPrevious: prevQuestion,
        onNext: nextQuestion,
        canGoBack: !isFirstQuestion,
        canGoForward: !isLastQuestion,
    });

    if (loading) {
        return (
            <div className="h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-300">Loading review data...</p>
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

    return (
        <div className="h-screen bg-slate-950 text-slate-100 flex">
            <QuestionPanel
                currentQuestion={currentQuestion}
                totalQuestions={questions.length}
                questionData={currentQuestionData}
                onStartOver={handleStartOver}
            />
            <ChatPanel
                messages={messages}
                onSendMessage={sendMessage}
                onClearChat={clearMessages}
            />
        </div>
    );
};

export default ReviewMode;
