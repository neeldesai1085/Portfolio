import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import type { AppMode } from "@/types/portfolio";
import uiStrings from "@/data/uiStrings.json";
import profile from "@/data/profile.json";

interface Props {
    mode: AppMode;
    onComplete: () => void;
}

function HRIntro({ onComplete }: { onComplete: () => void }) {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase(1), 100),
            setTimeout(() => setPhase(2), 600),
            setTimeout(() => setPhase(3), 1200),
            setTimeout(() => setPhase(4), 1800),
            setTimeout(() => setPhase(5), 2400),
            setTimeout(onComplete, 4000),
        ];
        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-100 bg-background flex flex-col items-center justify-center overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
                {[
                    { x1: "10%", y1: "20%", x2: "40%", y2: "35%" },
                    { x1: "40%", y1: "35%", x2: "50%", y2: "50%" },
                    { x1: "50%", y1: "50%", x2: "75%", y2: "40%" },
                    { x1: "50%", y1: "50%", x2: "30%", y2: "70%" },
                    { x1: "50%", y1: "50%", x2: "70%", y2: "65%" },
                    { x1: "75%", y1: "40%", x2: "90%", y2: "25%" },
                    { x1: "30%", y1: "70%", x2: "20%", y2: "85%" },
                    { x1: "70%", y1: "65%", x2: "85%", y2: "80%" },
                ].map((line, i) => (
                    <line
                        key={i}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        strokeWidth="1"
                        className="stroke-primary transition-all duration-700"
                        style={{
                            opacity: phase >= 1 ? 0.15 : 0,
                            strokeDasharray: "500",
                            strokeDashoffset: phase >= 1 ? "0" : "500",
                            transition: `stroke-dashoffset 1.2s ease-out ${i * 0.1}s, opacity 0.5s ease-out`,
                        }}
                    />
                ))}
                {[
                    { cx: "10%", cy: "20%" },
                    { cx: "40%", cy: "35%" },
                    { cx: "50%", cy: "50%" },
                    { cx: "75%", cy: "40%" },
                    { cx: "30%", cy: "70%" },
                    { cx: "70%", cy: "65%" },
                    { cx: "90%", cy: "25%" },
                    { cx: "20%", cy: "85%" },
                    { cx: "85%", cy: "80%" },
                ].map((dot, i) => (
                    <circle
                        key={i}
                        cx={dot.cx}
                        cy={dot.cy}
                        r="4"
                        className="fill-primary transition-all duration-500"
                        style={{
                            opacity: phase >= 2 ? 0.3 : 0,
                            transform: phase >= 2 ? "scale(1)" : "scale(0)",
                            transformOrigin: `${dot.cx} ${dot.cy}`,
                            transition: `opacity 0.4s ease-out ${i * 0.08}s, transform 0.4s ease-out ${i * 0.08}s`,
                        }}
                    />
                ))}
            </svg>

            <div className="relative z-10 text-center space-y-4 px-6">
                <div
                    className="transition-all duration-700"
                    style={{
                        opacity: phase >= 2 ? 1 : 0,
                        transform:
                            phase >= 2
                                ? "translateY(0) scale(1)"
                                : "translateY(20px) scale(0.9)",
                    }}
                >
                    <div className="flex justify-center">
                        <Avatar className="h-32 w-32 rounded-full overflow-hidden mb-4">
                            <AvatarImage
                                src="/picture.png"
                                alt="Neel Desai"
                                className="h-full w-full rounded-full object-cover"
                            />
                            <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold rounded-full">
                                ND
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <h1
                    className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight transition-all duration-700"
                    style={{
                        opacity: phase >= 3 ? 1 : 0,
                        transform:
                            phase >= 3 ? "translateY(0)" : "translateY(15px)",
                    }}
                >
                    {profile.name}
                </h1>

                <p
                    className="text-primary text-lg font-medium transition-all duration-700"
                    style={{
                        opacity: phase >= 4 ? 1 : 0,
                        transform:
                            phase >= 4 ? "translateY(0)" : "translateY(10px)",
                    }}
                >
                    {profile.tagline}
                </p>

                <p
                    className="text-muted-foreground text-sm max-w-md mx-auto transition-all duration-700"
                    style={{
                        opacity: phase >= 5 ? 1 : 0,
                        transform:
                            phase >= 5 ? "translateY(0)" : "translateY(10px)",
                    }}
                >
                    {profile.shortDescription}
                </p>
            </div>
        </div>
    );
}

function DevIntro({ onComplete }: { onComplete: () => void }) {
    const [visibleLines, setVisibleLines] = useState(0);
    const bootLines = uiStrings.terminal.bootLines;

    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleLines((prev) => {
                if (prev >= bootLines.length) {
                    clearInterval(interval);
                    setTimeout(onComplete, 1400);
                    return prev;
                }
                return prev + 1;
            });
        }, 140);
        return () => clearInterval(interval);
    }, [onComplete, bootLines.length]);

    return (
        <div
            className="fixed inset-0 z-100 flex flex-col justify-center items-center font-mono p-6 bg-terminal-bg"
        >
            <div className="max-w-lg w-full space-y-1">
                {bootLines.slice(0, visibleLines).map((line, i) => (
                    <p
                        key={i}
                        className={`text-sm animate-fade-in ${
                            line.includes("✓")
                                ? "text-terminal-success"
                                : line.includes("ready") ||
                                    line.includes("help")
                                  ? "text-terminal-accent"
                                  : "text-terminal-text"
                        }`}
                    >
                        {line}
                    </p>
                ))}
                {visibleLines < bootLines.length && (
                    <span
                        className="inline-block w-2 h-4 animate-blink bg-terminal-accent"
                    />
                )}
            </div>
        </div>
    );
}

export default function ModeIntro({ mode, onComplete }: Props) {
    if (mode === "dev") {
        return <DevIntro onComplete={onComplete} />;
    }
    return <HRIntro onComplete={onComplete} />;
}
