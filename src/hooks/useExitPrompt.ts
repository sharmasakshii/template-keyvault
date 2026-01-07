import { useState, useEffect } from 'react';

const initBeforeUnLoad = (showExitPrompt: boolean) => {
    const handler = (event: BeforeUnloadEvent) => {
        if (!showExitPrompt) return;

        const confirmationMessage =
            "Are you sure you want to leave? Your changes may not be saved.";

        event.preventDefault(); // modern way

        return confirmationMessage;
    };

    window.addEventListener("beforeunload", handler);

    // Return cleanup in case you want to remove later
    return () => {
        window.removeEventListener("beforeunload", handler);
    };
};



// Hook
const useExitPrompt = (bool: any) => {
    const [showExitPrompt, setShowExitPrompt] = useState(bool);

    window.onload = () => {
        initBeforeUnLoad(showExitPrompt);
    };

    useEffect(() => {
        initBeforeUnLoad(showExitPrompt);
    }, [showExitPrompt]);

    return [showExitPrompt, setShowExitPrompt];
}

export default useExitPrompt