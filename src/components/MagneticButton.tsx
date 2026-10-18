"use client";
import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost" | "dark";
  download?: boolean;
  external?: boolean;
  className?: string;
};

// A link that leans toward the pointer, then springs back.
export function MagneticButton({ href, children, variant = "solid", download, external, className = "" }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    gsap.to(ref.current, {
      x: (e.clientX - r.left - r.width / 2) * 0.35,
      y: (e.clientY - r.top - r.height / 2) * 0.35,
      duration: 0.6,
      ease: "power3.out",
    });
  };
  const onLeave = () => ref.current && gsap.to(ref.current, { x: 0, y: 0, duration: 1.2, ease: "elastic.out(1, 0.35)" });

  const styles =
    variant === "solid"
      ? "bg-gold text-ink hover:bg-gold-light"
      : variant === "dark"
        ? "bg-ink text-cream hover:bg-coal"
        : "border border-current/60 text-current hover:bg-current/10";

  return (
    <a
      ref={ref}
      href={href}
      download={download}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3 text-base font-semibold tracking-wide transition-colors duration-500 ${styles} ${className}`}
    >
      {children}
    </a>
  );
}
