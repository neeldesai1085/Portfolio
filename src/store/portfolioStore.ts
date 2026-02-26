import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppTheme, PortfolioState, AppMode } from "../types/portfolio";

function getSystemTheme(): AppTheme {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
    }
    return "light";
}

export const usePortfolioStore = create<PortfolioState>() (
    persist(
        (set) => ({
            theme: getSystemTheme(),
            mode: 'hr',
            setTheme: (theme: AppTheme) => set({ theme }),
            setMode: (mode: AppMode) => set({ mode }),
        }),
        {
            name: "portfolio-state",
            partialize: (state) => ({
                theme: state.theme
            })
        }
    )
)