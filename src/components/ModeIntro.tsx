export default function ModeIntro({
    mode,
    onComplete,
}: {
    mode: "dev" | "hr";
    onComplete: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white text-2xl font-bold animate-fade-in"
            onAnimationEnd={onComplete}
        >
            {mode === "dev" ? "Switching to Developer Mode..." : "Switching to HR Mode..."}
        </div>
    );
}