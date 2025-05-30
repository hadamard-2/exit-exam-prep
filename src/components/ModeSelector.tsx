import { CircleCheck, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";

type ModeCardProps = {
    to: string;
    icon: React.ReactNode;
    bgColor: string;
    title: string;
    description: string;
    features: string[];
};

function ModeCard({
    to,
    icon,
    bgColor,
    title,
    description,
    features,
}: ModeCardProps) {
    return (
        <Link to={to}>
            <div className="bg-slate-900 border-1 border-slate-700 rounded-lg p-8 cursor-pointer group h-full">
                <div className="text-center">
                    <div
                        className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4 transition-colors`}
                    >
                        {icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-slate-100">
                        {title}
                    </h3>
                    <p className="text-slate-400 mb-4">{description}</p>
                    <ul className="text-sm text-slate-500 space-y-1">
                        {features.map((feature, idx) => (
                            <li key={idx}>• {feature}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </Link>
    );
}

export default function ModeSelector() {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            <ModeCard
                to="/file-upload/quiz"
                icon={<CircleCheck className="h-8 w-8" />}
                bgColor="bg-blue-500"
                title="Quiz Mode"
                description="Test your knowledge with questions and instant feedback"
                features={[
                    "Multiple choice questions",
                    "Immediate scoring",
                    "Answer explanations",
                    "Progress tracking",
                ]}
            />
            <ModeCard
                to="/file-upload/review"
                icon={<Bot className="h-8 w-8" />}
                bgColor="bg-green-500"
                title="Review Mode"
                description="Study questions at your own pace with AI assistance"
                features={[
                    "Browse all questions",
                    "AI chat assistance",
                    "No time pressure",
                    "Detailed explanations",
                ]}
            />
        </div>
    );
}
