import type { NodeType } from "./GraphCanvas";
import { X, ExternalLink, Github } from "lucide-react";

interface Props {
    type: NodeType | null;
    data: any;
    onClose: () => void;
}

export default function GraphOverlay({ type, data, onClose }: Props) {
    if (!type || !data) return null;

    return (
        <>
            <div
                className="absolute inset-0 z-40 bg-background/40 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            <div className="absolute inset-x-0 bottom-0 z-50 animate-fade-in-up">
                <div className="w-full bg-card border-t border-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] flex flex-col max-h-[75vh] min-h-[40vh] overflow-hidden rounded-t-3xl">
                    <div className="flex items-center justify-between p-4 md:px-6 md:py-4 border-b border-border bg-muted/20">
                        <h3 className="text-base md:text-lg font-bold text-foreground">
                            {type === "root"
                                ? data.name
                                : type === "project"
                                  ? data.title
                                  : type === "skill"
                                    ? data.name
                                    : type === "summary"
                                      ? data.title
                                      : "Details"}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-4 md:px-6 md:py-5 overflow-y-auto w-full custom-scrollbar">
                        {type === "root" && (
                            <div className="space-y-4 text-sm text-card-foreground">
                                <div>
                                    <p className="font-semibold text-primary">
                                        {data.role}
                                    </p>
                                    <p className="text-muted-foreground mt-0.5">
                                        {data.tagline}
                                    </p>
                                </div>
                                <p className="leading-relaxed opacity-90 border-l-2 border-primary/50 pl-3 py-1">
                                    {data.longDescription}
                                </p>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                                    {data.highlights?.map(
                                        (h: any, i: number) => (
                                            <div
                                                key={i}
                                                className="bg-muted/40 p-3 rounded-xl border border-border/50 flex flex-col items-center justify-center text-center hover:bg-muted/80 transition-colors"
                                            >
                                                <div className="font-bold text-primary text-xl">
                                                    {h.value}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1 font-medium">
                                                    {h.label}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
                                    {data.social?.github && (
                                        <a
                                            href={data.social.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 border border-border px-3 py-1.5 rounded-lg font-medium hover:bg-muted transition-colors"
                                        >
                                            <Github size={16} /> GitHub
                                        </a>
                                    )}
                                    {data.social?.linkedin && (
                                        <a
                                            href={data.social.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 border border-border px-3 py-1.5 rounded-lg font-medium hover:bg-muted transition-colors"
                                        >
                                            <ExternalLink size={16} /> LinkedIn
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {type === "project" && (
                            <div className="space-y-4 text-sm text-card-foreground">
                                <p className="leading-relaxed opacity-95">
                                    {data.detailedDescription}
                                </p>

                                {data.stack && data.stack.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-semibold mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                                            Tech Stack
                                        </h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {data.stack.map(
                                                (s: string, i: number) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-medium"
                                                    >
                                                        {s}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                                {data.architectureNotes && (
                                    <div className="mt-4 p-4 bg-muted/40 rounded-xl border border-border/50">
                                        <h4 className="font-semibold mb-1 text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                            Architecture Notes
                                        </h4>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {data.architectureNotes}
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-2 pt-4">
                                    {data.githubLink &&
                                        data.githubLink !== "#" && (
                                            <a
                                                href={data.githubLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                                            >
                                                <Github size={16} /> View Source
                                            </a>
                                        )}
                                </div>
                            </div>
                        )}

                        {type === "skill" && (
                            <div className="space-y-4 text-sm text-card-foreground">
                                <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                                            Proficiency Level
                                        </span>
                                        <span className="text-primary font-bold">
                                            {data.proficiencyLevel}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                                            style={{
                                                width: `${data.proficiencyLevel}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <p className="leading-relaxed opacity-95">
                                    {data.description}
                                </p>

                                {data.relatedProjects?.length > 0 && (
                                    <div className="pt-4">
                                        <h4 className="font-semibold text-xs mb-2 uppercase tracking-wider text-muted-foreground">
                                            Related Projects
                                        </h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {data.relatedProjects.map(
                                                (p: string, i: number) => (
                                                    <span
                                                        key={i}
                                                        className="px-2.5 py-1 bg-muted rounded text-xs font-medium border border-border"
                                                    >
                                                        {p}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {type === "summary" && (
                            <div className="space-y-4 text-sm text-card-foreground">
                                <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                                    <div className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded font-mono font-bold text-xs">
                                        {data.versionTag}
                                    </div>
                                    <div className="text-muted-foreground font-semibold flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                                        {data.time}
                                    </div>
                                </div>

                                <p className="leading-relaxed opacity-95 text-base">
                                    {data.description}
                                </p>

                                <div className="pt-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-semibold bg-muted text-muted-foreground uppercase tracking-wider">
                                        {data.type} phase
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
