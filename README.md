# Exit Exam Prep

A web app for practicing and reviewing multiple-choice questions with instant feedback and explanations.

## Features

-   Quiz Mode: Test your knowledge with instant scoring and explanations.
-   Review Mode: Study questions at your own pace with AI chat assistance.
-   Supports custom question sets via JSON file upload.

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or newer recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/hadamard-2/exit-exam-prep.git
    cd exit-exam-prep
    ```
2. **Install dependencies:**
    ```
    npm install
    ```

    Running the App in Development
    ```
    npm run dev
    ```

    Open http://localhost:5173 in your browser.

    Building for Production
    ```
    npm run build
    ```

    To preview the production build:
    ```
    npm run preview
    ```

### Usage

1. Start the app and choose a mode (Quiz or Review).
2. Upload a JSON file containing your question set (see format below).
3. Begin practicing or reviewing questions.
   
   JSON File Format
    ```
    {
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
        ]
        }
    ]
    }
    ```

    For Review Mode, each question should also include a `user_answer` field.
