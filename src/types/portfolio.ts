export type AppTheme = "light" | "dark";
export type AppMode = "dev" | "hr";

export interface PortfolioState {
  theme: AppTheme;
  mode: AppMode;
  contactOpen: boolean;
  setTheme: (theme: AppTheme) => void;
  setMode: (mode: AppMode) => void;
  setContactOpen: (open: boolean) => void;
}