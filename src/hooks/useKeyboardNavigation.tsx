import { useEffect } from "react";

interface UseKeyboardNavigationProps {
    onPrevious: () => void;
    onNext: () => void;
    canGoBack: boolean;
    canGoForward: boolean;
}

export const useKeyboardNavigation = ({
    onPrevious,
    onNext,
    canGoBack,
    canGoForward,
}: UseKeyboardNavigationProps) => {
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft" && canGoBack) {
                onPrevious();
            } else if (event.key === "ArrowRight" && canGoForward) {
                onNext();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [onPrevious, onNext, canGoBack, canGoForward]);
};
