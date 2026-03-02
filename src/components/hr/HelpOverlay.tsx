import uiStrings from "@/data/uiStrings.json";
import { X } from "lucide-react";

export default function HelpOverlay({ onClose }: { onClose: () => void }) {
    return (
        <div className="absolute bottom-4 left-4 z-30 bg-card border border-border rounded-lg shadow-lg p-4 max-w-xs animate-fade-in">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-card-foreground">
                    {uiStrings.hrMode.helpTitle}
                </h3>
                <button
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1.5">
                {uiStrings.hrMode.helpItems.map((item, i) => (
                    <li key={i}>
                        •{" "}
                        <strong>{item.split(" ").slice(0, 1).join(" ")}</strong>{" "}
                        {item.split(" ").slice(1).join(" ")}
                    </li>
                ))}
            </ul>
        </div>
    );
}