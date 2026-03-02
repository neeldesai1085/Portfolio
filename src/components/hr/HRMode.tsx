import { Suspense, useCallback, useRef, useState, useEffect } from "react";
import { HelpCircle } from "lucide-react";
import HRLanding from "@/components/hr/HRLanding";
import uiStrings from "@/data/uiStrings.json";
import HelpOverlay from "@/components/hr/HelpOverlay";

// const GraphCanvas = lazy(() => import("@/components/hr/GraphCanvas"));

export default function HRMode() {
    const [showHelp, setShowHelp] = useState(true);
    const [graphVisible, setGraphVisible] = useState(false);

    const graphRef = useRef<HTMLDivElement>(null);

    const scrollToGraph = useCallback(() => {
        graphRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        const el = graphRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setGraphVisible(true);
                    observer.disconnect();
                }
            },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="h-full overflow-y-auto">
            <HRLanding onScrollToGraph={scrollToGraph} />

            <section
                ref={graphRef}
                className="relative bg-background border-t border-border"
                style={{
                    height: "calc(100dvh - var(--app-header-height, 52px))",
                }}
            >
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 text-center">
                    <h2 className="text-lg font-semibold text-foreground">
                        {uiStrings.hrMode.sections.exploreTitle}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                        {uiStrings.hrMode.sections.exploreSubtitle}
                    </p>
                </div>

                <div className="absolute inset-0 pt-16">
                    {graphVisible ? (
                        <Suspense
                            fallback={
                                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                    Loading graph...
                                </div>
                            }
                        >
                            {/* <GraphCanvas
                                onSelectNode={handleSelectNode}
                                selectedNodeId={selectedNode?.id ?? null}
                                onCanvasClick={handleCanvasClick}
                            /> */}
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
            </section>
        </div>
    );
}
