import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import FileUpload from "./FileUpload";
import QuizMode from "./QuizMode";
import ReviewMode from "./ReviewMode";

const router = createBrowserRouter([
    { path: "/", element: <App /> },
    {
        path: "/file-upload/:mode",
        element: <FileUpload />,
    },
    { path: "/quiz", element: <QuizMode /> },
    { path: "/review", element: <ReviewMode /> },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
