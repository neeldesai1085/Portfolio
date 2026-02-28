import { useEffect, useRef, useState } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";
import uiStrings from "@/data/uiStrings.json";
import commandsData from "@/data/commands.json";
import projects from "@/data/projects.json";
import profile from "@/data/profile.json";
import skills from "@/data/skills.json";
import timeline from "@/data/timeline.json";

interface OutputEntry {
    type: "command" | "error" | "info";
    content: React.ReactNode;
}

export interface CommandResult {
    type: "success" | "error" | "info" | "clear" | "mode-switch" | "contact";
    content: React.ReactNode;
}

export default function Terminal() {
    const { setMode, setTheme, setContactOpen } = usePortfolioStore();

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<string[]>([]);
    const [historyIdx, setHistoryIdx] = useState(-1);
    const [suggestionIdx, setSuggestionIdx] = useState(-1);
    const [outputs, setOutputs] = useState<OutputEntry[]>([
        {
            type: "info",
            content: (
                <span>
                    {uiStrings.terminal.welcomeMessage.split("help")[0]}
                    <span className="text-terminal-accent">help</span>
                    {uiStrings.terminal.welcomeMessage.split("help")[1]}
                </span>
            ),
        },
    ]);
    const inputRef = useRef<HTMLInputElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        outputRef.current?.scrollTo(0, outputRef.current.scrollHeight);
    }, [outputs]);

    const getAutocompleteSuggestions = (input: string): string[] => {
        const lower = input.toLowerCase().trim();
        if (!lower) return [];

        const spaceIdx = lower.indexOf(" ");
        if (spaceIdx > 0) {
            const cmd = lower.slice(0, spaceIdx);
            const partial = lower.slice(spaceIdx + 1);

            const cmdDef = commandsData.commands.find((c) => c.name === cmd);
            if (
                cmdDef &&
                "subcommands" in cmdDef &&
                Array.isArray(cmdDef.subcommands)
            ) {
                const subs = cmdDef.subcommands as string[];
                return subs
                    .filter((s) => s.startsWith(partial))
                    .map((s) => `${cmd} ${s}`);
            }

            if (cmd === "open") {
                const tokens = partial.trim().split(/\s+/).filter(Boolean);
                const taken = tokens.slice(0, -1);
                const last = tokens.length > 0 ? tokens[tokens.length - 1] : "";
                return projects.items
                    .filter(
                        (p) => p.id.startsWith(last) && !taken.includes(p.id),
                    )
                    .map((p) => `open ${[...taken, p.id].join(" ")}`);
            }

            return [];
        }

        return commandsData.commands
            .map((c) => c.name)
            .filter((c) => c.startsWith(lower));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            if (history.length === 0) return;
            const newIdx =
                historyIdx === -1
                    ? history.length - 1
                    : Math.max(0, historyIdx - 1);
            setHistoryIdx(newIdx);
            setInput(history[newIdx]);
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIdx === -1) return;
            const newIdx = historyIdx + 1;
            if (newIdx >= history.length) {
                setHistoryIdx(-1);
                setInput("");
            } else {
                setHistoryIdx(newIdx);
                setInput(history[newIdx]);
            }
        } else if (e.key === "Tab") {
            e.preventDefault();
            if (suggestions.length === 0) return;
            if (suggestions.length === 1) {
                const completed = suggestions[0];
                setInput(completed.includes(" ") ? completed : completed + " ");
                setSuggestions([]);
            } else {
                const nextIdx =
                    suggestionIdx === -1
                        ? 0
                        : (suggestionIdx + 1) % suggestions.length;
                const nextValue = suggestions[nextIdx];
                setSuggestionIdx(nextIdx);
                setInput(nextValue.includes(" ") ? nextValue : nextValue + " ");
            }
        }
    };

    const renderers: Record<string, (args: string[]) => CommandResult> = {
        help: () => ({
            type: "info",
            content: (
                <div className="space-y-1">
                    <p className="terminal-accent font-semibold mb-2">
                        Available Commands:
                    </p>
                    {commandsData.commands.map((c) => (
                        <div key={c.name} className="flex gap-4">
                            <span className="text-terminal-accent w-32 shrink-0 font-mono text-base">
                                {c.usage}
                            </span>
                            <span className="text-base opacity-70">
                                {c.description}
                            </span>
                        </div>
                    ))}
                </div>
            ),
        }),

        about: () => ({
            type: "success",
            content: (
                <div className="space-y-2">
                    <p className="text-terminal-accent text-xl font-semibold">
                        {profile.name}
                    </p>
                    <p className="text-base opacity-80">
                        {profile.role} · {profile.tagline}
                    </p>
                    <p className="text-base mt-2">{profile.longDescription}</p>
                    <div className="flex flex-wrap gap-4 mt-3 text-base opacity-70">
                        <span>📧 {profile.contact.email}</span>
                        <span>📱 {profile.contact.phone}</span>
                        <span>🌐 {profile.contact.linkedin}</span>
                        <span>📍 {profile.contact.location}</span>
                    </div>
                </div>
            ),
        }),

        projects: () => ({
            type: "success",
            content: (
                <div className="space-y-3">
                    <p className="text-terminal-accent font-semibold">
                        Projects ({projects.items.length})
                    </p>
                    {projects.items.map((p) => (
                        <div
                            key={p.id}
                            className="border-l-2 border-current pl-3 opacity-80"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-terminal-accent font-mono text-base">
                                    {p.id}
                                </span>
                                {p.featured && (
                                    <span className="text-base px-1.5 py-0.5 rounded bg-current/10">
                                        ★ featured
                                    </span>
                                )}
                            </div>
                            <p className="text-base font-medium">{p.title}</p>
                            <p className="text-sm opacity-60">
                                {p.shortDescription}
                            </p>
                        </div>
                    ))}
                    <p className="text-sm opacity-50 mt-2">
                        Use `open &lt;id&gt;` to view details
                    </p>
                </div>
            ),
        }),

        open: (args) => {
            const uniqueIds = args.filter(
                (id, idx) => args.indexOf(id) === idx,
            );
            const invalidIds = uniqueIds.filter(
                (id) => !projects.items.some((p) => p.id === id),
            );

            if (invalidIds.length > 0) {
                return {
                    type: "error",
                    content: (
                        <span>
                            Project not found: "{invalidIds.join(", ")}". Type{" "}
                            <span className="text-terminal-accent">
                                projects
                            </span>{" "}
                            to list available items.
                        </span>
                    ),
                };
            }

            return {
                type: "success",
                content: (
                    <div className="space-y-4">
                        {uniqueIds.map((projectId) => {
                            const project = projects.items.find(
                                (p) => p.id === projectId,
                            );
                            if (!project) return null;
                            return (
                                <div key={projectId} className="space-y-2">
                                    <p className="text-terminal-accent text-xl font-semibold">
                                        {project.title}
                                    </p>
                                    <p className="text-base">
                                        {project.detailedDescription}
                                    </p>
                                    <div className="mt-2">
                                        <p className="text-sm text-terminal-accent mb-1">
                                            Stack:
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {project.stack.map((t) => (
                                                <span
                                                    key={t}
                                                    className="text-sm px-2 py-0.5 rounded border border-current/20"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-base mt-2">
                                        <span className="opacity-60">
                                            Architecture:
                                        </span>{" "}
                                        {project.architectureNotes}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                ),
            };
        },

        skills: () => ({
            type: "success",
            content: (
                <div className="space-y-3">
                    {skills.categories.map((cat) => (
                        <div key={cat.name}>
                            <p className="text-terminal-accent font-semibold text-base mb-1">
                                {cat.name}
                            </p>
                            {cat.items.map((s) => (
                                <div
                                    key={s.id}
                                    className="flex items-center gap-3 text-base ml-2 mb-1"
                                >
                                    <span className="w-28 shrink-0">
                                        {s.name}
                                    </span>
                                    <div className="flex-1 h-1.5 rounded-full bg-current/10 max-w-48">
                                        <div
                                            className="h-full rounded-full bg-current/50"
                                            style={{
                                                width: `${s.proficiencyLevel}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm opacity-50 w-8">
                                        {s.proficiencyLevel}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ),
        }),

        timeline: () => ({
            type: "success",
            content: (
                <div className="space-y-2">
                    {timeline.entries.map((e) => (
                        <div key={e.id} className="flex gap-3 text-sm">
                            <span className="text-terminal-accent font-mono w-12 shrink-0">
                                {e.versionTag}
                            </span>
                            <span className="opacity-50 w-10 shrink-0">
                                {e.year}
                            </span>
                            <div>
                                <p className="font-medium">{e.title}</p>
                                <p className="text-sm opacity-60">
                                    {e.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ),
        }),

        contact: () => ({ type: "contact", content: null }),

        inspect: () => ({
            type: "info",
            content: (
                <div className="space-y-1 text-base">
                    <p className="text-terminal-accent font-semibold mb-1">
                        Runtime State
                    </p>
                    <p>
                        <span className="opacity-50">Modules loaded:</span>{" "}
                        profile, projects, skills, timeline, philosophy, graph
                    </p>
                    <p>
                        <span className="opacity-50">Projects:</span>{" "}
                        {projects.items.length}
                    </p>
                    <p>
                        <span className="opacity-50">Skill categories:</span>{" "}
                        {skills.categories.length}
                    </p>
                    <p>
                        <span className="opacity-50">Timeline entries:</span>{" "}
                        {timeline.entries.length}
                    </p>
                    <p>
                        <span className="opacity-50">Render time:</span>{" "}
                        {Math.round(performance.now())}ms
                    </p>
                </div>
            ),
        }),

        theme: (args) => {
            const themeName = args[0];
            if (themeName !== "light" && themeName !== "dark") {
                return {
                    type: "error",
                    content: <span>Usage: theme &lt;light|dark&gt;</span>,
                };
            }
            return {
                type: "success",
                content: (
                    <span>
                        Theme switched to{" "}
                        <span className="text-terminal-accent">
                            {themeName}
                        </span>
                    </span>
                ),
            };
        },

        mode: (args) => {
            const modeName = args[0];
            if (modeName !== "hr" && modeName !== "dev") {
                return {
                    type: "error",
                    content: <span>Usage: mode &lt;hr|dev&gt;</span>,
                };
            }
            return {
                type: "mode-switch",
                content: (
                    <span>Switching to {modeName.toUpperCase()} mode...</span>
                ),
            };
        },

        clear: () => ({ type: "clear", content: null }),
    };

    const executeCommand = (input: string): CommandResult => {
        const trimmed = input.trim();
        const parts = trimmed.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        const cmdDef = commandsData.commands.find((c) => c.name === cmd);

        if (!cmdDef) {
            return {
                type: "error",
                content: (
                    <span>
                        Command not found: "{cmd}". Type{" "}
                        <span className="terminal-accent">help</span> for
                        available commands.
                    </span>
                ),
            };
        }

        const requiresArgs = "hasArgs" in cmdDef && cmdDef.hasArgs;
        const hasSubcommands =
            "subcommands" in cmdDef && Array.isArray(cmdDef.subcommands);

        if (!requiresArgs && args.length > 0) {
            return {
                type: "error",
                content: <span>Usage: {cmdDef.usage}</span>,
            };
        }

        if (requiresArgs) {
            if (args.length === 0) {
                return {
                    type: "error",
                    content: <span>Usage: {cmdDef.usage}</span>,
                };
            }

            if (hasSubcommands) {
                const subcommands = cmdDef.subcommands as string[];
                if (args.length !== 1 || !subcommands.includes(args[0])) {
                    return {
                        type: "error",
                        content: <span>Usage: {cmdDef.usage}</span>,
                    };
                }
            }

            if (cmd === "open" && args.length !== 1) {
                if (args.length < 1) {
                    return {
                        type: "error",
                        content: <span>Usage: {cmdDef.usage}</span>,
                    };
                }
            }

            if (cmd !== "open" && !hasSubcommands && args.length > 1) {
                return {
                    type: "error",
                    content: <span>Usage: {cmdDef.usage}</span>,
                };
            }
        }

        const renderer = renderers[cmd];
        if (renderer) {
            return renderer(args);
        }

        return {
            type: "info",
            content: <span>{cmdDef.description}</span>,
        };
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed) return;

        setHistory((prev) => [...prev, trimmed]);
        setHistoryIdx(-1);
        setSuggestions([]);

        const cmdEntry: OutputEntry = { type: "command", content: trimmed };
        const result: CommandResult = executeCommand(trimmed);

        if (result.type === "clear") {
            setOutputs([]);
            setInput("");
            return;
        }

        if (result.type === "mode-switch") {
            setOutputs((prev) => [
                ...prev,
                cmdEntry,
                { type: "info", content: result.content },
            ]);
            const modeName = trimmed.split(/\s+/)[1];
            if (modeName === "hr" || modeName === "dev") {
                setTimeout(() => setMode(modeName), 500);
            }
            setInput("");
            return;
        }

        if (result.type === "contact") {
            setContactOpen(true);
            setOutputs((prev) => [
                ...prev,
                cmdEntry,
                { type: "info", content: "Opening contact form..." },
            ]);
            setInput("");
            return;
        }

        if (trimmed.startsWith("theme ") && result.type === "success") {
            const themeName = trimmed.split(/\s+/)[1];
            if (themeName === "light" || themeName === "dark") {
                setTheme(themeName);
            }
        }

        setOutputs((prev) => [
            ...prev,
            cmdEntry,
            {
                type: result.type as OutputEntry["type"],
                content: result.content,
            },
        ]);
        setInput("");
    };

    return (
        <div
            className="flex flex-col h-full bg-terminal-bg font-mono text-terminal-text"
            onClick={() => inputRef.current?.focus()}
        >
            <div
                ref={outputRef}
                className="flex-1 overflow-y-auto p-4 space-y-2.5"
            >
                {outputs.map((value, index) => (
                    <div key={index} className="animate-fade-in">
                        {value.type === "command" ? (
                            <div className="flex items-start gap-2">
                                <span className="text-terminal-accent shrink-0 text-base">
                                    {uiStrings.terminal.prompt}
                                </span>
                                <span className="text-base">
                                    {value.content}
                                </span>
                            </div>
                        ) : value.type === "error" ? (
                            <div
                                className="text-base"
                                style={{
                                    color: "var(--color-terminal-error)",
                                }}
                            >
                                {value.content}
                            </div>
                        ) : (
                            <div className="text-base ">{value.content}</div>
                        )}
                    </div>
                ))}
            </div>

            {suggestions.length > 0 && (
                <div className="px-4 py-1 border-t border-terminal-border bg-terminal-surface">
                    <div className="flex flex-wrap gap-2">
                        {suggestions.slice(0, 6).map((value, index) => (
                            <button
                                key={index}
                                className="text-xs px-2 py-0.5 rounded bg-terminal-accent/10 text-terminal-accent hover:bg-terminal-accent/20 transition-colors"
                                onClick={() => {
                                    setInput(value);
                                    setSuggestions([]);
                                    inputRef.current?.focus();
                                }}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="flex items-center border-t border-terminal-border px-4 py-3 bg-terminal-surface"
            >
                <span className="text-terminal-accent mr-2 text-base shrink-0">
                    {uiStrings.terminal.prompt}
                </span>

                <input
                    ref={inputRef}
                    value={input}
                    style={{
                        width: input.length === 0 ? "0" : `${input.length}ch`,
                    }}
                    onChange={(e) => {
                        const nextValue = e.target.value;
                        setInput(nextValue);
                        setSuggestionIdx(-1);
                        if (nextValue.trim()) {
                            setSuggestions(
                                getAutocompleteSuggestions(nextValue),
                            );
                        } else {
                            setSuggestions([]);
                        }
                    }}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent outline-none text-base text-terminal-text placeholder:text-terminal-muted caret-transparent p-0 border-0"
                    placeholder=""
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                />
                <span className="w-2 h-4 bg-terminal-accent animate-blink" />
                {input.length === 0 && (
                    <span className="text-base text-terminal-muted select-none">
                        {uiStrings.terminal.placeholder}
                    </span>
                )}
            </form>
        </div>
    );
}
