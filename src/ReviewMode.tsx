import { useState } from "react";
import { quizData } from "./data/quizData";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { useChat } from "./hooks/useChat";
import { QuestionPanel } from "./components/QuestionPanel";
import { ChatPanel } from "./components/ChatPanel";

const ReviewMode = () => {
    const questions = quizData.questions;
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const { messages, sendMessage } = useChat();

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

    useKeyboardNavigation({
        onPrevious: prevQuestion,
        onNext: nextQuestion,
        canGoBack: !isFirstQuestion,
        canGoForward: !isLastQuestion,
    });

    return (
        <div className="h-screen bg-slate-950 text-slate-100 flex">
            <QuestionPanel
                currentQuestion={currentQuestion}
                totalQuestions={questions.length}
                questionData={currentQuestionData}
            />
            <ChatPanel
                messages={messages}
                onSendMessage={sendMessage}
            />
        </div>
    );
};

export default ReviewMode;