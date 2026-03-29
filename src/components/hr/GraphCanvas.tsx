import React, { useState, useEffect, useRef } from "react";
import profile from "@/data/profile.json";
import projects from "@/data/projects.json";
import skills from "@/data/skills.json";
import summary from "@/data/summary.json";
import experience from "@/data/experience.json";
import initiatives from "@/data/initiatives.json";
import academics from "@/data/academics.json";
import graphConfig from "@/data/graphConfig.json";

export type NodeType = "root" | "category" | "project" | "skill" | "summary";

export interface ItemNode {
    id: string;
    label: string;
    type: NodeType;
    parentId?: string;
    data?: Record<string, unknown>;
    x: number;
    y: number;
    expanded?: boolean;
    colorObj?: { light: string; dark: string };
}

function getChildrenForCategory(
    categoryId: string,
): Omit<ItemNode, "x" | "y" | "parentId" | "colorObj">[] {
    if (categoryId === "projects") {
        return projects.items.map((p) => ({
            id: p.id.toString(),
            label: p.title,
            type: "project",
            data: p,
        }));
    }
    if (categoryId === "skills") {
        return skills.categories.map((c) => ({
            id: `skills-${c.name.toLowerCase().replace(/\s+/g, "-")}`,
            label: c.name,
            type: "skill",
            data: c,
        }));
    }
    if (categoryId === "summary") {
        return summary.entries.map((t, index) => ({
            id: t.id.toString(),
            label: `${String(index + 1).padStart(2, "0")}. ${t.title}`,
            type: "summary",
            data: t,
        }));
    }
    if (categoryId === "experience") {
        return experience.entries.map((t) => ({
            id: t.id.toString(),
            label: t.title,
            type: "summary",
            data: t,
        }));
    }
    if (categoryId === "initiatives") {
        return initiatives.entries.map((t) => ({
            id: t.id.toString(),
            label: t.title,
            type: "summary",
            data: t,
        }));
    }
    if (categoryId === "academics") {
        return academics.entries.map((t) => ({
            id: t.id.toString(),
            label: t.title,
            type: "summary",
            data: t,
        }));
    }
    return [];
}

function initializeColorPool() {
    return [...graphConfig.colors].sort(() => Math.random() - 0.5);
}

let colorPool: { light: string; dark: string }[] = [];

function getNextColorObj(): { light: string; dark: string } {
    if (colorPool.length === 0) {
        colorPool = initializeColorPool();
    }
    return colorPool.pop()!;
}

const MIN_DISTANCE = 130;

function getRandomValidPosition(
    existingNodes: { x: number; y: number }[],
    width: number,
    height: number,
    padding = 60,
): { x: number; y: number } {
    const topPadding = Math.max(120, padding);
    const rightPadding = padding;
    const bottomPadding = Math.max(120, padding);

    let bestPos = { x: width / 2, y: height / 2 };
    let maxMinDist = 0;

    for (let i = 0; i < 50; i++) {
        const x = padding + Math.random() * (width - padding - rightPadding);
        const y =
            topPadding + Math.random() * (height - topPadding - bottomPadding);

        let minDist = Infinity;
        for (const node of existingNodes) {
            const dist = Math.hypot(x - node.x, y - node.y);
            if (dist < minDist) minDist = dist;
        }

        if (minDist > MIN_DISTANCE) {
            return { x, y };
        }

        if (minDist > maxMinDist) {
            maxMinDist = minDist;
            bestPos = { x, y };
        }
    }

    return bestPos;
}

export default function GraphCanvas({
    onNodeSelect,
}: {
    onNodeSelect: (type: NodeType, data: Record<string, unknown>) => void;
}) {
    const [nodes, setNodes] = useState<ItemNode[]>(() => {
        if (typeof window === "undefined") return [];
        const w = window.innerWidth;
        const h = window.innerHeight;

        colorPool = initializeColorPool();

        const rootPos = { x: w / 2, y: Math.max(350, h / 2) };
        const initialList: ItemNode[] = [
            {
                id: "root",
                label: profile.name,
                type: "root",
                x: rootPos.x,
                y: rootPos.y,
                data: profile,
                colorObj: getNextColorObj(),
            },
        ];

        const categories = [
            {
                id: "projects",
                label: "Projects",
                type: "category" as NodeType,
                parentId: "root",
            },
            {
                id: "skills",
                label: "Skills",
                type: "category" as NodeType,
                parentId: "root",
            },
            {
                id: "summary",
                label: "Summary",
                type: "category" as NodeType,
                parentId: "root",
            },
            {
                id: "experience",
                label: "Experience",
                type: "category" as NodeType,
                parentId: "root",
            },
            {
                id: "initiatives",
                label: "Initiatives",
                type: "category" as NodeType,
                parentId: "root",
            },
            {
                id: "academics",
                label: "Academics",
                type: "category" as NodeType,
                parentId: "root",
            },
        ];

        for (const cat of categories) {
            const pos = getRandomValidPosition(
                initialList.map((n) => ({ x: n.x, y: n.y })),
                w,
                h,
            );
            initialList.push({
                ...cat,
                x: pos.x,
                y: pos.y,
                expanded: false,
                colorObj: getNextColorObj(),
            });
        }

        return initialList;
    });
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === "undefined") return false;
        return document.documentElement.classList.contains("dark");
    });
    const dragState = useRef<{
        id: string;
        startX: number;
        startY: number;
        startClientX: number;
        startClientY: number;
        hasDragged: boolean;
    } | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const paddingX = 60;
            const topPadding = 120;
            const bottomPadding = 120;

            setNodes((ns) =>
                ns.map((n) => {
                    let newX = n.x;
                    let newY = n.y;

                    if (newX < paddingX) newX = paddingX;
                    if (newX > w - paddingX) newX = w - paddingX;
                    if (newY < topPadding) newY = topPadding;
                    if (newY > h - bottomPadding) newY = h - bottomPadding;

                    if (newX !== n.x || newY !== n.y) {
                        return { ...n, x: newX, y: newY };
                    }
                    return n;
                }),
            );
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handlePointerDown = (e: React.PointerEvent, node: ItemNode) => {
        e.stopPropagation();
        dragState.current = {
            id: node.id,
            startX: node.x,
            startY: node.y,
            startClientX: e.clientX,
            startClientY: e.clientY,
            hasDragged: false,
        };
        setDraggingId(node.id);
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (dragState.current) {
            const dx = e.clientX - dragState.current.startClientX;
            const dy = e.clientY - dragState.current.startClientY;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                dragState.current.hasDragged = true;
            }

            const w = window.innerWidth;
            const h = window.innerHeight;

            let rawX = dragState.current.startX + dx;
            let rawY = dragState.current.startY + dy;

            const paddingX = 60;
            const topPadding = 120;
            const bottomPadding = 120;

            rawX = Math.max(paddingX, Math.min(rawX, w - paddingX));
            rawY = Math.max(topPadding, Math.min(rawY, h - bottomPadding));

            setNodes((ns) =>
                ns.map((n) => {
                    if (n.id === dragState.current!.id) {
                        return { ...n, x: rawX, y: rawY };
                    }
                    return n;
                }),
            );
        }
    };

    const handlePointerUp = (e: React.PointerEvent, node: ItemNode) => {
        if (dragState.current) {
            (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
            const hasDragged = dragState.current.hasDragged;
            dragState.current = null;
            setDraggingId(null);

            if (!hasDragged) {
                if (node.type === "category") {
                    toggleCategory(node);
                } else if (node.data) {
                    onNodeSelect(node.type, node.data);
                }
            }
        }
    };

    const toggleCategory = (node: ItemNode) => {
        setNodes((currentNodes) => {
            const isExpanded = node.expanded;
            if (isExpanded) {
                return currentNodes
                    .map((n) =>
                        n.id === node.id ? { ...n, expanded: false } : n,
                    )
                    .filter((n) => n.parentId !== node.id);
            }

            const childrenData = getChildrenForCategory(node.id);
            const w = window.innerWidth;
            const h = window.innerHeight;

            const existingList = currentNodes.map((n) => ({
                x: n.x,
                y: n.y,
            }));

            const newChildren = childrenData.map((child) => {
                const pos = getRandomValidPosition(existingList, w, h);
                existingList.push(pos);
                return {
                    ...child,
                    parentId: node.id,
                    x: pos.x,
                    y: pos.y,
                    colorObj: node.colorObj,
                };
            });

            return [
                ...currentNodes.map((n) =>
                    n.id === node.id ? { ...n, expanded: true } : n,
                ),
                ...newChildren,
            ];
        });
    };

    const edges = nodes
        .filter((n) => n.parentId)
        .map((n) => {
            const parent = nodes.find((p) => p.id === n.parentId);
            if (!parent) return null;
            return { source: parent, target: n };
        })
        .filter((e) => e !== null) as { source: ItemNode; target: ItemNode }[];

    if (nodes.length === 0) return null;

    return (
        <div
            className="w-full h-full overflow-hidden bg-background/50 relative"
            style={{ touchAction: "none" }}
        >
            <div className="absolute inset-0 w-full h-full">
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    {edges.map((edge, idx) => {
                        let targetColor = "#888888";
                        if (edge.target.colorObj) {
                            if (typeof edge.target.colorObj === "string") {
                                targetColor = edge.target.colorObj;
                            } else {
                                targetColor = isDark
                                    ? edge.target.colorObj.dark
                                    : edge.target.colorObj.light;
                            }
                        }
                        return (
                            <line
                                key={idx}
                                x1={edge.source.x}
                                y1={edge.source.y}
                                x2={edge.target.x}
                                y2={edge.target.y}
                                stroke={targetColor}
                                strokeWidth="3"
                                strokeOpacity="0.5"
                                className="transition-colors duration-300"
                            />
                        );
                    })}
                </svg>

                {nodes.map((node) => {
                    const isRoot = node.type === "root";
                    const isCategory = node.type === "category";
                    const isDragging = draggingId === node.id;

                    let activeColor = "#888888";
                    if (node.colorObj) {
                        if (typeof node.colorObj === "string") {
                            activeColor = node.colorObj;
                        } else {
                            activeColor = isDark
                                ? node.colorObj.dark
                                : node.colorObj.light;
                        }
                    }

                    const paintStyles: React.CSSProperties = {};

                    let baseClasses = "";

                    if (isRoot) {
                        baseClasses =
                            "text-white border-[3px] w-20 h-20 rounded-full font-bold text-sm leading-tight px-1";
                        paintStyles.backgroundColor = activeColor;
                        paintStyles.borderColor = activeColor;
                        paintStyles.boxShadow = `0 10px 25px -5px ${activeColor}80`;
                    } else if (isCategory) {
                        baseClasses =
                            "bg-card text-foreground border-[3px] w-[64px] h-[64px] rounded-full font-bold text-[12px] leading-tight px-1";
                        paintStyles.borderColor = activeColor;
                        paintStyles.boxShadow = `0 8px 15px -5px ${activeColor}60`;
                        if (node.expanded) {
                            paintStyles.boxShadow = `0 0 25px 3px ${activeColor}70`;
                        }
                    } else {
                        baseClasses =
                            "bg-card text-muted-foreground border-2 px-3 py-2 rounded-xl max-w-36 break-words text-center text-[11px] leading-tight font-semibold flex items-center justify-center";
                        paintStyles.borderColor = activeColor;
                        paintStyles.boxShadow = `0 4px 10px -3px ${activeColor}50`;
                    }

                    return (
                        <div
                            key={node.id}
                            className={`absolute ${isDragging ? "z-50" : "z-10"}`}
                            style={{ left: node.x, top: node.y }}
                        >
                            <div className="absolute -translate-x-1/2 -translate-y-1/2">
                                <div
                                    className={`${isDragging ? "" : "animate-custom-float"}`}
                                    style={
                                        isDragging
                                            ? undefined
                                            : {
                                                  animationDelay: `${node.x % 3}s`,
                                              }
                                    }
                                >
                                    <div
                                        className={`flex items-center justify-center cursor-grab active:cursor-grabbing select-none
                                            ${baseClasses}
                                            ${isDragging ? "scale-[1.12] ring-4 ring-white/30 transition-none" : "hover:scale-105 active:scale-95 transition-[transform,box-shadow,background-color] duration-200"}`}
                                        style={paintStyles}
                                        onPointerDown={(e) =>
                                            handlePointerDown(e, node)
                                        }
                                        onPointerMove={handlePointerMove}
                                        onPointerUp={(e) =>
                                            handlePointerUp(e, node)
                                        }
                                    >
                                        <span className="text-center">
                                            {node.label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
