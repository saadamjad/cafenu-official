"use client";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

// Coffee-bean cursor that swells over interactive elements. Fine pointers only.
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || prefersReducedMotion() || !dot.current) return;
    const el = dot.current;
    document.documentElement.classList.add("has-custom-cursor");
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });

    const move = (e: PointerEvent) => {
      gsap.set(el, { autoAlpha: 1 });
      x(e.clientX);
      y(e.clientY);
      const hot = (e.target as Element)?.closest?.("a, button, [data-cursor]");
      gsap.to(el, { scale: hot ? 2.6 : 1, duration: 0.3 });
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[80] -ml-2 -mt-3 h-6 w-4 rounded-[50%] bg-mustard opacity-0 mix-blend-difference"
      style={{ rotate: "-30deg" }}
    />
  );
}
