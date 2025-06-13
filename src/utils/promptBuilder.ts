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

I'm here to help clarify any confusion you have about this specific question. Feel free to ask me anything about the question, answer choices, or why certain options are correct or incorrect. I'll keep my responses focused and to the point to help you understand better.`;
};
