export type AppTheme = "light" | "dark";
export type AppMode = "dev" | "hr";

export interface PortfolioState {
  theme: AppTheme;
  mode: AppMode;
  setTheme: (theme: AppTheme) => void;
  setMode: (mode: AppMode) => void;
}