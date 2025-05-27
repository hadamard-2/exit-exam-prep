import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from './App.tsx'
import QuizApp from "./QuizApp.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QuizApp />
    </StrictMode>
);
