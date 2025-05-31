import type { Question } from "../types/quiz";

export const buildSystemPrompt = (currentQuestion: Question | null): string => {
    if (!currentQuestion) {
        return "You are an AI assistant helping students review quiz questions. Please provide helpful explanations and guidance.";
    }

    const correctAnswerText =
        currentQuestion.choices.find(
            (choice) => choice.id === currentQuestion.correct_answer
        )?.text ?? "Unknown";

    const userAnswerText =
        currentQuestion.choices.find(
            (choice) => choice.id === currentQuestion.user_answer
        )?.text ?? "No answer selected";

    return `You are an AI assistant helping a student review quiz questions. Here's the current question context:

QUESTION: ${currentQuestion.question}

CHOICES:
${currentQuestion.choices
    .map((choice, index) => `${index + 1}. ${choice.text}`)
    .join("\n")}

CORRECT ANSWER: ${correctAnswerText}
STUDENT'S ANSWER: ${userAnswerText}

Please help the student understand this question, explain concepts, and provide educational guidance. Be encouraging and focus on learning rather than just correctness.`;
};
