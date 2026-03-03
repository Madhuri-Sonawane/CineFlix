import { useRef, useEffect } from "react";
import gsap from "gsap";

const MOODS = [
  { label: "😂 Comedy",    emoji: "😂", genreIds: [35],       color: "#f59e0b" },
  { label: "💥 Action",    emoji: "💥", genreIds: [28],       color: "#ef4444" },
  { label: "😱 Thriller",  emoji: "😱", genreIds: [53, 27],   color: "#8b5cf6" },
  { label: "💕 Romance",   emoji: "💕", genreIds: [10749],    color: "#ec4899" },
  { label: "🚀 Sci-Fi",    emoji: "🚀", genreIds: [878],      color: "#06b6d4" },
  { label: "🎭 Drama",     emoji: "🎭", genreIds: [18],       color: "#a78bfa" },
  { label: "🧙 Fantasy",   emoji: "🧙", genreIds: [14, 12],   color: "#34d399" },
  { label: "🔍 Mystery",   emoji: "🔍", genreIds: [9648, 80], color: "#94a3b8" },
];

export default function MoodBar({ activeMood, onSelect }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, []);

  const isActive = (mood) =>
    activeMood &&
    mood.genreIds.length === activeMood.length &&
    mood.genreIds.every(id => activeMood.includes(id));

  const handleClick = (mood) => {
    if (isActive(mood)) {
      onSelect(null); // deselect
    } else {
      onSelect(mood.genreIds);
    }
  };

  return (
    <div ref={containerRef} style={{ marginBottom: "2rem" }}>
      {/* Label */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.85rem" }}>
        <span style={{ fontSize: "1rem" }}>✨</span>
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "0.72rem", fontWeight: 700,
          letterSpacing: "0.12em", textTransform: "uppercase",
          color: "var(--brand-text-muted)",
        }}>
          I'm in the mood for…
        </p>
        {activeMood && (
          <button onClick={() => onSelect(null)} style={{
            marginLeft: "auto",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "0.7rem", fontWeight: 600,
            color: "#a78bfa",
            background: "rgba(124,58,237,0.12)",
            border: "1px solid rgba(124,58,237,0.25)",
            borderRadius: 6, padding: "3px 10px", cursor: "pointer",
          }}>
            Clear
          </button>
        )}
      </div>

      {/* Mood pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {MOODS.map(mood => {
          const active = isActive(mood);
          return (
            <button
              key={mood.label}
              onClick={() => handleClick(mood)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "8px 16px",
                background: active
                  ? `${mood.color}22`
                  : "rgba(255,255,255,0.04)",
                border: `1.5px solid ${active ? mood.color + "88" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 99, cursor: "pointer",
                transition: "all 0.2s ease",
                transform: active ? "scale(1.06)" : "scale(1)",
                boxShadow: active ? `0 0 16px ${mood.color}44` : "none",
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = `${mood.color}18`;
                  e.currentTarget.style.borderColor = `${mood.color}55`;
                  e.currentTarget.style.transform = "scale(1.04)";
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.transform = "scale(1)";
                }
              }}
            >
              <span style={{ fontSize: "0.9rem" }}>{mood.emoji}</span>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.8rem", fontWeight: active ? 700 : 500,
                color: active ? "#f1eeff" : "var(--brand-text-dim)",
                transition: "color 0.2s ease",
              }}>
                {mood.label.split(" ").slice(1).join(" ")}
              </span>
              {active && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={mood.color} strokeWidth="3.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}