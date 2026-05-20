"use client";

import { useEffect } from "react";

export function SpotlightRuntime() {
  useEffect(() => {
    const update = (event: PointerEvent) => {
      document.querySelectorAll<HTMLElement>(".spotlight-card").forEach((card) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
      });
    };

    window.addEventListener("pointermove", update);
    return () => window.removeEventListener("pointermove", update);
  }, []);

  return null;
}
