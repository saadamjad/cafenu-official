"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import type { SceneInput } from "@/components/three/HeroScene";

// WebGL is loaded in its own chunk, only on capable devices, after first paint.
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

function canRender3D() {
  if (prefersReducedMotion()) return false;
  if ((navigator.hardwareConcurrency ?? 4) < 4) return false;
  // @ts-expect-error -- non-standard but widely supported
  if (navigator.connection?.saveData) return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HeroStage({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<SceneInput>({ scroll: 0, px: 0, py: 0 });
  const [show3D, setShow3D] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    if (!canRender3D()) return;
    // phones get a lighter scene (fewer beans, no shadows, capped pixel ratio) and only start it on the
    // first touch/scroll, so downloading three.js never competes with the first paint on slow devices
    const isCompact = !window.matchMedia("(min-width: 768px)").matches;
    const start = () => {
      setCompact(isCompact);
      setShow3D(true);
    };
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    let id = 0;
    let fallback = 0;
    const wake = () => {
      ["touchstart", "scroll", "pointerdown"].forEach((e) => window.removeEventListener(e, wake));
      window.clearTimeout(fallback);
      start();
    };
    if (isCompact) {
      ["touchstart", "scroll", "pointerdown"].forEach((e) => window.addEventListener(e, wake, { once: true, passive: true }));
      fallback = window.setTimeout(wake, 6000);
    } else {
      id = idle(start) as number;
    }
    const onMove = (e: PointerEvent) => {
      input.current.px = (e.clientX / window.innerWidth) * 2 - 1;
      input.current.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      input.current.px = Math.max(-1, Math.min(1, (e.gamma ?? 0) / 30));
      input.current.py = Math.max(-1, Math.min(1, ((e.beta ?? 45) - 45) / 30));
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("deviceorientation", onTilt);
    return () => {
      window.cancelIdleCallback?.(id);
      window.clearTimeout(fallback);
      ["touchstart", "scroll", "pointerdown"].forEach((e) => window.removeEventListener(e, wake));
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const section = root.current!.closest("section")!;
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => (input.current.scroll = self.progress),
      });
      // 2.5D depth: copy drifts up, arch sinks and tilts away as you leave the hero
      gsap.to(root.current!.querySelector("[data-hero-arch]"), {
        yPercent: 18,
        rotateX: 12,
        scale: 0.92,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 1.2 },
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative w-full [perspective:1200px]">
      {show3D && (
        <div
          className={`pointer-events-none absolute inset-x-0 z-[5] ${
            // phones: scene lives over the photo below the copy, never on top of the text
            compact ? "bottom-0 h-[55%]" : "-inset-y-40"
          }`}
        >
          <HeroScene input={input} compact={compact} />
        </div>
      )}
      {children}
    </div>
  );
}
