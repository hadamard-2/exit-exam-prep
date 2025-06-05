import { useState, useEffect } from "react";
import type { Question, QuizState } from "../types/quiz";

const QUIZ_PROGRESS_KEY = "quizProgress";

export const useQuiz = (questions: Question[]) => {
    const [state, setState] = useState<QuizState>({
        currentQuestion: 0,
        selectedAnswers: {},
        showExplanations: {},
        quizCompleted: false,
        score: 0,
    });

    // Load saved progress on mount
    useEffect(() => {
        const savedProgress = localStorage.getItem(QUIZ_PROGRESS_KEY);
        if (savedProgress) {
            try {
                const parsedProgress = JSON.parse(savedProgress);
                setState(parsedProgress);
            } catch (error) {
                console.error("Error loading saved progress:", error);
                // Clear corrupted data
                localStorage.removeItem(QUIZ_PROGRESS_KEY);
            }
        }
    }, []);

    // Save progress whenever state changes
    useEffect(() => {
        if (questions.length > 0) {
            localStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(state));
        }
    }, [state, questions.length]);

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

        const originalFilename = localStorage.getItem("originalFilename") || "qeu";
        
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
        
        const filename = `${originalFilename}-done-${timestamp}.json`;
        
        const resultData = {
            questions: questionsWithAnswers
        };

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
            // Clear progress when quiz is completed
            clearProgress();
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
        const initialState = {
            currentQuestion: 0,
            selectedAnswers: {},
            showExplanations: {},
            quizCompleted: false,
            score: 0,
        };
        setState(initialState);
        // Clear saved progress
        clearProgress();
    };

    const clearProgress = () => {
        localStorage.removeItem(QUIZ_PROGRESS_KEY);
    };

    return {
        ...state,
        handleAnswerSelect,
        nextQuestion,
        prevQuestion,
        resetQuiz,
        clearProgress,
    };
};