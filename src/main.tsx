import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from './App.tsx'
// import QuizMode from "./QuizMode.tsx";
import ReviewMode from "./ReviewMode";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        {/* <QuizMode /> */}
        <ReviewMode />
    </StrictMode>
);
