import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function LoadingScreen({ onComplete }) {
  const containerRef = useRef(null);
  const logoIconRef  = useRef(null);
  const wordmarkRef  = useRef(null);
  const taglineRef   = useRef(null);
  const barsRef      = useRef([]);
  const progressRef  = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline();

    // 1. Bars slide in from edges
    tl.fromTo(barsRef.current[0],
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.6, ease: "power3.out" }, 0
    )
    .fromTo(barsRef.current[1],
      { scaleX: 0, transformOrigin: "right center" },
      { scaleX: 1, duration: 0.6, ease: "power3.out" }, 0
    )

    // 2. Logo icon drops in
    .fromTo(logoIconRef.current,
      { scale: 0, rotation: -30, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 0.7, ease: "back.out(1.6)" }, 0.4
    )

    // 3. Wordmark slides in
    .fromTo(wordmarkRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, 0.85
    )

    // 4. Tagline fades up
    .fromTo(taglineRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 1.1
    );

    // 5. Progress bar fill
    const prog = { val: 0 };
    gsap.to(prog, {
      val: 100, duration: 1.8, ease: "power1.inOut",
      onUpdate: () => setProgress(Math.round(prog.val)),
      delay: 0.3,
    });

    // 6. Exit — everything collapses upward
    tl.to(taglineRef.current,
      { opacity: 0, y: -8, duration: 0.3, ease: "power2.in" }, 2.2
    )
    .to([wordmarkRef.current, logoIconRef.current],
      { opacity: 0, scale: 0.85, duration: 0.35, stagger: 0.05, ease: "power2.in" }, 2.35
    )
    .to(barsRef.current,
      { scaleY: 0, transformOrigin: "top center", duration: 0.4, ease: "power3.in" }, 2.5
    )
    .to(containerRef.current,
      { opacity: 0, duration: 0.3, ease: "power2.in",
        onComplete: () => onComplete?.() }, 2.7
    );
  }, []);

  return (
    <div ref={containerRef} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#09080f",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      overflow: "hidden",
    }}>

      {/* Ambient glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,58,237,0.18) 0%, transparent 70%)",
      }} />

      {/* Top cinematic bar */}
      <div ref={el => barsRef.current[0] = el} style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "clamp(32px, 6vh, 56px)",
        background: "#000",
        borderBottom: "1px solid rgba(124,58,237,0.3)",
      }} />

      {/* Bottom cinematic bar */}
      <div ref={el => barsRef.current[1] = el} style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "clamp(32px, 6vh, 56px)",
        background: "#000",
        borderTop: "1px solid rgba(124,58,237,0.3)",
      }} />

      {/* Centre content */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem", position: "relative", zIndex: 1 }}>

        {/* Logo icon */}
        <div ref={logoIconRef} style={{
          width: 72, height: 72, borderRadius: 20,
          background: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 60px rgba(124,58,237,0.7), 0 0 120px rgba(124,58,237,0.3)",
        }}>
          <svg width="36" height="36" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L15 8L8 15L1 8Z" fill="white" opacity="0.95"/>
            <path d="M8 4L12 8L8 12L4 8Z" fill="#f59e0b"/>
          </svg>
        </div>

        {/* Wordmark */}
        <div ref={wordmarkRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            fontWeight: 800, letterSpacing: "0.18em",
            background: "linear-gradient(135deg, #f59e0b 0%, #fcd34d 45%, #f59e0b 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 20px rgba(245,158,11,0.6))",
          }}>
            CINEFLEX
          </span>
        </div>

        {/* Tagline */}
        <p ref={taglineRef} style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "0.85rem", fontWeight: 500,
          letterSpacing: "0.22em", textTransform: "uppercase",
          color: "rgba(157,147,196,0.7)",
        }}>
          Your universe of cinema
        </p>

        {/* Progress bar */}
        <div style={{ width: "clamp(160px, 30vw, 260px)", marginTop: "0.5rem" }}>
          <div style={{
            height: 2, background: "rgba(255,255,255,0.08)",
            borderRadius: 99, overflow: "hidden",
          }}>
            <div style={{
              height: "100%", borderRadius: 99,
              width: `${progress}%`,
              background: "linear-gradient(90deg, #7c3aed, #f59e0b)",
              transition: "width 0.1s linear",
              boxShadow: "0 0 8px rgba(245,158,11,0.5)",
            }} />
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginTop: 6,
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "0.65rem", fontWeight: 600,
            color: "rgba(157,147,196,0.5)",
            letterSpacing: "0.08em",
          }}>
            <span>Loading</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      {/* Shimmer scan line */}
      <div style={{
        position: "absolute", top: 0, left: "-100%", right: 0,
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.6), rgba(245,158,11,0.4), transparent)",
        animation: "cf-scan 2.2s ease-in-out infinite",
        zIndex: 2,
      }} />

      <style>{`
        @keyframes cf-scan {
          0%   { transform: translateX(0); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}