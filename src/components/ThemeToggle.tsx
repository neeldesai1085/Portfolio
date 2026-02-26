import { usePortfolioStore } from "@/store/portfolioStore";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const { theme, setTheme, mode } = usePortfolioStore();
    const isDev = mode === "dev";

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className={`inline-flex items-center justify-center h-8 w-8 rounded-md transition-colors ${
                isDev
                    ? "text-terminal-text hover:bg-terminal-text/10"
                    : "text-foreground hover:bg-foreground/5"
            }`}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
            {theme === "light" ? (
                <Moon className="h-4 w-4" />
            ) : (
                <Sun className="h-4 w-4" />
            )}
        </button>
    );
}
