import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import type { Question } from "./types/quiz";
import { Upload, Info } from "lucide-react";

export default function FileUpload() {
    const { mode } = useParams();
    const navigate = useNavigate();

    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Backspace") {
                event.preventDefault();
                navigate("/");
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [navigate]);

    const validateQuizData = (
        data: unknown
    ): data is { questions: Question[] } => {
        // Basic validation for quiz data structure
        if (!data || typeof data !== "object") return false;

        const obj = data as Record<string, unknown>;
        if (!obj.questions || !Array.isArray(obj.questions)) return false;

        // Validate each question has required properties matching Question type
        return obj.questions.every((q: unknown) => {
            if (!q || typeof q !== "object") return false;
            const question = q as Record<string, unknown>;

            // Additional validation for review mode
            const hasUserAnswer =
                mode === "review"
                    ? typeof question.user_answer === "number"
                    : true;

            return (
                question.id &&
                question.question &&
                question.choices &&
                Array.isArray(question.choices) &&
                question.choices.every((choice: unknown) => {
                    if (!choice || typeof choice !== "object") return false;
                    const c = choice as Record<string, unknown>;
                    return (
                        c.id !== undefined && // Check for choice id
                        typeof c.text === "string" &&
                        typeof c.correct === "boolean" &&
                        typeof c.explanation === "string"
                    );
                }) &&
                hasUserAnswer // Verify user_answer exists in review mode
            );
        });
    };

    const processFile = async (file: File) => {
        setIsLoading(true);
        setError(null);

        try {
            if (file.type !== "application/json") {
                throw new Error("Please select a valid JSON file");
            }

            const text = await file.text();
            const data = JSON.parse(text);

            if (!validateQuizData(data)) {
                throw new Error(
                    "Invalid quiz data format. Please check your JSON structure."
                );
            }

            localStorage.setItem("quizData", JSON.stringify(data));

            if (mode === "quiz") {
                navigate("/quiz");
            } else if (mode === "review") {
                navigate("/review");
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error processing file"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (files: FileList | null) => {
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
            {/* File Upload Area */}
            <div className="space-y-6 max-w-2xl mx-auto">
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={openFileDialog}
                    className={`
                            relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300
                            ${
                                isDragging
                                    ? "border-blue-400 bg-blue-400/10 scale-105"
                                    : "border-slate-600 hover:border-slate-500 hover:bg-slate-800/30"
                            }
                            ${isLoading ? "pointer-events-none opacity-75" : ""}
                        `}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={(e) => handleFileSelect(e.target.files)}
                        className="hidden"
                    />

                    <div className="space-y-6">
                        <div
                            className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                isDragging
                                    ? "bg-blue-500/20 border-2 border-blue-400/50"
                                    : "bg-slate-700/50 border-2 border-slate-600/50"
                            }`}
                        >
                            <Upload
                                className={`w-8 h-8 transition-colors ${
                                    isDragging
                                        ? "text-blue-400"
                                        : "text-slate-400"
                                }`}
                            />
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-slate-200 mb-2">
                                {isLoading
                                    ? "Processing your file..."
                                    : isDragging
                                    ? "Drop it here!"
                                    : "Drop your JSON file here"}
                            </h3>
                            {!isLoading && (
                                <p className="text-slate-400">
                                    or{" "}
                                    <span className="text-blue-400 hover:text-blue-300 font-medium">
                                        click to browse
                                    </span>
                                </p>
                            )}
                        </div>

                        {isLoading && (
                            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            </div>
                            <p className="text-red-200 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* JSON Format Info */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Info className="w-5 h-5 text-blue-400" />
                        <h4 className="font-semibold text-slate-200">
                            Expected JSON Format
                        </h4>
                    </div>

                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                        <pre className="text-sm text-slate-300 overflow-x-auto leading-relaxed">
                            {`{
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "choices": [
        {
          "id": 1,
          "text": "Option A",
          "correct": false,
          "explanation": "Why this is wrong..."
        },
        {
          "id": 2,
          "text": "Option B", 
          "correct": true,
          "explanation": "Why this is correct..."
        }
      ]${
          mode === "review"
              ? `,
      "user_answer": 2 // Required for review mode`
              : ""
      }
    }
  ]
}`}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
