import { useState } from "react";
import type { Question, QuizState } from "../types/quiz";

export const useQuiz = (questions: Question[]) => {
    const [state, setState] = useState<QuizState>({
        currentQuestion: 0,
        selectedAnswers: {},
        showExplanations: {},
        quizCompleted: false,
        score: 0,
    });

    const handleAnswerSelect = (questionId: number, choiceIndex: number) => {
        const newSelectedAnswers = {
            ...state.selectedAnswers,
            [questionId]: choiceIndex,
        };

        setState((prev) => ({
            ...prev,
            selectedAnswers: newSelectedAnswers,
            showExplanations: {
                ...prev.showExplanations,
                [questionId]: true,
            },
        }));
    };

    const calculateScore = () => {
        let correctAnswers = 0;
        questions.forEach((question) => {
            const selectedIndex = state.selectedAnswers[question.id];
            if (
                selectedIndex !== undefined &&
                question.choices[selectedIndex].id === question.correct_answer
            ) {
                correctAnswers++;
            }
        });
        return correctAnswers;
    };

    const nextQuestion = () => {
        if (state.currentQuestion < questions.length - 1) {
            setState((prev) => ({
                ...prev,
                currentQuestion: prev.currentQuestion + 1,
            }));
        } else {
            const finalScore = calculateScore();
            setState((prev) => ({
                ...prev,
                score: finalScore,
                quizCompleted: true,
            }));
        }
    };

    const prevQuestion = () => {
        if (state.currentQuestion > 0) {
            setState((prev) => ({
                ...prev,
                currentQuestion: prev.currentQuestion - 1,
            }));
        }
    };

    const resetQuiz = () => {
        setState({
            currentQuestion: 0,
            selectedAnswers: {},
            showExplanations: {},
            quizCompleted: false,
            score: 0,
        });
    };

    return {
        ...state,
        handleAnswerSelect,
        nextQuestion,
        prevQuestion,
        resetQuiz,
    };
};
