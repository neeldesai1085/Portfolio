import { usePortfolioStore } from "@/store/portfolioStore";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import profile from "@/data/profile.json";
import { useRef } from "react";
import { Link } from "react-router";
import { Download, Network, Terminal } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import RotatingDesignation from "./RotatingDesignation";

export default function ProfileHeader() {
    const { mode, setMode } = usePortfolioStore();
    const isDev = mode === "dev";
    const devBtnRef = useRef<HTMLButtonElement | null>(null);

    return (
        <header
            className={`flex items-center justify-between px-3 sm:px-5 py-2.5 border-b shrink-0 
            ${
                isDev
                    ? "bg-terminal-surface border-terminal-border text-terminal-text"
                    : "bg-card border-border text-card-foreground"
            }`}
        >
            <Link to="/" className="block no-underline text-inherit">
                <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-8 w-8 shrink-0 rounded-full overflow-hidden">
                        <AvatarImage
                            src={profile.picture}
                            alt={profile.name}
                            className="object-cover"
                        />
                        <AvatarFallback
                            className={
                                isDev
                                    ? "bg-terminal-accent/20 text-terminal-accent text-xs"
                                    : "bg-primary/10 text-primary text-xs"
                            }
                        >
                            ND
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <h1 className="text-sm font-semibold truncate text-left">
                            {profile.name}
                        </h1>
                        <div
                            className={`text-left ${
                                isDev
                                    ? "text-terminal-muted"
                                    : "text-muted-foreground"
                            }`}
                        >
                            <RotatingDesignation />
                        </div>
                    </div>
                </div>
            </Link>

            <div className="flex items-center gap-1.5 sm:gap-2">
                <a
                    href={profile.resume}
                    download
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        isDev
                            ? "bg-terminal-accent/15 text-terminal-accent hover:bg-terminal-accent/25"
                            : "bg-primary/10 text-primary hover:bg-primary/20"
                    }`}
                >
                    <Download className="h-3 w-3" />
                    <span className="sm:inline">Resume</span>
                </a>

                <ThemeToggle />

                <div className="relative">
                    <button
                        ref={devBtnRef}
                        onClick={() => setMode(isDev ? "hr" : "dev")}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                            isDev
                                ? "bg-terminal-text/10 text-terminal-text hover:bg-terminal-text/20"
                                : "bg-foreground/5 text-foreground hover:bg-foreground/10"
                        }`}
                    >
                        {isDev ? (
                            <Network className="h-3 w-3" />
                        ) : (
                            <Terminal className="h-3 w-3" />
                        )}
                        <span className="sm:inline">
                            {isDev ? "HR Mode" : "Dev Mode"}
                        </span>
                    </button>
                    {!isDev && (
                        <span className="absolute left-0 bottom-0 translate-y-3 text-[10px] text-primary/80 italic">
                            only for developers
                        </span>
                    )}
                </div>
            </div>
        </header>
    );
}
