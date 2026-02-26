import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { usePortfolioStore } from "./store/portfolioStore";
import "./App.css";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

function App() {
    const { theme, setTheme } = usePortfolioStore();
    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    useEffect(() => {
        if (!window.matchMedia) {
            return;
        }
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => setTheme(media.matches ? "dark" : "light");

        media.addEventListener?.("change", handleChange);

        return () => {
            media.removeEventListener?.("change", handleChange);
        };
    }, [setTheme]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
