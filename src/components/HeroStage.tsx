"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import type { SceneInput } from "@/components/three/HeroScene";

// WebGL is loaded in its own chunk, only on capable devices, after first paint.
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

function canRender3D() {
  if (prefersReducedMotion()) return false;
  if (!window.matchMedia("(min-width: 768px)").matches) return false;
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

  useEffect(() => {
    if (!canRender3D()) return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const id = idle(() => setShow3D(true));
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
      window.cancelIdleCallback?.(id as number);
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
        scrub: true,
        onUpdate: (self) => (input.current.scroll = self.progress),
      });
      // 2.5D depth: copy drifts up, arch sinks and tilts away as you leave the hero
      gsap.to(root.current!.querySelector("[data-hero-arch]"), {
        yPercent: 18,
        rotateX: 12,
        scale: 0.92,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative w-full [perspective:1200px]">
      {show3D && (
        <div className="pointer-events-none absolute -inset-y-40 inset-x-0 z-[5]">
          <HeroScene input={input} />
        </div>
      )}
      {children}
    </div>
  );
}
