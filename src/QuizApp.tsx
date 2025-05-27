import React, { useState } from 'react';
import { Check, X, ArrowRight, ArrowLeft, Play } from 'lucide-react';

// Sample quiz data with CS questions
const quizData = {
  "questions": [
    {
      "id": 1,
      "question": "What will this Python code output?\n\n```python\nfor i in range(3):\n    print(i * 2)\n```",
      "choices": [
        {
          "text": "0, 1, 2",
          "correct": false,
          "explanation": "This would be the output of `range(3)` without multiplication. The code multiplies each value by 2."
        },
        {
          "text": "0, 2, 4",
          "correct": true,
          "explanation": "Correct! The loop iterates through 0, 1, 2 and multiplies each by 2, giving 0, 2, 4."
        },
        {
          "text": "2, 4, 6",
          "correct": false,
          "explanation": "This would be correct if the range started at 1, but `range(3)` starts at 0."
        }
      ]
    },
    {
      "id": 2,
      "question": "In C++, what is the time complexity of inserting an element at the beginning of a `std::vector`?",
      "choices": [
        {
          "text": "O(1)",
          "correct": false,
          "explanation": "O(1) would be constant time, but inserting at the beginning requires shifting all existing elements."
        },
        {
          "text": "O(n)",
          "correct": true,
          "explanation": "Correct! Inserting at the beginning of a vector requires shifting all n existing elements, making it O(n)."
        },
        {
          "text": "O(log n)",
          "correct": false,
          "explanation": "O(log n) is typical for balanced tree operations, not vector insertions at the beginning."
        }
      ]
    },
    {
      "id": 3,
      "question": "What will this JavaScript code log to the console?\n\n```javascript\nlet arr = [1, 2, 3];\narr.push(arr.length);\nconsole.log(arr);\n```",
      "choices": [
        {
          "text": "[1, 2, 3, 3]",
          "correct": true,
          "explanation": "Correct! `arr.length` is 3 before the push operation, so 3 gets added to the array."
        },
        {
          "text": "[1, 2, 3, 4]",
          "correct": false,
          "explanation": "This would be true if we pushed `arr.length + 1`, but we're pushing the current length (3)."
        },
        {
          "text": "[1, 2, 3, [1, 2, 3]]",
          "correct": false,
          "explanation": "We're pushing `arr.length` (which is 3), not the array itself."
        }
      ]
    },
    {
      "id": 4,
      "question": "Which sorting algorithm has the best average-case time complexity?",
      "choices": [
        {
          "text": "Bubble Sort",
          "correct": false,
          "explanation": "Bubble Sort has O(n²) average-case complexity, which is quite poor for large datasets."
        },
        {
          "text": "Quick Sort",
          "correct": true,
          "explanation": "Correct! Quick Sort has O(n log n) average-case complexity, making it one of the most efficient general-purpose sorting algorithms."
        },
        {
          "text": "Selection Sort",
          "correct": false,
          "explanation": "Selection Sort has O(n²) complexity in all cases, making it inefficient for large datasets."
        }
      ]
    },
    {
      "id": 5,
      "question": "What will this Java code output?\n\n```java\nString s1 = \"Hello\";\nString s2 = \"Hello\";\nString s3 = new String(\"Hello\");\nSystem.out.println(s1 == s2);\nSystem.out.println(s1 == s3);\n```",
      "choices": [
        {
          "text": "true\\nfalse",
          "correct": true,
          "explanation": "Correct! String literals are interned, so s1 == s2 is true. But s3 is a new object, so s1 == s3 is false."
        },
        {
          "text": "false\\ntrue",
          "correct": false,
          "explanation": "This is backwards. String literals share references, but `new String()` creates a new object."
        },
        {
          "text": "true\\ntrue",
          "correct": false,
          "explanation": "While s1 == s2 is true due to string interning, s3 is a new object with a different reference."
        }
      ]
    }
  ]
};



// Markdown parser for code blocks
const parseMarkdown = (text: string) => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  
  return text.split(codeBlockRegex).map((part, index) => {
    if (index % 3 === 0) {
      // Regular text
      return part.split('\n').map((line, lineIndex) => (
        <React.Fragment key={lineIndex}>
          {line}
          {lineIndex < part.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
    } else if (index % 3 === 1) {
      // Language identifier
      return null;
    } else {
      // Code content
      return (
        <div key={index} className="bg-slate-900 border border-slate-700 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto">
          <pre className="whitespace-pre-wrap">{part.trim()}</pre>
        </div>
      );
    }
  });
};

const QuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: number]: number }>({});
  const [showExplanations, setShowExplanations] = useState<{ [questionId: number]: boolean }>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const questions = quizData.questions;
  const totalQuestions = questions.length;

  const handleAnswerSelect = (questionId: number, choiceIndex: number) => {
    const newSelectedAnswers = {
      ...selectedAnswers,
      [questionId]: choiceIndex
    };
    setSelectedAnswers(newSelectedAnswers);
    
    // Show explanations after selection
    setShowExplanations({
      ...showExplanations,
      [questionId]: true
    });
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach(question => {
      const selectedIndex = selectedAnswers[question.id];
      if (selectedIndex !== undefined && question.choices[selectedIndex].correct) {
        correctAnswers++;
      }
    });
    return correctAnswers;
  };

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
      const finalScore = calculateScore();
      setScore(finalScore);
      setQuizCompleted(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowExplanations({});
    setQuizCompleted(false);
    setScore(0);
  };

  if (quizCompleted) {
    const percentage = Math.round((score / totalQuestions) * 100);
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-100 mb-8">Quiz Complete!</h1>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-12 shadow-2xl">
              <div className="text-6xl font-bold text-emerald-400 mb-4">
                {score}/{totalQuestions}
              </div>
              <div className="text-2xl text-slate-300 mb-2">
                You scored {percentage}%
              </div>
              <div className="text-slate-400 mb-8">
                {percentage >= 80 ? "Excellent work! 🎉" : 
                 percentage >= 60 ? "Good job! 👍" : 
                 "Keep practicing! 📚"}
              </div>
              <button
                onClick={resetQuiz}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
              >
                <Play className="h-5 w-5" />
                Take Quiz Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[question.id];
  const showExplanation = showExplanations[question.id];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Computer Science Quiz</h1>
          <div className="text-slate-400">
            Question {currentQuestion + 1} of {totalQuestions}
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-4">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl mb-8">
          <div className="text-xl font-semibold text-slate-100 mb-6 leading-relaxed">
            {parseMarkdown(question.question)}
          </div>

          {/* Answer Choices */}
          <div className="space-y-4">
            {question.choices.map((choice, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = choice.correct;
              const showResult = showExplanation && isSelected;
              
              return (
                <div key={index} className="space-y-3">
                  <button
                    onClick={() => handleAnswerSelect(question.id, index)}
                    disabled={showExplanation}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected && showResult
                        ? isCorrect
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-100'
                          : 'border-red-500 bg-red-500/10 text-red-100'
                        : isSelected
                        ? 'border-emerald-500 bg-emerald-500/5'
                        : 'border-slate-600 bg-slate-800 hover:border-slate-500 hover:bg-slate-700'
                    } ${showExplanation ? 'cursor-default' : 'cursor-pointer hover:scale-[1.01]'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected && showResult
                          ? isCorrect
                            ? 'border-emerald-500 bg-emerald-500'
                            : 'border-red-500 bg-red-500'
                          : isSelected
                          ? 'border-emerald-500 bg-emerald-500'
                          : 'border-slate-500'
                      }`}>
                        {isSelected && showResult && (
                          isCorrect ? (
                            <Check className="h-4 w-4 text-white" />
                          ) : (
                            <X className="h-4 w-4 text-white" />
                          )
                        )}
                      </div>
                      <span className="font-medium">{choice.text}</span>
                    </div>
                  </button>

                  {/* Explanation */}
                  {showExplanation && isSelected && (
                    <div className={`p-4 border-l-4 ${
                      isCorrect
                        ? 'border-emerald-500 bg-emerald-500/5 text-emerald-100'
                        : 'border-red-500 bg-red-500/5 text-red-100'
                    }`}>
                      <div className="text-sm font-medium mb-1">
                        {isCorrect ? 'Correct!' : 'Incorrect'}
                      </div>
                      <div className="text-sm opacity-90">
                        {parseMarkdown(choice.explanation)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              currentQuestion === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-100 hover:scale-105'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
            Previous
          </button>

          <div className="text-slate-400 text-sm">
            {selectedAnswer !== undefined ? 'Answer selected' : 'Select an answer to continue'}
          </div>

          <button
            onClick={nextQuestion}
            disabled={selectedAnswer === undefined}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              selectedAnswer === undefined
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-105 shadow-lg'
            }`}
          >
            {currentQuestion === totalQuestions - 1 ? 'Finish Quiz' : 'Next'}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;