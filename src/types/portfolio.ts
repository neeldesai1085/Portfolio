import type { ReactNode } from "react";

export type AppTheme = "light" | "dark";
export type AppMode = "dev" | "hr";

export interface OutputEntry {
    type: "command" | "error" | "info";
    content: ReactNode;
}

export interface PortfolioState {
    theme: AppTheme;
    mode: AppMode;
    contactOpen: boolean;
    outputs: OutputEntry[];
    setTheme: (theme: AppTheme) => void;
    setMode: (mode: AppMode) => void;
    setContactOpen: (open: boolean) => void;
    setOutputs: (outputs: OutputEntry[]) => void;
}
