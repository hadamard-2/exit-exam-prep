import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationButtonsProps {
    onPrevious: () => void;
    onNext: () => void;
    isFirstQuestion: boolean;
    hasSelectedAnswer: boolean;
}

export const NavigationButtons = ({
    onPrevious,
    onNext,
    isFirstQuestion,
    hasSelectedAnswer,
}: NavigationButtonsProps) => {
    return (
        <>
            {/* Left Arrow Button */}
            <button
                onClick={onPrevious}
                disabled={isFirstQuestion}
                className={`absolute left-8 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-all duration-200 z-10 ${
                    isFirstQuestion
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
                        : "bg-slate-700 hover:bg-slate-600 text-slate-100 hover:scale-110 shadow-lg"
                }`}
            >
                <ArrowLeft className="h-6 w-6" />
            </button>

            {/* Right Arrow Button */}
            <button
                onClick={onNext}
                disabled={!hasSelectedAnswer}
                className={`absolute right-8 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-all duration-200 z-10 ${
                    !hasSelectedAnswer
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-110 shadow-lg"
                }`}
            >
                <ArrowRight className="h-6 w-6" />
            </button>
        </>
    );
};
