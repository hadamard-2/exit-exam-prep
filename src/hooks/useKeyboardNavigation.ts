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
            // Ignore keyboard events when user is focused on input elements
            const activeElement = document.activeElement;
            if (activeElement && (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                (activeElement as HTMLElement).contentEditable === 'true'
            )) {
                return;
            }

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
