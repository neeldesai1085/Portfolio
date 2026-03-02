import { useCallback, useRef } from "react";
import HRLanding from "@/components/hr/HRLanding";

export default function HRMode() {
    const graphRef = useRef<HTMLDivElement>(null);

    const scrollToGraph = useCallback(() => {
        graphRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    return (
        <div className="h-full overflow-y-auto">
            <HRLanding onScrollToGraph={scrollToGraph} />
        </div>
    );
}