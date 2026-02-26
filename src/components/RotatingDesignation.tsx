import { useEffect, useState } from "react";
import profile from "@/data/profile.json";

export default function RotatingDesignation() {
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % profile.designations.length);
                setFade(true);
            }, 300);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <span
            className="text-xs transition-opacity duration-300"
            style={{ opacity: fade ? 1 : 0 }}
        >
            {profile.designations[index]}
        </span>
    );
}
