export interface Choice {
    text: string;
    correct: boolean;
    explanation: string;
}

export interface Question {
    id: number;
    question: string;
    choices: Choice[];
}

export interface QuizData {
    questions: Question[];
}

export interface QuizState {
    currentQuestion: number;
    selectedAnswers: { [questionId: number]: number };
    showExplanations: { [questionId: number]: boolean };
    quizCompleted: boolean;
    score: number;
}
