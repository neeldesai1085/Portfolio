import { ChevronDown, Download, Github, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import profile from "@/data/profile.json";
import uiStrings from "@/data/uiStrings.json";
import RotatingDesignation from "@/components/RotatingDesignation";

export default function HRMode({ onScrollToGraph }: Props) {
    return (
        <section className="min-h-[calc(100vh-52px)] flex flex-col items-center justify-center px-6 py-12 bg-background relative overflow-hidden">
            <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                aria-hidden="true"
            >
                <ChevronDown
                    className="h-64 sm:h-80 w-64 sm:w-80 text-muted-foreground/4 animate-bounce"
                    style={{ animationDuration: "3s" }}
                />
            </div>

            <div className="relative z-10 max-w-2xl w-full text-center space-y-6">
                <div className="flex justify-center">
                    <Avatar className="h-32 w-32 rounded-full overflow-hidden">
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

                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                        {profile.name}
                    </h1>
                    <p className="text-lg sm:text-xl text-primary mt-2 font-medium">
                        <RotatingDesignation />
                    </p>
                </div>

                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
                    {profile.longDescription}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 mx-auto">
                    {profile.highlights.map((h) => (
                        <div
                            key={h.label}
                            className="bg-card border border-border rounded-xl p-4 text-center"
                        >
                            <div className="text-xl sm:text-2xl font-bold text-primary">
                                {h.value}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                {h.label}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-center gap-3 pt-4 flex-wrap">
                    <a
                        href="/resume.pdf"
                        download
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                        <Download className="h-4 w-4" />
                        Download Resume
                    </a>
                    {profile.social.github && (
                        <a
                            href={profile.social.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors"
                        >
                            <Github className="h-4 w-4" /> GitHub
                        </a>
                    )}
                    {profile.social.linkedin && (
                        <a
                            href={profile.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors"
                        >
                            <ExternalLink className="h-4 w-4" /> LinkedIn
                        </a>
                    )}
                </div>
            </div>

            <button
                onClick={onScrollToGraph}
                className="relative z-10 mt-12 flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors animate-bounce"
                aria-label="Scroll to graph"
            >
                <span className="text-xs">
                    {uiStrings.hrMode.sections.exploreTitle}
                </span>
                <ChevronDown className="h-5 w-5" />
            </button>
        </section>
    );
}
