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

    const saveQuizResults = () => {
        // Create updated questions with user answers
        const questionsWithAnswers = questions.map((question) => {
            const selectedIndex = state.selectedAnswers[question.id];
            const userAnswer = selectedIndex !== undefined ? question.choices[selectedIndex].id : null;
            
            return {
                ...question,
                user_answer: userAnswer
            };
        });

        // Get original filename from localStorage or use default
        const originalFilename = localStorage.getItem("originalFilename") || "qeu";
        
        // Create timestamp
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
        
        // Create filename
        const filename = `${originalFilename}-done-${timestamp}.json`;
        
        // Create the data to save
        const resultData = {
            questions: questionsWithAnswers
        };

        // Create and download the file
        const blob = new Blob([JSON.stringify(resultData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
            // Save results when quiz is completed
            saveQuizResults();
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