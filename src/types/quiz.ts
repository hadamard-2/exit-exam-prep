export interface Choice {
    id: number;
    text: string;
    explanation: string;
}

export interface Question {
    id: number;
    question: string;
    user_answer?: number;
    correct_answer: number;
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
