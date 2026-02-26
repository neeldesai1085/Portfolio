import { usePortfolioStore } from "@/store/portfolioStore";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "@/assets/image.png"
import profile from "@/data/profile.json";
import { useEffect, useState } from "react";

function RotatingDesignation() {
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % profile.designations.length);
                setFade(true);
            }, 300);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <span className="text-xs transition-opacity duration-300" style={{ opacity: fade ? 1 : 0 }}>
            {profile.designations[index]}
        </span>
    );
}

export default function ProfileHeader() {
    const { mode, setMode } = usePortfolioStore();
    const isDev = mode === "dev";

    return (
      <header
        className={`flex items-center justify-between px-3 sm:px-5 py-2.5 border-b shrink-0 
        ${
          isDev
            ? "bg-terminal-surface border-terminal-border text-terminal-text"
            : "bg-card border-border text-card-foreground"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-8 w-8 shrink-0 rounded-full overflow-hidden">
                <AvatarImage src={Image} alt={profile.name} className="object-cover" />
                <AvatarFallback className={isDev ? 
                "bg-terminal-accent/20 text-terminal-accent text-xs"
                : "bg-primary/10 text-primary text-xs"}>
                    ND
                </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
                <h1 className="text-sm font-semibold truncate">{profile.name}</h1>
                <div className={isDev ? 'text-terminal-muted' : 'text-muted-foreground'}>
                    <RotatingDesignation />
                </div>
            </div>
        </div>
      </header>
    );
}