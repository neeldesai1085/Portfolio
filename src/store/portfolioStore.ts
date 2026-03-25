import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppTheme, PortfolioState, AppMode } from "../types/portfolio";

function getSystemTheme(): AppTheme {
    if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
        return "dark";
    }
    return "light";
}

function getInitialMode(): AppMode {
    if (typeof window === "undefined") return "hr";

    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get("mode");

    if (modeParam === "dev" || modeParam === "hr") {
        return modeParam;
    }

    return "hr"; // default
}

export const usePortfolioStore = create<PortfolioState>()(
    persist(
        (set) => ({
            theme: getSystemTheme(),
            mode: getInitialMode(),
            contactOpen: false,
            outputs: [],
            modeTransition: true,
            setTheme: (theme: AppTheme) => set({ theme }),
            setMode: (mode: AppMode) =>
                set((state) =>
                    state.mode === mode
                        ? state
                        : { mode, modeTransition: true },
                ),
            setContactOpen: (open: boolean) => set({ contactOpen: open }),
            setOutputs: (outputs) => set({ outputs }),
            setModeTransition: (transition: boolean) => set({ modeTransition: transition }),
        }),
        {
            name: "portfolio-state",
            partialize: (state) => ({
                theme: state.theme,
                modeTransition: state.modeTransition,
            }),
        },
    ),
);
