import { Suspense, useCallback, useRef, useState, useEffect } from "react";
import { HelpCircle } from "lucide-react";
import HRLanding from "@/components/hr/HRLanding";
import uiStrings from "@/data/uiStrings.json";
import HelpOverlay from "@/components/hr/HelpOverlay";
import GraphCanvas from "@/components/hr/GraphCanvas";
import type { NodeType } from "@/components/hr/GraphCanvas";
import GraphOverlay from "@/components/hr/GraphOverlay";

export default function HRMode() {
    const [showHelp, setShowHelp] = useState(false);
    const [graphVisible, setGraphVisible] = useState(false);
    const [selectedNodeData, setSelectedNodeData] = useState<Record<
        string,
        unknown
    > | null>(null);
    const [selectedNodeType, setSelectedNodeType] = useState<NodeType | null>(
        null,
    );

    const graphRef = useRef<HTMLDivElement>(null);

    const scrollToGraph = useCallback(() => {
        graphRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const handleNodeSelect = useCallback(
        (type: NodeType, data: Record<string, unknown>) => {
            setSelectedNodeType(type);
            setSelectedNodeData(data);
        },
        [],
    );

    const handleOverlayClose = useCallback(() => {
        setSelectedNodeData(null);
        setSelectedNodeType(null);
    }, []);

    useEffect(() => {
        const el = graphRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setGraphVisible(true);
                observer.disconnect();
            }
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="h-full overflow-y-auto">
            <HRLanding onScrollToGraph={scrollToGraph} />

            <section
                ref={graphRef}
                className="relative bg-background border-t border-border overflow-hidden"
                style={{
                    height: "calc(100dvh - var(--app-header-height, 52px))",
                }}
            >
                <div className="absolute top-0 w-full z-20 text-center pointer-events-none">
                    <div className="bg-background/80 backdrop-blur-xl px-6 py-3 border-b border-border/50 shadow-sm w-full">
                        <h2 className="text-lg font-semibold text-foreground">
                            {uiStrings.hrMode.sections.exploreTitle}
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {uiStrings.hrMode.sections.exploreSubtitle}
                        </p>
                    </div>
                </div>

                <div className="absolute inset-0">
                    {graphVisible ? (
                        <Suspense
                            fallback={
                                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                    Loading graph...
                                </div>
                            }
                        >
                            <GraphCanvas onNodeSelect={handleNodeSelect} />
                        </Suspense>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                            Loading graph...
                        </div>
                    )}
                </div>

                {showHelp && <HelpOverlay onClose={() => setShowHelp(false)} />}

                {!showHelp && (
                    <button
                        onClick={() => setShowHelp(true)}
                        className="absolute bottom-4 left-4 z-30 h-9 w-9 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Show help"
                    >
                        <HelpCircle className="h-4 w-4" />
                    </button>
                )}

                <GraphOverlay
                    type={selectedNodeType}
                    data={selectedNodeData}
                    onClose={handleOverlayClose}
                />
            </section>
        </div>
    );
}
