import { useEffect } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";
import ProfileHeader from "@/components/ProfileHeader";
import ContactForm from "@/components/ContactForm";
import Terminal from "@/components/dev/Terminal";
import HRMode from "@/components/hr/HRMode";

const Index = () => {
    const { mode, theme, setMode, modeTransition, setModeTransition } = usePortfolioStore();

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

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <ProfileHeader />
            <main className="flex-1 overflow-hidden">
                <div key={mode} className="h-full animate-fade-in">
                    {/* {mode === "dev" ? <Terminal /> : <HRMode />} */}
                    <HRMode />
                </div>
            </main>
            <ContactForm />
        </div>
    );
}

export default Index;