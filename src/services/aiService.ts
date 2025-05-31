const apiKey = import.meta.env.VITE_API_KEY;

export class AIService {
    private static readonly API_URL =
        "https://openrouter.ai/api/v1/chat/completions";
    private static readonly MODEL = "deepseek/deepseek-r1-0528:free";
    private static readonly ERROR_MESSAGE =
        "Sorry, I'm having trouble responding right now. Please try again.";

    static async getResponse(
        systemPrompt: string,
        userMessage: string
    ): Promise<string> {
        try {
            const response = await fetch(this.API_URL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: this.MODEL,
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt,
                        },
                        {
                            role: "user",
                            content: userMessage,
                        },
                    ],
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error("Error getting AI response:", error);
            return this.ERROR_MESSAGE;
        }
    }
}
