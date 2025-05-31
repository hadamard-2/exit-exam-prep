import { useState, useEffect, useRef, useCallback } from "react";

export const useThinkingAnimation = (isLoading: boolean) => {
    const [thinkingDots, setThinkingDots] = useState(0);
    const thinkingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isLoading) {
            thinkingIntervalRef.current = setInterval(() => {
                setThinkingDots((prev) => (prev + 1) % 4);
            }, 500);
        } else {
            if (thinkingIntervalRef.current) {
                clearInterval(thinkingIntervalRef.current);
                thinkingIntervalRef.current = null;
            }
            setThinkingDots(0);
        }

        return () => {
            if (thinkingIntervalRef.current) {
                clearInterval(thinkingIntervalRef.current);
            }
        };
    }, [isLoading]);

    const getThinkingMessage = useCallback(() => {
        const dots = ".".repeat(thinkingDots);
        return `Thinking${dots}`;
    }, [thinkingDots]);

    return { getThinkingMessage };
};
