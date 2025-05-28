import type { QuizData } from "../types/quiz";

export const quizData: QuizData = {
    questions: [
        {
            id: 1,
            question:
                "What will this Python code output?\n```python\nfor i in range(3):\n    print(i * 2)\n```",
            choices: [
                {
                    text: "0, 1, 2",
                    correct: false,
                    explanation:
                        "This would be the output of `range(3)` without multiplication. The code multiplies each value by 2.",
                },
                {
                    text: "0, 2, 4",
                    correct: true,
                    explanation:
                        "Correct! The loop iterates through 0, 1, 2 and multiplies each by 2, giving 0, 2, 4.",
                },
                {
                    text: "2, 4, 6",
                    correct: false,
                    explanation:
                        "This would be correct if the range started at 1, but `range(3)` starts at 0.",
                },
            ],
        },
        {
            id: 2,
            question:
                "In C++, what is the time complexity of inserting an element at the beginning of a std::vector?",
            choices: [
                {
                    text: "O(1)",
                    correct: false,
                    explanation:
                        "O(1) would be constant time, but inserting at the beginning requires shifting all existing elements.",
                },
                {
                    text: "O(n)",
                    correct: true,
                    explanation:
                        "Correct! Inserting at the beginning of a vector requires shifting all n existing elements, making it O(n).",
                },
                {
                    text: "O(log n)",
                    correct: false,
                    explanation:
                        "O(log n) is typical for balanced tree operations, not vector insertions at the beginning.",
                },
            ],
        },
        {
            id: 3,
            question:
                "What will this JavaScript code log to the console?\n```javascript\nlet arr = [1, 2, 3];\narr.push(arr.length);\nconsole.log(arr);\n```",
            choices: [
                {
                    text: "[1, 2, 3, 3]",
                    correct: true,
                    explanation:
                        "Correct! `arr.length` is 3 before the push operation, so 3 gets added to the array.",
                },
                {
                    text: "[1, 2, 3, 4]",
                    correct: false,
                    explanation:
                        "This would be true if we pushed `arr.length + 1`, but we're pushing the current length (3).",
                },
                {
                    text: "[1, 2, 3, [1, 2, 3]]",
                    correct: false,
                    explanation:
                        "We're pushing `arr.length` (which is 3), not the array itself.",
                },
            ],
        },
        {
            id: 4,
            question:
                "Which sorting algorithm has the best average-case time complexity?",
            choices: [
                {
                    text: "Bubble Sort",
                    correct: false,
                    explanation:
                        "Bubble Sort has O(n²) average-case complexity, which is quite poor for large datasets.",
                },
                {
                    text: "Quick Sort",
                    correct: true,
                    explanation:
                        "Correct! Quick Sort has O(n log n) average-case complexity, making it one of the most efficient general-purpose sorting algorithms.",
                },
                {
                    text: "Selection Sort",
                    correct: false,
                    explanation:
                        "Selection Sort has O(n²) complexity in all cases, making it inefficient for large datasets.",
                },
            ],
        },
        {
            id: 5,
            question:
                'What will this Java code output?\n```java\nString s1 = "Hello";\nString s2 = "Hello";\nString s3 = new String("Hello");\nSystem.out.println(s1 == s2);\nSystem.out.println(s1 == s3);\n```',
            choices: [
                {
                    text: "```txt\ntrue\nfalse```",
                    correct: true,
                    explanation:
                        "Correct! String literals are interned, so s1 == s2 is true. But s3 is a new object, so s1 == s3 is false.",
                },
                {
                    text: "```txt\nfalse\ntrue```",
                    correct: false,
                    explanation:
                        "This is backwards. String literals share references, but `new String()` creates a new object.",
                },
                {
                    text: "```txt\ntrue\ntrue```",
                    correct: false,
                    explanation:
                        "While s1 == s2 is true due to string interning, s3 is a new object with a different reference.",
                },
            ],
        },
    ],
};
