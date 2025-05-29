import ModeSelector from "./components/ModeSelector";

const App = () => {
    return (
        <div className="h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
            <div className="max-w-2xl w-full mx-auto px-6">
                <>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4 text-slate-100">
                            Exit Exam Prep
                        </h1>
                        <p className="text-lg text-slate-400">
                            Choose your study mode to get started
                        </p>
                    </div>
                    <ModeSelector />
                </>
            </div>
        </div>
    );
};

export default App;
