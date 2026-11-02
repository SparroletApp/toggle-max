"use client";

import { useEffect } from "react";

export default function CustomCursor() {
    useEffect(() => {
        const cursor = document.querySelector(
            ".custom-cursor"
        ) as HTMLDivElement;

        if (!cursor) return;

        const moveCursor = (e: MouseEvent) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            if (target.closest("a, button")) {
                cursor.classList.add("active");
            } else {
                cursor.classList.remove("active");
            }
        };

        window.addEventListener("mousemove", moveCursor);
        document.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    return <div className="custom-cursor" />;
}