import { useEffect } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";
import ProfileHeader from "@/components/ProfileHeader";
import ContactForm from "@/components/ContactForm";
import Terminal from "@/components/dev/Terminal";
import HRMode from "@/components/hr/HRMode";
import ModeIntro from "@/components/ModeIntro";

const Index = () => {
    const { mode, modeTransition, setModeTransition } = usePortfolioStore();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const current = params.get("mode");

        if (current !== mode) {
            params.set("mode", mode);
            window.history.replaceState(
                null,
                "",
                `${window.location.pathname}?${params.toString()}`,
            );
        }
    }, [mode]);

    if (modeTransition) {
        return (
            <ModeIntro  
                mode={mode}
                onComplete={() => setModeTransition(false)}
            />
        );
    }

    return (
        <div className="h-dvh flex flex-col overflow-hidden">
            <ProfileHeader />
            <main className="flex-1 overflow-hidden">
                <div key={mode} className="h-full animate-fade-in">
                    {mode === "dev" ? <Terminal /> : <HRMode />}
                </div>
            </main>
            <ContactForm />
        </div>
    );
}

export default Index;